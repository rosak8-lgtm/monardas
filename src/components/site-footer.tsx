"use client";
import { usePathname } from "next/navigation";
import { Footer } from "./site";
import { isProductPath } from "@/lib/navigation";

export function SiteFooter() {
  return <Footer product={isProductPath(usePathname())} />;
}
