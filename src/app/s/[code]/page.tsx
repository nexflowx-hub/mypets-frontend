import { redirect } from "next/navigation";
import { apiGet } from "@/lib/api";

export const dynamic = "force-dynamic";

type Envelope<T> = { data: T };

export default async function ShareRedirectPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  try {
    const response = await apiGet<Envelope<{ destination: string }>>(`/growth/share/${encodeURIComponent(code)}`);
    redirect(response.data.destination);
  } catch {
    redirect("/join/ajudar");
  }
}
