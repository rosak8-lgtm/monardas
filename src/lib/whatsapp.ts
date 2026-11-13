/** Direct client-initiated WhatsApp contact for the MONARDAS HVAC pilot.
 * This is NOT WhatsApp Cloud API registration or outbound broadcast.
 * A visitor chooses to open WhatsApp and must press Send themselves.
 */
export const MONARDAS_WHATSAPP_PHONE_E164 = "+995555516420";
export const MONARDAS_WHATSAPP_PHONE_DIGITS = "995555516420";
const assessmentMessage =
  "Hello MONARDAS, I would like a free assessment of my unsold HVAC replacement estimates.";
export const MONARDAS_HVAC_WHATSAPP_URL =
  `https://wa.me/${MONARDAS_WHATSAPP_PHONE_DIGITS}?text=${encodeURIComponent(assessmentMessage)}`;
