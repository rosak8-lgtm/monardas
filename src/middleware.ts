import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.headers.get("host")?.toLowerCase() !== "www.monardas.com")
    return NextResponse.next();

  // Preserve intent and campaign query parameters in both Next and vinext.
  const destination = new URL(request.url);
  destination.protocol = "https:";
  destination.host = "monardas.com";
  destination.port = "";
  return NextResponse.redirect(destination, 308);
}
