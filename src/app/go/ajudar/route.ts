import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const target = new URL("/ajudar", request.url);
  const incoming = request.nextUrl.searchParams;
  incoming.forEach((value, key) => target.searchParams.set(key, value));

  if (!target.searchParams.has("utm_source")) target.searchParams.set("utm_source", "share");
  if (!target.searchParams.has("utm_medium")) target.searchParams.set("utm_medium", "referral");
  if (!target.searchParams.has("utm_campaign")) target.searchParams.set("utm_campaign", "mypets_support");

  return NextResponse.redirect(target, 307);
}
