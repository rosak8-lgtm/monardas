export function isProductPath(path: string | null) {
  return [
    "/ai",
    "/hvac",
    "/roofing",
    "/current-focus",
    "/contact",
    "/how-it-works",
    "/pricing",
  ].includes(path?.replace(/\/$/, "") || "/");
}

export const productGroups = {
  Recovery: [
    ["MONARDAS AI", "/ai"],
    ["HVAC Revenue Recovery", "/hvac"],
    ["Current Focus", "/current-focus"],
  ],
  Company: [
    ["MONARDAS Holding", "/"],
    ["Founder", "/founder"],
    ["Strategy", "/strategy"],
  ],
  "Next step": [
    ["Get a Free Estimate Recovery Assessment", "/contact?intent=hvac-pilot"],
    ["Founder-led Recovery Pilot", "/hvac#founding-partners"],
  ],
};
