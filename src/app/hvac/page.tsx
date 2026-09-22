import { HVACPage } from "@/components/hvac-page";
import { commercialPages } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  commercialPages.hvac.title,
  commercialPages.hvac.description,
  "/hvac",
);

export default function Page() {
  return <HVACPage />;
}
