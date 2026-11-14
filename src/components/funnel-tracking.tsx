"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution, measurementAllowed } from "@/lib/attribution";
import type { ClientEvent } from "@/lib/funnel";
export function FunnelTracking() {
  const pathname = usePathname();
  const lastView = useRef<string | null>(null);
  useEffect(() => {
    captureAttribution();
    const send = (event: ClientEvent) => {
      if (!measurementAllowed()) return;
      void fetch("/api/events", {
        method: "POST",
        credentials: "omit",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, path: pathname }),
      }).catch(() => {
        /* Measurement never blocks the form or navigation. */
      });
    };
    if (lastView.current !== pathname) {
      lastView.current = pathname;
      if (pathname === "/hvac") send("hvac_page_view");
      if (pathname === "/hvac/scorecard") send("scorecard_page_view");
      if (pathname === "/contact") send("contact_form_view");
    }
    const click = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (pathname === "/hvac/scorecard" && event.target.closest('button[data-growth-share="true"]')) {
        send("scorecard_share_click");
        return;
      }
      const link = event.target.closest("a");
      if (!link) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin) return;
      if (pathname === "/hvac") {
        if (url.pathname === "/hvac/scorecard") send("hvac_scorecard_cta_click");
        if (url.pathname === "/contact" && url.searchParams.get("intent") === "hvac-pilot")
          send("hvac_audit_cta_click");
      }
      if (pathname === "/hvac/scorecard" && url.pathname === "/contact") {
        if (url.searchParams.get("intent") === "hvac-pilot") send("scorecard_assessment_cta_click");
        if (url.searchParams.get("intent") === "agency-partner") send("scorecard_partner_cta_click");
      }
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [pathname]);
  return null;
}
