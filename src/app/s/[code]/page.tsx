import { redirect } from "next/navigation";
import { apiGet } from "@/lib/api";

export const dynamic = "force-dynamic";

type Envelope<T> = { data: T };

export default async function ShareRedirectPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  let destination = "/join/ajudar";

  try {
    const response = await apiGet<Envelope<{ destination: string }>>(`/growth/share/${encodeURIComponent(code)}`);
    destination = response.data.destination;
  } catch {
    // Expired or invalid short links fall back to the general participation funnel.
  }

  redirect(destination);
}
