import { NextResponse } from "next/server";
import { validate, type ContactData } from "@/lib/contact";
// Local development adapter only. Never logs personal details or pretends to deliver leads.
// Replace with durable delivery, abuse controls and a published privacy notice before enabling production.
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development")
    return NextResponse.json(
      {
        error:
          "Lead delivery has not been configured. This demonstration does not send or store your message.",
      },
      { status: 503 },
    );
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
    const body: unknown = JSON.parse(raw);
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
    const id = crypto.randomUUID();
    console.info("[MONARDAS local contact]", {
      id,
      receivedAt: new Date().toISOString(),
    });
    return NextResponse.json(
      {
        message:
          "Your local test submission was validated successfully. No message was sent or stored.",
        id,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid submission. Please try again." },
      { status: 400 },
    );
  }
}
