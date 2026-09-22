import { CurrentFocusPage } from "@/components/current-focus-page";
import { commercialPages } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  commercialPages["current-focus"].title,
  commercialPages["current-focus"].description,
  "/current-focus",
);

export default function Page() {
  return <CurrentFocusPage />;
}
