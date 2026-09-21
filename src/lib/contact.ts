export const industries = [
  "Roofing",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Restoration",
  "Other",
];
export const volumes = ["Under 50", "50–100", "101–250", "251–500", "501+"];
export type ContactData = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  volume: string;
  crm: string;
  message: string;
  website: string;
};
export type Errors = Partial<Record<keyof ContactData, string>>;
export function validate(data: ContactData): Errors {
  const errors: Errors = {};
  for (const field of [
    "firstName",
    "lastName",
    "company",
    "email",
    "phone",
    "industry",
    "volume",
  ] as const) {
    if (!data[field]?.trim()) errors[field] = "This field is required.";
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email address.";
  if (
    data.phone &&
    (!/^\+?[\d\s().-]{7,25}$/.test(data.phone) ||
      data.phone.replace(/\D/g, "").length < 7)
  )
    errors.phone = "Enter a valid phone number.";
  if (data.industry && !industries.includes(data.industry))
    errors.industry = "Select your industry.";
  if (data.volume && !volumes.includes(data.volume))
    errors.volume = "Select your estimate volume.";
  for (const field of [
    "firstName",
    "lastName",
    "company",
    "email",
    "crm",
  ] as const)
    if (data[field]?.length > 200)
      errors[field] = "Use 200 characters or fewer.";
  if (data.message?.length > 3000)
    errors.message = "Use 3,000 characters or fewer.";
  return errors;
}
