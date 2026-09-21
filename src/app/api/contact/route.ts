import { NextResponse } from "next/server";
import { validate, type ContactData } from "@/lib/contact";
import {
  createResendPayload,
  isValidRuntimeContactConfig,
} from "@/lib/contact-delivery";
import { env as workerEnv } from "cloudflare:workers";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function readRuntimeValueExactly(
  name: "RESEND_API_KEY" | "CONTACT_TO" | "CONTACT_FROM",
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
    ] as const;
    const data = {} as ContactData;
    for (const key of keys) {
      if (typeof values[key] !== "string")
        return NextResponse.json(
          { error: "Please complete the form fields." },
          { status: 400 },
        );
      data[key] = (values[key] as string).trim();
    }
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
    if (
      typeof apiKey !== "string" ||
      typeof to !== "string" ||
      typeof from !== "string" ||
      !isValidRuntimeContactConfig({ to, from })
    )
      return NextResponse.json(
        { error: "Lead delivery is temporarily unavailable. Please try again later." },
        { status: 503 },
      );
    const lead = createResendPayload(data, { to, from });
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
        { error: "We could not send your request right now. Please try again later." },
        { status: 502 },
      );
    const result = (await resend.json()) as { id?: string };
    return NextResponse.json(
      {
        message: "Thanks — your request was sent successfully. We’ll be in touch soon.",
        id: result.id ?? crypto.randomUUID(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "We could not send your request right now. Please try again later." },
      { status: 502 },
    );
  }
}
