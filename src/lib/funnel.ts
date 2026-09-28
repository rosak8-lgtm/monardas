export type ClientEvent =
  "hvac_page_view" | "hvac_audit_cta_click" | "contact_form_view";
export function validFunnelEvent(
  event: unknown,
  path: unknown,
): event is ClientEvent {
  return (
    (event === "contact_form_view" && path === "/contact") ||
    ((event === "hvac_page_view" || event === "hvac_audit_cta_click") &&
      path === "/hvac")
  );
}
export function logFunnelEvent(
  event: ClientEvent | "hvac_audit_submit_success",
  path: string,
) {
  // Existing Workers Logs only. No lead fields, campaign values or visitor IDs.
  console.info(JSON.stringify({ type: "monardas_funnel", event, path }));
}
