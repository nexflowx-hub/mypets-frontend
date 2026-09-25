import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { resolveDigitalLibraryGuide } from "@/lib/digital-library";
import { solidarityEbooks } from "@/lib/solidarity-ebooks";

export const dynamicParams = false;

export function generateStaticParams() {
  return solidarityEbooks.map((ebook) => ({ slug: ebook.slug }));
}

export const metadata: Metadata = {
  title: "eBook MyPets",
  robots: { index: false, follow: false },
};

export default async function LegacyEbookReader({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ receipt?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const guide = await resolveDigitalLibraryGuide(slug);
  if (!guide) notFound();

  const receipt = query.receipt ? "?receipt=" + encodeURIComponent(query.receipt) : "";
  redirect("/biblioteca/" + guide.slug + "/ler" + receipt);
}
