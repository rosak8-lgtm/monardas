/** Short-lived, opaque email-verification tokens for explicitly requested HVAC updates.
 * Uses the website's existing server-side RESEND_API_KEY as a cryptographic root,
 * with domain separation. A key rotation invalidates unconfirmed links safely.
 * This never extracts addresses from the prospecting/CRM database.
 */
const PURPOSE = "monardas-hvac-updates-v1";
const LIFETIME_MS = 48 * 60 * 60 * 1000;
const encoder = new TextEncoder();

export function cleanMarketingEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  if (
    email.length > 254 ||
    !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email)
  ) return null;
  return email;
}

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function unbase64url(value: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]{32,2000}$/.test(value)) throw Error("BAD_TOKEN");
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
}
async function secretKey(apiKey: string): Promise<CryptoKey> {
  if (apiKey.length < 16) throw Error("CONFIG_MISSING");
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode("MONARDAS:HVAC:EMAIL-OPTIN:V1:" + apiKey),
  );
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export type VerifiedMarketingConsent = {
  email: string;
  firstName: string;
  createdAt: number;
  purpose: typeof PURPOSE;
};

export async function makeMarketingToken(
  emailValue: string, nameValue: string, apiKey: string, now = Date.now(),
): Promise<string> {
  const email = cleanMarketingEmail(emailValue);
  if (!email || !Number.isFinite(now)) throw Error("BAD_CONSENT_DETAILS");
  const payload: VerifiedMarketingConsent = {
    email,
    firstName: nameValue.trim().slice(0, 80),
    createdAt: now,
    purpose: PURPOSE,
  };
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = encoder.encode(JSON.stringify(payload));
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await secretKey(apiKey), data),
  );
  const combined = new Uint8Array(iv.length + ciphertext.length);
  combined.set(iv, 0);
  combined.set(ciphertext, iv.length);
  return base64url(combined);
}

export async function verifyMarketingToken(
  token: string, apiKey: string, now = Date.now(),
): Promise<VerifiedMarketingConsent | null> {
  try {
    const bytes = unbase64url(token);
    if (bytes.length < 12 + 16 + 20) return null;
    const iv = bytes.slice(0, 12);
    const ciphertext = bytes.slice(12);
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv }, await secretKey(apiKey), ciphertext,
    );
    const value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(plaintext)) as Partial<VerifiedMarketingConsent>;
    if (
      value.purpose !== PURPOSE ||
      typeof value.email !== "string" ||
      cleanMarketingEmail(value.email) !== value.email ||
      typeof value.firstName !== "string" ||
      value.firstName.length > 80 ||
      typeof value.createdAt !== "number" ||
      !Number.isFinite(value.createdAt) ||
      now < value.createdAt ||
      now - value.createdAt > LIFETIME_MS
    ) return null;
    return value as VerifiedMarketingConsent;
  } catch {
    return null;
  }
}
