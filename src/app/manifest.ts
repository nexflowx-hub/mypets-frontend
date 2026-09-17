import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MyPets — Pessoas. Animais. Impacto Real.",
    short_name: "MyPets",
    description: "Rede de apoio a animais, protetores, ONGs e projetos de impacto animal no Brasil e em Portugal.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#10202A",
    orientation: "portrait-primary",
    categories: ["lifestyle", "social"],
    lang: "pt-BR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
