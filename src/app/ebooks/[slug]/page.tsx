import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { resolveDigitalLibraryGuide } from "@/lib/digital-library";
import { solidarityEbooks } from "@/lib/solidarity-ebooks";

export const dynamicParams = true;

export function generateStaticParams() {
  return solidarityEbooks.flatMap((ebook) => [
    { slug: ebook.slug },
    ...(ebook.legacySlugs ?? []).map((slug) => ({ slug })),
  ]);
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

  if (query.receipt) {
    const target = new URLSearchParams({
      receipt: query.receipt,
      next: "/biblioteca/" + guide.slug + "/ler",
    });
    redirect("/ebooks/acesso?" + target.toString());
  }

  redirect("/biblioteca/" + guide.slug + "/ler");
}
