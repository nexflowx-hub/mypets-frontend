import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const target = new URL("/ajudar/ebooks", request.url);
  request.nextUrl.searchParams.forEach((value, key) => target.searchParams.set(key, value));
  if (!target.searchParams.has("utm_source")) target.searchParams.set("utm_source", "share");
  if (!target.searchParams.has("utm_medium")) target.searchParams.set("utm_medium", "referral");
  if (!target.searchParams.has("utm_campaign")) target.searchParams.set("utm_campaign", "ebook_racao");
  return NextResponse.redirect(target, 307);
}
