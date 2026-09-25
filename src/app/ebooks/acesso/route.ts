import { NextRequest, NextResponse } from "next/server";
import { EBOOK_ACCESS_COOKIE, validateEbookReceipt } from "@/lib/ebook-access";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/ebooks/colecao";
  return value;
}

export async function GET(request: NextRequest) {
  const receipt = request.nextUrl.searchParams.get("receipt");
  const payment = await validateEbookReceipt(receipt);

  if (!payment || !receipt) {
    return NextResponse.redirect(new URL("/ajudar/ebooks?access=required", request.url), 303);
  }

  const next = safeNext(request.nextUrl.searchParams.get("next"));
  const books = request.nextUrl.searchParams.get("books");
  const via = request.nextUrl.searchParams.get("via");

  const destination = new URL(next, request.url);
  if (books) destination.searchParams.set("books", books);
  if (via) destination.searchParams.set("via", via);

  const response = NextResponse.redirect(destination, 303);
  response.cookies.set({
    name: EBOOK_ACCESS_COOKIE,
    value: receipt,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("Cache-Control", "no-store");
  return response;
}
