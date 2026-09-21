import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const configuredTarget =
    process.env.TWF_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_TWF_URL?.trim() ||
    "https://twf-help.vercel.app";

  let target: URL;
  try {
    target = new URL(configuredTarget);
  } catch {
    return NextResponse.redirect(
      new URL("/projetos/together-we-feed", request.url),
      307,
    );
  }

  if (target.protocol !== "https:") {
    return NextResponse.redirect(
      new URL("/projetos/together-we-feed", request.url),
      307,
    );
  }

  const incoming = new URL(request.url);
  for (const [key, value] of incoming.searchParams.entries()) {
    if (!target.searchParams.has(key)) target.searchParams.set(key, value);
  }

  return NextResponse.redirect(target, 307);
}
