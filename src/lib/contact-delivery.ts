import type { ContactData } from "./contact";

export type RuntimeContactConfig = {
  to: string;
  from: string;
};

const email = "[^\\s<>@]+@[^\\s<>@]+\\.[^\\s<>@]+";
const emailPattern = new RegExp(`^${email}$`);
const fromPattern = new RegExp(`^(?:${email}|.+\\s<${email}>)$`);

export function isValidContactTo(value: string) {
  return emailPattern.test(value);
}

export function isValidContactFrom(value: string) {
  return fromPattern.test(value);
}

export function isValidRuntimeContactConfig(config: RuntimeContactConfig) {
  return isValidContactTo(config.to) && isValidContactFrom(config.from);
}

export function escapeHtml(value: string) {
  return value.replace(
    /[&<>'\"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

export function createResendPayload(
  data: ContactData,
  config: RuntimeContactConfig,
) {
  const fields = [
    ["First name", data.firstName],
    ["Last name", data.lastName],
    ["Company", data.company],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Industry", data.industry],
    ["Monthly estimate volume", data.volume],
    ["CRM / FSM", data.crm || "Not provided"],
    ["Message", data.message || "Not provided"],
  ] as const;
  const text = fields.map(([label, value]) => `${label}: ${value}`).join("\n");
  const rows = fields
    .map(
      ([label, value]) =>
        `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td>${escapeHtml(value).replaceAll("\n", "<br>")}</td></tr>`,
    )
    .join("");
  return {
    from: config.from,
    to: config.to,
    reply_to: data.email,
    subject: `MONARDAS Revenue Recovery Audit — ${data.company}`,
    text,
    html: `<h1>MONARDAS Revenue Recovery Audit</h1><table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse">${rows}</table>`,
  };
}
