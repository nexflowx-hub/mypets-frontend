import { NextRequest, NextResponse } from "next/server";
import { EBOOK_ACCESS_COOKIE } from "@/lib/ebook-access";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/biblioteca", request.url), 303);
  response.cookies.set({
    name: EBOOK_ACCESS_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
