import { AIPage } from "@/components/ai-page";
import { commercialPages } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  commercialPages.ai.title,
  commercialPages.ai.description,
  "/ai",
);

export default function Page() {
  return <AIPage />;
}
