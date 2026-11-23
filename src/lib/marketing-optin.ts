/** Signed, short-lived email ownership challenge for explicitly requested HVAC updates.
 * This module never imports prospect lists, and may not subscribe a user on GET.
 */
const PURPOSE = "monardas-hvac-email-updates-v2";
const TTL_MS = 48 * 60 * 60 * 1000;
const encoder = new TextEncoder();

export function normalizeOptInEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  if (email.length < 6 || email.length > 254 || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email)) return null;
  return email;
}

function toBase64Url(data: Uint8Array): string {
  let binary = "";
  for (const byte of data) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]{36,1500}$/.test(value)) return null;
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
  } catch { return null; }
}

async function cryptographicKey(secret: string): Promise<CryptoKey> {
  if (secret.length < 32) throw Error("MARKETING_OPTIN_SECRET_NOT_CONFIGURED");
  const digest = await crypto.subtle.digest(
    "SHA-256", encoder.encode("MONARDAS:marketing-optin:v2:" + secret),
  );
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export type MarketingConsentChallenge = {
  email: string;
  firstName: string;
  issuedMs: number;
  purpose: typeof PURPOSE;
};

export async function makeOptInChallenge(
  emailInput: string, firstNameInput: string, secret: string, now = Date.now(),
): Promise<string> {
  const email = normalizeOptInEmail(emailInput);
  if (!email || !Number.isFinite(now)) throw Error("INVALID_OPTIN_DATA");
  const payload: MarketingConsentChallenge = {
    email,
    firstName: firstNameInput.trim().slice(0, 80),
    issuedMs: now,
    purpose: PURPOSE,
  };
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt(
    { name: "AES-GCM", iv }, await cryptographicKey(secret), encoder.encode(JSON.stringify(payload)),
  ));
  const bytes = new Uint8Array(iv.length + ciphertext.length);
  bytes.set(iv);
  bytes.set(ciphertext, iv.length);
  return toBase64Url(bytes);
}

export async function verifyOptInChallenge(
  token: string, secret: string, now = Date.now(),
): Promise<MarketingConsentChallenge | null> {
  try {
    const bytes = fromBase64Url(token);
    if (!bytes || bytes.length < 12 + 16 + 45) return null;
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: bytes.slice(0, 12) },
      await cryptographicKey(secret), bytes.slice(12),
    );
    const value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(plaintext)) as Partial<MarketingConsentChallenge>;
    if (
      value.purpose !== PURPOSE || typeof value.email !== "string" ||
      normalizeOptInEmail(value.email) !== value.email ||
      typeof value.firstName !== "string" || value.firstName.length > 80 ||
      typeof value.issuedMs !== "number" || !Number.isFinite(value.issuedMs) ||
      !Number.isFinite(now) || value.issuedMs > now || now - value.issuedMs > TTL_MS
    ) return null;
    return value as MarketingConsentChallenge;
  } catch { return null; }
}
