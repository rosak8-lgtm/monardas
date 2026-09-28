import { validFunnelEvent, logFunnelEvent } from "@/lib/funnel";
export async function POST(request: Request) {
  const url = new URL(request.url);
  const origin = `${url.protocol}//${request.headers.get("host") || url.host}`;
  if (request.headers.get("origin") !== origin)
    return new Response(null, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json"))
    return new Response(null, { status: 415 });
  if (
    request.headers.get("dnt") === "1" ||
    request.headers.get("sec-gpc") === "1"
  )
    return new Response(null, { status: 204 });
  const raw = await request.text();
  if (raw.length > 256) return new Response(null, { status: 413 });
  try {
    const data = JSON.parse(raw);
    if (!data || !validFunnelEvent(data.event, data.path))
      return new Response(null, { status: 400 });
    logFunnelEvent(data.event, data.path);
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 400 });
  }
}
