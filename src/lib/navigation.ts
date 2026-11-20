export function isProductPath(path: string | null) {
  const current = path?.replace(/\/$/, "") || "/";
  return current === "/" || current.startsWith("/hvac") || [
    "/ai", "/roofing", "/current-focus", "/contact", "/how-it-works", "/pricing",
  ].includes(current);
}

// Visitor-first navigation. Corporate disciplines remain reachable via Company,
// but the core action is always the same: understand the HVAC offer and apply.
export const commercialNavigation = {
  Explore: [
    ["Interactive demo", "/hvac/demo"],
    ["Follow-up scorecard", "/hvac/scorecard"],
    ["How it works", "/hvac#system"],
    ["Pricing & availability", "/pricing"],
    ["HVAC solution", "/hvac"],
  ],
  "For teams": [
    ["30-day free pilot", "/hvac/free-pilot"],
    ["Agency partnerships", "/contact?intent=agency-partner"],
    ["Business inquiries", "/contact"],
  ],
  Company: [
    ["About MONARDAS AI", "/ai"],
    ["Founder", "/founder"],
    ["Strategy", "/strategy"],
    ["Systems", "/systems"],
    ["Ventures", "/ventures"],
    ["Capital", "/capital"],
    ["Commerce", "/commerce"],
    ["Nature", "/nature"],
  ],
};

export const productGroups = {
  Product: [
    ["HVAC estimate recovery", "/hvac"],
    ["Pricing & availability", "/pricing"],
    ["Live demo (fictional data)", "/hvac/demo"],
    ["Free follow-up scorecard", "/hvac/scorecard"],
  ],
  "Get started": [
    ["30-day founding pilot", "/hvac/free-pilot"],
    ["HVAC agency introduction", "/contact?intent=agency-partner"],
    ["Business contact", "/contact"],
  ],
  Company: [
    ["MONARDAS AI", "/ai"],
    ["Founder", "/founder"],
    ["Strategy", "/strategy"],
  ],
};
