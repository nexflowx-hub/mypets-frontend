import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  Heart,
  LockKeyhole,
  PawPrint,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { MyPetsLogo } from "@/components/brand/logo";
import { HotmartCheckoutLink } from "@/components/conversion/hotmart-checkout-link";
import { campaignBooks } from "@/lib/hotmart-campaign";

export const metadata: Metadata = {
  title: "eBooks MyPets | Cuidar melhor também alimenta vidas",
  description:
    "Cinco guias digitais para tutores de cães. Cada eBook custa R$ 12,90; uma compra confirmada representa o compromisso MyPets de 1 kg de ração para a campanha solidária.",
  alternates: { canonical: "/h/campanha-livros" },
  openGraph: {
    title: "Coleção MyPets — 1 eBook = 1 kg de ração garantido",
    description: "Escolha seu guia de cuidados caninos por R$ 12,90. Conteúdo prático e impacto solidário.",
    url: "https://mypets.lat/h/campanha-livros",
    siteName: "MyPets",
    type: "website",
    locale: "pt_BR",
    images: [{
      url: "https://mypets.lat/images/campanha-livros/banner-eb02.png",
      alt: "Coleção de eBooks MyPets — cuidado canino e impacto solidário",
    }],
  },
};

const money = "R$ 12,90";

const questions = [
  {
    question: "O que recebo ao comprar?",
    answer:
      "Você adquire o eBook digital do título escolhido. A Hotmart processa a compra e disponibiliza as instruções de acesso ao conteúdo conforme a configuração do produto. Não há envio de livro físico.",
  },
  {
    question: "Como recebo meu eBook?",
    answer:
      "Após a confirmação da compra, confira o e-mail utilizado no checkout e siga as orientações de acesso enviadas pela Hotmart. Pagamentos pendentes podem levar mais tempo até a liberação.",
  },
  {
    question: "Posso comprar mais de um livro?",
    answer:
      "Sim! Cada livro possui um botão de pagamento individual. Se desejar mais de um título, realize a compra de cada produto separadamente.",
  },
  {
    question: "Como funciona o compromisso de 1 kg de ração?",
    answer:
      "Cada compra base confirmada de um eBook representa o compromisso interno do MyPets de destinar 1 kg de ração à campanha de apoio a animais resgatados. A confirmação, a conciliação das vendas e a prestação de contas devem seguir as condições oficiais da campanha. A compra não significa que a entrega da ração já ocorreu.",
  },
  {
    question: "O conteúdo substitui um profissional?",
    answer:
      "Não. Os livros oferecem orientações educativas para o dia a dia e não substituem avaliação veterinária ou acompanhamento comportamental individualizado.",
  },
  {
    question: "Como funciona o pagamento e o reembolso?",
    answer:
      "O pagamento é processado no checkout da Hotmart. Condições, meios de pagamento disponíveis e reembolsos aplicáveis são apresentados pela plataforma e pelos termos da oferta antes da finalização.",
  },
];

function Ribbon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#fac7a8]/35 bg-[#ff762f]/15 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ffb88d] sm:text-xs">
      <PawPrint aria-hidden="true" className="h-4 w-4" />
      {children}
    </span>
  );
}

export default function HotmartCampaignBooksPage() {
  return (
    <main className="min-h-screen bg-[#faf6ee] pb-24 text-[#092d39] selection:bg-[#ff762f]/25 md:pb-0">
      <header className="sticky top-0 z-50 border-b border-[#e4e5da] bg-[#faf6ee]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8">
          <Link href="/" aria-label="MyPets — página inicial" className="shrink-0">
            <MyPetsLogo />
          </Link>
          <nav aria-label="Navegação da campanha" className="flex items-center gap-3 sm:gap-7">
            <a href="#livros" className="hidden text-xs font-bold text-[#38574f] transition-colors hover:text-[#117767] sm:inline">Os livros</a>
            <a href="#impacto" className="hidden text-xs font-bold text-[#38574f] transition-colors hover:text-[#117767] md:inline">Nosso impacto</a>
            <a href="#duvidas" className="hidden text-xs font-bold text-[#38574f] transition-colors hover:text-[#117767] md:inline">Dúvidas</a>
            <a href="#livros" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#ff762f] px-5 text-xs font-black text-white shadow-[0_6px_22px_-9px_#a8441b] transition-transform hover:-translate-y-0.5">
              Escolher eBook <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </nav>
        </div>
      </header>

      <section aria-labelledby="campaign-title" className="relative isolate overflow-hidden bg-[#083f38] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full bg-[#117767]/50 blur-[110px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-64 left-0 h-[560px] w-[560px] rounded-full bg-[#ff762f]/15 blur-[110px]" />
        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-4 lg:py-20">
          <div className="relative z-10">
            <Ribbon>Conhecimento que cuida. Solidariedade que alimenta.</Ribbon>
            <h1 id="campaign-title" className="mt-8 max-w-[650px] font-serif text-[clamp(3.2rem,6vw,5.8rem)] font-bold leading-[0.98] tracking-[-0.055em]">
              Um guia para cuidar melhor.
              <span className="mt-2 block text-[#ffb47e]">Um quilo para ajudar.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#e3f0e9]/85 sm:text-lg">
              Descubra a coleção digital MyPets: cinco eBooks práticos para você entender e cuidar melhor do seu cão — e participar de uma campanha que apoia animais resgatados.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#livros" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#ff762f] px-7 text-sm font-black text-white shadow-xl shadow-black/10 transition-all hover:-translate-y-1 hover:bg-[#f06725]">
                Encontrar meu eBook <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </a>
              <a href="#como-funciona" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 text-sm font-bold text-white transition-colors hover:bg-white/20">
                Como funciona <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#e6f4eb]/80">
              <span className="inline-flex items-center gap-2"><CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[#a5d5a7]" /> A partir de {money}</span>
              <span className="inline-flex items-center gap-2"><FileText aria-hidden="true" className="h-4 w-4 text-[#a5d5a7]" /> Conteúdo digital</span>
              <span className="inline-flex items-center gap-2"><LockKeyhole aria-hidden="true" className="h-4 w-4 text-[#a5d5a7]" /> Pagamento Hotmart</span>
            </div>
          </div>
          <div className="relative mx-auto flex min-h-[410px] w-full max-w-[580px] items-center justify-center sm:min-h-[530px]" aria-label="Capas da coleção MyPets">
            <div aria-hidden="true" className="absolute inset-x-5 bottom-14 h-20 rounded-[50%] bg-black/30 blur-3xl" />
            <div className="relative z-10 flex items-center justify-center">
              <div className="relative -mr-14 mt-16 h-[260px] w-[190px] -rotate-[14deg] overflow-hidden rounded-[1.3rem] border-[5px] border-white/75 bg-[#f4eade] shadow-[0_30px_55px_rgba(0,0,0,.3)] sm:-mr-20 sm:h-[340px] sm:w-[238px]">
                <Image src="/images/campanha-livros/capa-eb09.png" alt="Capa do eBook Cão em Apartamento" fill sizes="(max-width: 640px) 190px, 238px" className="object-cover" />
              </div>
              <div className="relative z-20 h-[310px] w-[218px] -rotate-[2deg] overflow-hidden rounded-[1.4rem] border-[6px] border-white/85 bg-[#faeee1] shadow-[0_40px_75px_rgba(0,0,0,.4)] sm:h-[415px] sm:w-[285px]">
                <Image src="/images/campanha-livros/capa-eb02.png" alt="Capa do eBook Os Primeiros 30 Dias com um Filhote" fill priority sizes="(max-width: 640px) 218px, 285px" className="object-cover" />
              </div>
              <div className="relative -ml-14 mt-20 h-[260px] w-[190px] rotate-[13deg] overflow-hidden rounded-[1.3rem] border-[5px] border-white/75 bg-[#f4eade] shadow-[0_30px_55px_rgba(0,0,0,.3)] sm:-ml-20 sm:h-[340px] sm:w-[238px]">
                <Image src="/images/campanha-livros/capa-eb11.png" alt="Capa do eBook Adotei um Cão Adulto" fill sizes="(max-width: 640px) 190px, 238px" className="object-cover" />
              </div>
            </div>
            <div className="absolute bottom-1 right-0 z-30 rounded-2xl border border-[#fff]/25 bg-[#faf6ee] px-6 py-4 text-[#083f38] shadow-2xl sm:bottom-2 sm:right-4">
              <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-[#117767]"><Heart aria-hidden="true" className="h-4 w-4 fill-[#ff762f] text-[#ff762f]" /> Compromisso solidário</div>
              <div className="mt-1 font-serif text-xl font-bold">1 eBook = 1 kg</div>
              <p className="mt-1 text-[10px] text-[#6a7771]">Por compra confirmada</p>
            </div>
          </div>
        </div>
      </section>

      <section id="impacto" aria-label="Compromisso MyPets" className="border-b border-[#e0e8df] bg-[#eaf2e9]">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-7 sm:grid-cols-3 sm:px-8">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#117767]"><BookOpen aria-hidden="true" className="h-5 w-5" /></span><div><strong className="block text-sm">Conhecimento prático</strong><span className="text-xs text-[#577168]">Guias para o dia a dia</span></div></div>
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#ff762f]"><PawPrint aria-hidden="true" className="h-5 w-5" /></span><div><strong className="block text-sm">1 eBook = 1 kg garantido</strong><span className="text-xs text-[#577168]">Compromisso por compra confirmada</span></div></div>
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#117767]"><ShieldCheck aria-hidden="true" className="h-5 w-5" /></span><div><strong className="block text-sm">Compra pela Hotmart</strong><span className="text-xs text-[#577168]">Pagamento e acesso digital</span></div></div>
        </div>
      </section>

      <section id="livros" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[.23em] text-[#117767]">Coleção Cuidar Melhor</p>
            <h2 className="mt-4 font-serif text-4xl font-bold tracking-[-.05em] sm:text-6xl">Qual história é a sua?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#52685e]">
              Um filhote que acabou de chegar, um cão adulto recém-adotado, o dia a dia no apartamento... Existe um guia MyPets para acompanhar cada fase.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {campaignBooks.map((book, index) => (
              <article key={book.code} className="group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[#dfe5dc] bg-white shadow-[0_14px_40px_-30px_rgba(9,45,57,.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_-30px_rgba(9,45,57,.5)]">
                <div className={"relative flex min-h-[260px] items-center justify-center overflow-hidden px-6 py-6 " + (index % 3 === 0 ? "bg-[#e8f0e6]" : index % 3 === 1 ? "bg-[#faeadc]" : "bg-[#e6f2f0]")}>
                  <div aria-hidden="true" className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/50 blur-3xl" />
                  <div className="relative h-[242px] w-full max-w-[250px] overflow-hidden rounded-xl bg-white shadow-[0_18px_40px_-14px_rgba(9,45,57,.35)] transition-transform duration-500 group-hover:scale-[1.04]">
                    <Image src={book.cover} alt={"Imagem de capa: " + book.title} fill sizes="(max-width: 768px) 75vw, 300px" className="object-contain" />
                  </div>
                  <span className="absolute left-5 top-5 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#0c5b4c]">{book.code}</span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#117767]">eBook digital MyPets</p>
                  <h3 className="mt-3 min-h-[57px] font-serif text-[25px] font-bold leading-[1.14] tracking-[-.045em]">{book.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#61736a]">{book.tagline}</p>
                  <ul className="mt-5 space-y-2.5">
                    {book.benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-2.5 text-xs leading-5 text-[#354f45]"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#117767]" />{benefit}</li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-7">
                    <div className="flex items-end justify-between border-t border-[#e8e8e0] pt-5">
                      <span className="text-xs font-bold text-[#61736a]">Preço individual</span>
                      <strong className="font-serif text-[29px] font-bold tracking-[-.05em]">{money}</strong>
                    </div>
                    <HotmartCheckoutLink href={book.checkout} productCode={book.code} productSlug={book.slug} placement="card" className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ff762f] px-5 text-sm font-black text-white transition-colors hover:bg-[#e95f19]" />
                    <a href={"#detalhes-" + book.slug} className="mt-3 flex min-h-9 items-center justify-center gap-1 text-xs font-bold text-[#117767] hover:underline">
                      Conhecer este guia <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-7 text-center text-xs text-[#61736a]">
            Os cinco produtos são vendidos separadamente. A conclusão da compra acontece na Hotmart.
          </p>
        </div>
      </section>

      <section className="border-y border-[#e0e8df] bg-white px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.21em] text-[#117767]">Muito além da leitura</p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl font-bold leading-[1.08] tracking-[-.05em] sm:text-5xl">Você aprende a cuidar. Mais animais ganham apoio.</h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#597066]">
              Cada compra confirmada representa o compromisso de 1 kg de ração destinado à campanha MyPets de apoio a animais resgatados. É uma responsabilidade assumida pela iniciativa — não uma afirmação de que a entrega já aconteceu.
            </p>
            <Link href="/ajudar/ebooks" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#117767] hover:underline">
              Conheça a campanha MyPets <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] bg-[#083f38] p-9 text-white sm:p-12">
            <div aria-hidden="true" className="absolute -right-20 -top-16 h-64 w-64 rounded-full bg-[#36a48b]/25 blur-2xl" />
            <PawPrint aria-hidden="true" className="h-10 w-10 text-[#ffb17d]" />
            <div className="relative mt-7 font-serif text-6xl font-bold tracking-[-.07em] sm:text-7xl">1 <span className="text-[#ffb17d]">=</span> 1 kg</div>
            <h3 className="relative mt-4 text-xl font-extrabold">Um livro. Um compromisso de alimento.</h3>
            <p className="relative mt-4 max-w-md text-sm leading-7 text-[#c9e0d7]">O preço do seu eBook é de R$ 12,90. O compromisso de ração nasce após a confirmação da compra e é tratado pela operação da campanha.</p>
            <div className="relative mt-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold text-[#e9f4ee]"><Heart aria-hidden="true" className="h-4 w-4 text-[#ffb17d]" /> Pessoas. Animais. Impacto Real.</div>
          </div>
        </div>
      </section>

      <section aria-labelledby="inside-books-title" className="bg-[#faf6ee] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[.21em] text-[#117767]">Encontre seu próximo passo</p>
            <h2 id="inside-books-title" className="mt-4 font-serif text-4xl font-bold tracking-[-.05em] sm:text-5xl">Conheça cada guia</h2>
            <p className="mt-4 text-sm leading-7 text-[#5b7168]">Conteúdo organizado para ajudar você a aplicar pequenas melhorias na rotina, no seu ritmo.</p>
          </div>
          <div className="mt-14 space-y-9">
            {campaignBooks.map((book, index) => (
              <article key={book.slug} id={"detalhes-" + book.slug} className="scroll-mt-28 grid items-center gap-7 overflow-hidden rounded-[2rem] border border-[#e3e7dc] bg-white p-5 shadow-[0_25px_70px_-60px_#183c30] sm:p-9 lg:grid-cols-2 lg:gap-14">
                <div className={"relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-[1.4rem] p-4 sm:min-h-[340px] sm:p-6 " + (index % 2 === 0 ? "bg-[#eaf1e7]" : "bg-[#f7e8dc]")}>
                  <div className="relative h-[230px] w-full max-w-[465px] overflow-hidden rounded-xl bg-white shadow-xl sm:h-[300px]">
                    <Image src={book.banner} alt={"Arte editorial do eBook " + book.title} fill sizes="(max-width: 1024px) 85vw, 475px" className="object-contain" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-[#117767]">{book.code} · Para quem é</p>
                  <h3 className="mt-3 font-serif text-3xl font-bold leading-tight tracking-[-.05em] sm:text-4xl">{book.shortTitle}</h3>
                  <p className="mt-4 text-xs font-bold text-[#b55e32]">{book.audience}</p>
                  <p className="mt-4 text-sm leading-7 text-[#52685f]">{book.intro}</p>
                  <ul className="mt-6 space-y-3">
                    {book.highlights.map((item) => <li key={item} className="flex items-start gap-3 text-sm text-[#294f43]"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#117767]" />{item}</li>)}
                  </ul>
                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <HotmartCheckoutLink href={book.checkout} productCode={book.code} productSlug={book.slug} placement="detail" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ff762f] px-6 text-sm font-black text-white transition-colors hover:bg-[#e95f19]" />
                    <span className="text-xs font-bold text-[#61736a]"><FileText aria-hidden="true" className="mr-1 inline h-4 w-4" /> PDF digital</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-24 bg-[#083f38] px-5 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs font-extrabold uppercase tracking-[.2em] text-[#9ad2c0]">Simples, seguro e digital</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-center font-serif text-4xl font-bold tracking-[-.05em] sm:text-5xl">Três passos para começar</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", icon: BookOpen, title: "Escolha seu livro", desc: "Encontre o tema mais útil para você e para o seu cão." },
              { n: "02", icon: LockKeyhole, title: "Conclua na Hotmart", desc: "O botão leva ao checkout seguro do produto escolhido." },
              { n: "03", icon: Heart, title: "Leia e participe", desc: "Após a confirmação, siga as instruções de acesso e faça parte do compromisso solidário MyPets." },
            ].map(({ n, icon: Icon, title, desc }) => (
              <div key={n} className="rounded-[1.5rem] border border-white/15 bg-white/[.07] p-8">
                <span className="font-serif text-4xl font-bold text-[#ffb27d]">{n}</span>
                <Icon aria-hidden="true" className="mt-5 h-7 w-7 text-[#b5dbc8]" />
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#cfe6db]/85">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="duvidas" className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#117767]">Perguntas frequentes</p>
            <h2 className="mt-4 font-serif text-4xl font-bold tracking-[-.05em] sm:text-5xl">Ainda ficou alguma dúvida?</h2>
            <p className="mt-5 text-sm leading-7 text-[#61736a]">Acreditamos em informação clara antes, durante e depois da compra.</p>
          </div>
          <div className="divide-y divide-[#dce5da]">
            {questions.map((item) => (
              <details key={item.question} className="group py-5 first:pt-0">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 text-left text-sm font-extrabold marker:hidden [&::-webkit-details-marker]:hidden sm:text-base">
                  <span>{item.question}</span><span aria-hidden="true" className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e9f1e7] text-lg text-[#117767] group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl pr-7 text-sm leading-7 text-[#576f65]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3e4d5] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <Sparkles aria-hidden="true" className="mx-auto h-9 w-9 text-[#b35b32]" />
          <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight tracking-[-.05em] sm:text-5xl">Seu próximo gesto de cuidado começa com uma página.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#637065]">Escolha o guia que combina com a sua rotina. Cada compra confirmada ajuda a construir um compromisso de alimento com animais que precisam.</p>
          <a href="#livros" className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#083f38] px-8 text-sm font-black text-white transition-colors hover:bg-[#117767]">
            Escolher meu eBook <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </a>
        </div>
      </section>

      <footer className="bg-[#092d39] px-5 py-12 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="font-serif text-2xl font-bold">My<span className="text-[#ff762f]">Pets</span></Link>
            <p className="mt-2 text-xs text-[#a9c8bd]">Pessoas. Animais. Impacto Real.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-semibold text-[#c1d4cc]">
            <Link href="/sobre" className="hover:text-white">Sobre</Link>
            <Link href="/legal/termos" className="hover:text-white">Termos</Link>
            <Link href="/legal/privacidade" className="hover:text-white">Privacidade</Link>
            <Link href="/legal/reembolsos" className="hover:text-white">Reembolsos</Link>
            <Link href="/biblioteca" className="hover:text-white">Biblioteca MyPets</Link>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-white/15 pt-6 text-[11px] leading-6 text-[#a9c8bd]">
          Conteúdo educativo. Os pagamentos e a entrega digital são processados pela Hotmart. O compromisso MyPets de 1 kg por compra base confirmada está sujeito à conciliação das vendas e às condições oficiais da campanha; não constitui comprovante de entrega já realizada.
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#eee7dd] bg-[#faf6ee]/95 px-4 py-3 shadow-[0_-10px_25px_rgba(0,0,0,.08)] backdrop-blur-xl md:hidden">
        <a href="#livros" className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ff762f] text-sm font-black text-white">
          Ver os cinco eBooks · {money} cada <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </main>
  );
}
