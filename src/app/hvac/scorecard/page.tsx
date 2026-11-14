import { HVACScorecard } from "@/components/hvac-scorecard";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Free HVAC Follow-Up Leak Check",
  "Free 3-minute self-assessment for residential HVAC companies. Find unsold-estimate follow-up gaps. No signup and no customer data upload.",
  "/hvac/scorecard",
);

export default function Page() {
  return <HVACScorecard />;
}
