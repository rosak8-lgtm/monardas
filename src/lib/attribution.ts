export const campaignKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
export type Attribution = Partial<
  Record<(typeof campaignKeys)[number] | "landing_page" | "referrer", string>
>;
const publicPath =
  /^\/(?:hvac|ai|contact|current-focus|privacy|terms|refund-policy|pricing|how-it-works|systems|ventures|capital|commerce|nature|strategy|founder|roofing)?\/?$/;

// Keep campaign labels, known public paths and referrer origins, never full URLs.
export function sanitizeAttribution(input: unknown): Attribution {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const values = input as Record<string, unknown>;
  const result: Attribution = {};
  for (const key of campaignKeys) {
    const value = values[key];
    if (typeof value === "string" && /^[a-zA-Z0-9 ._~+-]{1,100}$/.test(value))
      result[key] = value;
  }
  if (
    typeof values.landing_page === "string" &&
    publicPath.test(values.landing_page)
  )
    result.landing_page = values.landing_page;
  if (typeof values.referrer === "string" && values.referrer.length <= 300) {
    try {
      const url = new URL(values.referrer);
      if (
        ["https:", "http:"].includes(url.protocol) &&
        !url.username &&
        !url.password
      )
        result.referrer = url.origin;
    } catch {
      /* Invalid attribution never prevents an inquiry. */
    }
  }
  return result;
}
const storageKey = "monardas:attribution";
export function measurementAllowed() {
  return (
    typeof navigator !== "undefined" &&
    navigator.doNotTrack !== "1" &&
    !(navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl
  );
}
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  if (!measurementAllowed()) {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      /* Storage may be blocked. */
    }
    return {};
  }
  let saved: Attribution = {};
  try {
    saved = sanitizeAttribution(
      JSON.parse(sessionStorage.getItem(storageKey) || "{}"),
    );
  } catch {
    /* Continue without stored attribution. */
  }
  const url = new URL(window.location.href);
  const campaign = sanitizeAttribution(Object.fromEntries(url.searchParams));
  const result = sanitizeAttribution({
    ...saved,
    ...campaign,
    landing_page: saved.landing_page || url.pathname,
    referrer: saved.landing_page ? saved.referrer : document.referrer,
  });
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(result));
  } catch {
    /* Submission still works without storage. */
  }
  return result;
}
