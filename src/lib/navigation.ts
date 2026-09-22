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
  Platform: [
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
    ["Revenue Recovery Audit", "/contact"],
    ["Founding Partner Program", "/hvac#founding-partners"],
  ],
};
