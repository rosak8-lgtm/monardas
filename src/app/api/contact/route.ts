import { NextResponse } from "next/server";
import { validate, type ContactData } from "@/lib/contact";
import {
  createResendPayload,
  isValidRuntimeContactConfig,
  isValidContactTo,
} from "@/lib/contact-delivery";
import { env as workerEnv } from "cloudflare:workers";
import { sanitizeAttribution } from "@/lib/attribution";
import { logFunnelEvent } from "@/lib/funnel";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function readRuntimeValueExactly(
  name: "RESEND_API_KEY" | "CONTACT_TO" | "CONTACT_FROM" | "CONTACT_BACKUP_TO",
) {
  return (
    (workerEnv as Record<string, unknown>)[name] ??
    (process.env as Record<string, string | undefined>)[name]
  );
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json(
      { error: "Expected a JSON submission." },
      { status: 415 },
    );
  const origin = request.headers.get("origin");
  // Next's dev server may normalize request.url to localhost even when the
  // browser uses 127.0.0.1. Compare against the actual HTTP Host, not that alias.
  const requestUrl = new URL(request.url);
  const host = request.headers.get("host") ?? requestUrl.host;
  const expectedOrigin = `${requestUrl.protocol}//${host}`;
  if (origin && origin !== expectedOrigin)
    return NextResponse.json(
      { error: "Submission origin is not allowed." },
      { status: 403 },
    );
  try {
    const raw = await request.text();
    if (raw.length > 12000)
      return NextResponse.json(
        { error: "Submission is too large." },
        { status: 413 },
      );
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Invalid submission." },
        { status: 400 },
      );
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      return NextResponse.json(
        { error: "Invalid submission." },
        { status: 400 },
      );
    const values = body as Record<string, unknown>;
    if (values.intent !== undefined && !["hvac-pilot", "agency-partner", "hvac-free-pilot"].includes(values.intent as string))
      return NextResponse.json(
        { error: "Invalid request intent." },
        { status: 400 },
      );
    const keys = [
      "firstName",
      "lastName",
      "company",
      "email",
      "phone",
      "industry",
      "volume",
      "crm",
      "message",
      "website",
      "telegramHandle",
    ] as const;
    const data = {} as ContactData;
    if (values.intent === "hvac-pilot" || values.intent === "agency-partner" || values.intent === "hvac-free-pilot") {
      if (
        values.companyWebsite !== undefined &&
        typeof values.companyWebsite !== "string"
      )
        return NextResponse.json(
          { error: "Invalid company website." },
          { status: 400 },
        );
      data.intent = values.intent;
      data.companyWebsite =
        (values.companyWebsite as string | undefined)?.trim() || "";
    }
    for (const key of keys) {
      if (
        values[key] === undefined &&
        !["firstName", "company", "email"].includes(key)
      ) {
        data[key] = "";
        continue;
      }
      if (typeof values[key] !== "string")
        return NextResponse.json(
          { error: "Please complete the form fields." },
          { status: 400 },
        );
      data[key] = (values[key] as string).trim();
    }
    if (values.preferredChannel !== undefined && 
        !["email", "whatsapp", "telegram"].includes(values.preferredChannel as string))
      return NextResponse.json({ error: "Invalid reply channel." }, { status: 400 });
    data.preferredChannel = values.preferredChannel === "whatsapp" ? "whatsapp" :
      values.preferredChannel === "telegram" ? "telegram" : "email";
    if (data.website)
      return NextResponse.json(
        { error: "Unable to accept this submission." },
        { status: 400 },
      );
    const errors = validate(data);
    if (Object.keys(errors).length)
      return NextResponse.json(
        { error: "Please check your contact details.", errors },
        { status: 400 },
      );
    const apiKey = readRuntimeValueExactly("RESEND_API_KEY");
    const to = readRuntimeValueExactly("CONTACT_TO");
    const from = readRuntimeValueExactly("CONTACT_FROM");
    const backupTo = readRuntimeValueExactly("CONTACT_BACKUP_TO");
    if (
      typeof apiKey !== "string" ||
      typeof to !== "string" ||
      typeof from !== "string" ||
      (backupTo !== undefined &&
        (typeof backupTo !== "string" || !isValidContactTo(backupTo))) ||
      !isValidRuntimeContactConfig({ to, from })
    )
      return NextResponse.json(
        {
          error:
            "Lead delivery is temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      );
    data.attribution = sanitizeAttribution(values.attribution);
    const lead = createResendPayload(data, {
      to,
      from,
      ...(typeof backupTo === "string" ? { backupTo } : {}),
    });
    const resend = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lead),
    });
    if (!resend.ok)
      return NextResponse.json(
        {
          error:
            "We could not send your request right now. Please try again later.",
        },
        { status: 502 },
      );
    const result = (await resend.json()) as { id?: string };
    // Event-only instrumentation: Resend HTTP acceptance is NOT final inbox delivery,
    // a qualified lead, or a started pilot. Never log contact or attribution fields.
    if (
      request.headers.get("dnt") !== "1" &&
      request.headers.get("sec-gpc") !== "1"
    ) {
      if (data.intent === "hvac-free-pilot")
        logFunnelEvent("hvac_free_pilot_provider_accepted", "/contact");
      else if (data.intent === "agency-partner")
        logFunnelEvent("hvac_agency_provider_accepted", "/contact");
      else if (data.intent === "hvac-pilot")
        logFunnelEvent("hvac_audit_submit_success", "/contact");
    }
    return NextResponse.json(
      {
        // HTTP success confirms Resend acceptance, not downstream inbox delivery.
        message:
          "Thanks — your request was accepted for delivery. We’ll be in touch soon.",
        delivery_status: "provider_accepted",
        // Never invent an ID that cannot be found in the provider's logs.
        id: typeof result.id === "string" && result.id ? result.id : null,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "We could not send your request right now. Please try again later.",
      },
      { status: 502 },
    );
  }
}
