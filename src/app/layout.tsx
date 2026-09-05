import type { Metadata, Viewport } from "next";
import { Manrope, Caveat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { AuthBootstrap } from "@/components/auth/auth-bootstrap";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://mypets.lat"),
  title: { default: "MyPets — Quem ajuda animais também merece ajuda.", template: "%s · MyPets" },
  description: "MyPets é uma rede que aproxima quem quer ajudar das pessoas que resgatam, alimentam, tratam e protegem animais todos os dias. Pessoas. Animais. Impacto Real.",
  keywords: ["MyPets", "animais", "protetores", "resgate animal", "adoção", "doação", "impacto social", "FacePets"],
  authors: [{ name: "HUMAN IMPACT TECH LTD" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "MyPets — Quem ajuda animais também merece ajuda.",
    description: "Uma comunidade. Milhares de histórias. Um impacto que podemos acompanhar. Apoie protetores e animais em Portugal e no Brasil.",
    url: "https://mypets.lat",
    siteName: "MyPets",
    type: "website",
    locale: "pt_PT",
    images: [{ url: "/images/hero.jpg", width: 1440, height: 720, alt: "Protetora a alimentar cães resgatados" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyPets — Quem ajuda animais também merece ajuda.",
    description: "Apoie quem ajuda animais todos os dias. Pessoas. Animais. Impacto Real.",
    images: ["/images/hero.jpg"],
  },
  robots: { index: true, follow: true },
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
        </LocaleProvider>
        <Toaster />
      </body>
    </html>
  );
}
