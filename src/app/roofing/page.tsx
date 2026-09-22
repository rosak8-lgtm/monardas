import { RoofingPage } from "@/components/roofing-page";
import { commercialPages } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  commercialPages.roofing.title,
  commercialPages.roofing.description,
  "/roofing",
);

export default function Page() {
  return <RoofingPage />;
}
