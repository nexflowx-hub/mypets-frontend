import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function languageCountry(value: string | null) {
  const language = (value ?? "").toLowerCase();
  if (language.includes("pt-br")) return "BR";
  if (language.includes("pt-pt")) return "PT";
  if (language.includes("es-es")) return "ES";
  return null;
}

export async function GET() {
  const requestHeaders = await headers();
  const candidates = [
    requestHeaders.get("x-vercel-ip-country"),
    requestHeaders.get("cf-ipcountry"),
    requestHeaders.get("x-country-code"),
  ];
  const detected = candidates
    .map((value) => value?.trim().toUpperCase() ?? "")
    .find((value) => /^[A-Z]{2}$/.test(value) && value !== "XX");
  const country = detected || languageCountry(requestHeaders.get("accept-language"));

  return NextResponse.json(
    { data: { country } },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
