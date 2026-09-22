import { CurrentFocusPage } from "@/components/current-focus-page";
import { pages } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  pages.ai.title,
  pages.ai.description,
  "/current-focus",
);

export default function Page() {
  return <CurrentFocusPage />;
}
