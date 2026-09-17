import type { Metadata, Viewport } from "next";
import { Manrope, Caveat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { AuthBootstrap } from "@/components/auth/auth-bootstrap";
import { PublicConversionDock } from "@/components/conversion/public-conversion-dock";
import { BRAND } from "@/lib/brand";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  applicationName: "MyPets",
  title: { default: "MyPets — Quem ajuda animais também merece ajuda.", template: "%s · MyPets" },
  description: "MyPets conecta pessoas, protetores, ONGs e projetos para apoiar resgates, tratamentos, alimentação, abrigo e adoção responsável de animais.",
  keywords: ["MyPets", "ajuda animal", "proteção animal", "protetores de animais", "ONG animal", "resgate animal", "adoção responsável", "doação para animais", "Pix para causas animais", "FacePets"],
  authors: [{ name: "HUMAN IMPACT TECH LTD", url: "https://humanimpact.tech" }],
  creator: "HUMAN IMPACT TECH LTD",
  publisher: "MyPets",
  category: "animal welfare",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "MyPets — Quem ajuda animais também merece ajuda.",
    description: "Uma comunidade para aproximar quem quer ajudar de quem resgata, alimenta, trata e protege animais todos os dias.",
    siteName: BRAND.name,
    type: "website",
    locale: "pt_PT",
    alternateLocale: ["pt_BR", "en_US"],
    images: [{ url: BRAND.socialBannerUrl, alt: "MyPets — Pessoas. Animais. Impacto Real." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyPets — Quem ajuda animais também merece ajuda.",
    description: "Apoie quem ajuda animais todos os dias. Pessoas. Animais. Impacto Real.",
    images: [BRAND.socialBannerUrl],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false, address: false, email: false },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#10202A", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body className={`${manrope.variable} ${caveat.variable} antialiased bg-background text-foreground font-sans min-h-screen flex flex-col`}>
        <LocaleProvider>
          <AuthBootstrap />
          {children}
          <PublicConversionDock />
        </LocaleProvider>
        <Toaster />
      </body>
    </html>
  );
}
