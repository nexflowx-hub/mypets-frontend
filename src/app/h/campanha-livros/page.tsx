import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BookOpen, CheckCircle2, ChevronDown, Download, Heart, LockKeyhole,
  PawPrint, ShieldCheck, Sparkles, Wallet,
} from "lucide-react";
import { MyPetsLogo } from "@/components/brand/logo";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Coleção Cuidar Melhor — 5 eBooks por R$ 12,90 cada",
  description: "Escolha um dos cinco guias digitais da coleção MyPets. Cada compra confirmada representa o compromisso de 1 kg de ração para a campanha solidária.",
  alternates: { canonical: "/h/campanha-livros" },
  openGraph: {
    title: "5 formas de cuidar melhor. 1 kg de ração por eBook.",
    description: "Guias práticos para tutores de cães, por R$ 12,90 cada. Compra segura pela Hotmart.",
    url: "https://mypets.lat/h/campanha-livros",
    type: "website",
    images: [{ url: "https://mypets.lat/ajudar/ebooks/opengraph-image", width: 1200, height: 630 }],
  },
};

type Product = {
  number: string; slug: string; title: string; eyebrow: string; line: string;
  image: string; checkout: string; preview: string; highlight: string;
  learn: string[]; ideal: string; tint: string;
};

// Centralised catalogue: the public-facing button goes directly to the payment URL,
// never to a go.hotmart.com sales page that could redirect back to this showcase.
const products: Product[] = [
  {
    number: "01", slug: "cuidados-essenciais", title: "Cuidados Essenciais com o Seu Cão",
    eyebrow: "O guia para começar bem", line: "Rotina, segurança, higiene, prevenção e bem-estar com mais confiança.",
    image: "/images/library/covers/01-cuidados-essenciais.webp",
    checkout: "https://pay.hotmart.com/C108190802Y", preview: "/biblioteca/cuidados-essenciais",
    highlight: "Um cuidado melhor começa com informação clara.",
    learn: ["Rotina e cuidados diários", "Higiene e prevenção", "Conforto e segurança"],
    ideal: "Para quem quer criar uma base sólida de cuidados.", tint: "from-[#def2e5] to-[#f8f3e9]",
  },
  {
    number: "02", slug: "primeiros-30-dias", title: "Os Primeiros 30 Dias com um Filhote",
    eyebrow: "O início de uma história", line: "Acolha seu filhote com mais organização, paciência e segurança.",
    image: "/images/library/covers/02-primeiros-30-dias.webp",
    checkout: "https://pay.hotmart.com/M108259866W", preview: "/biblioteca/primeiros-30-dias",
    highlight: "Os primeiros dias merecem atenção especial.",
    learn: ["Primeiro dia e primeira noite", "Sono, higiene e rotina", "Socialização e treino gentil"],
    ideal: "Para famílias que vão receber ou receberam um filhote.", tint: "from-[#fbe9dc] to-[#f9f2e8]",
  },
  {
    number: "09", slug: "cao-em-apartamento", title: "Cão em Apartamento",
    eyebrow: "Espaço pequeno, vida completa", line: "Bem-estar e enriquecimento para a vida em espaços compactos.",
    image: "/images/library/covers/09-cao-em-apartamento.webp",
    checkout: "https://pay.hotmart.com/J108259918Q", preview: "/biblioteca/cao-em-apartamento",
    highlight: "Bem-estar não se mede apenas em metros quadrados.",
    learn: ["Ambientes e varandas mais seguros", "Passeios e brincadeiras", "Rotina e convivência"],
    ideal: "Para tutores que vivem em apartamentos ou casas pequenas.", tint: "from-[#dcece8] to-[#edf5f0]",
  },
  {
    number: "11", slug: "adotei-cao-adulto", title: "Adotei um Cão Adulto: E Agora?",
    eyebrow: "Todo recomeço merece carinho", line: "Aprenda a acolher, respeitar o tempo de adaptação e construir confiança.",
    image: "/images/library/covers/11-adotei-cao-adulto.webp",
    checkout: "https://pay.hotmart.com/R108259979J", preview: "/biblioteca/adotei-cao-adulto",
    highlight: "Construir vínculo é respeitar o ritmo de cada cão.",
    learn: ["Primeiros dias na nova casa", "Vínculo, sinais e segurança", "Adaptação e convivência"],
    ideal: "Para quem adotou ou pretende adotar um cão adulto.", tint: "from-[#f4dfd2] to-[#f6efe6]",
  },
  {
    number: "08", slug: "ficar-sozinho", title: "Ficar Sozinho em Casa",
    eyebrow: "Autonomia sem medo", line: "Construa pequenas ausências com observação, segurança e respeito.",
    image: "/images/library/covers/08-ficar-sozinho.webp",
    checkout: "https://pay.hotmart.com/T108260019G", preview: "/biblioteca/ficar-sozinho",
    highlight: "Autonomia se desenvolve no ritmo do seu cão.",
    learn: ["Ambiente seguro e previsível", "Treinos graduais de ausência", "Sinais de desconforto e quando pedir ajuda"],
    ideal: "Para quem quer desenvolver a autonomia do cão com cuidado.", tint: "from-[#e8ede2] to-[#faf1e4]",
  },
];

const faqs = [
  { q: "Como recebo o eBook?", a: "Após a confirmação do pagamento, a Hotmart informa por e-mail como acessar o conteúdo digital. Confira também sua área de compras na Hotmart." },
  { q: "Os livros são físicos?", a: "Não. São guias digitais para leitura, disponibilizados no ambiente de entrega configurado na Hotmart." },
  { q: "Quanto custa cada guia?", a: "Cada eBook custa R$ 12,90. Os valores finais, formas de pagamento e eventuais condições são exibidos no checkout da Hotmart antes de concluir a compra." },
  { q: "Posso comprar mais de um?", a: "Sim. Cada botão corresponde a um produto diferente e abre seu próprio checkout. São compras individuais." },
  { q: "Como funciona o 1 eBook = 1 kg de ração?", a: "A cada compra confirmada, o MyPets assume o compromisso de 1 kg de ração devido à campanha solidária. Compra confirmada não significa entrega já realizada. A prestação de contas deve informar o cumprimento desse compromisso." },
  { q: "O conteúdo substitui um veterinário?", a: "Não. Os guias são educativos e não substituem uma avaliação veterinária ou acompanhamento comportamental individualizado." },
];

function CheckoutButton({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <a
      href={product.checkout}
      data-hotmart-product={product.slug}
      data-hotmart-placement="campanha-livros"
      rel="noopener noreferrer"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ef6b37] px-6 py-3 text-center text-sm font-extrabold text-white shadow-lg shadow-orange-900/10 transition hover:-translate-y-0.5 hover:bg-[#dc5729] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${className}`}
    >
      Comprar por R$ 12,90 <ArrowRight size={17} strokeWidth={2.5} />
    </a>
  );
}

export default function CampanhaLivrosPage() {
  return (
    <main className="min-h-screen bg-[#faf7f0] text-[#163a34]">
      <header className="sticky top-0 z-50 border-b border-[#dfeae3] bg-[#faf7f0]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" aria-label="MyPets — página inicial"><MyPetsLogo compact /></Link>
          <div className="hidden items-center gap-6 text-sm font-semibold text-[#45675e] sm:flex">
            <a className="hover:text-[#0a5848]" href="#livros">Os livros</a>
            <a className="hover:text-[#0a5848]" href="#impacto">Nosso compromisso</a>
            <a className="hover:text-[#0a5848]" href="#duvidas">Dúvidas</a>
          </div>
          <a href="#livros" className="rounded-full bg-[#0b5144] px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#08382f]">Escolher meu guia</a>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-[#083c34] text-white">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#298c74]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-40 h-[500px] w-[500px] rounded-full bg-[#f68e51]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.03fr_.97fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[.18em] text-[#d6ede0]">
              <Sparkles size={14} /> Coleção Cuidar Melhor
            </span>
            <h1 className="mt-7 max-w-[680px] font-serif text-[clamp(3rem,5vw,5.2rem)] leading-[1.04] tracking-[-.055em]">
              Cuidar melhor é um gesto de <span className="text-[#ffad77]">amor.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#e3efeb]">
              Cinco guias digitais para transformar dúvidas em cuidado. Escolha o tema que faz sentido para você e participe de uma causa que alimenta vidas.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#livros" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#f4763b] px-7 py-3 text-sm font-extrabold text-white shadow-lg shadow-black/10 hover:bg-[#dc5729]">
                Escolher um eBook <ArrowRight size={18} />
              </a>
              <a href="#impacto" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
                Conheça o impacto <Heart size={16} />
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#e1efe7]">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#b8e6ba]" /> R$ 12,90 por livro</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#b8e6ba]" /> Conteúdo digital</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#b8e6ba]" /> Compra pela Hotmart</span>
            </div>
          </div>
          <div aria-label="Capas fotográficas da coleção" className="relative mx-auto w-full max-w-[560px]">
            <div className="grid grid-cols-3 items-end gap-3 sm:gap-4">
              {[products[1], products[3], products[2]].map((p, i) => (
                <div key={p.slug} className={`overflow-hidden rounded-[1.3rem] border-[5px] border-white/15 bg-white/10 shadow-2xl shadow-black/35 ${i === 1 ? "-translate-y-7" : "translate-y-4"}`}>
                  <div className="relative aspect-[3/4]">
                    <Image src={p.image} alt={p.title} fill priority sizes="(max-width: 640px) 28vw, 180px" className="object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#05291f] via-[#05291f]/80 to-transparent p-3 pt-16">
                      <p className="text-[10px] font-black leading-4 text-white sm:text-sm">{p.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative mx-auto mt-10 w-fit rounded-[1.5rem] border border-[#a9d8bd]/40 bg-[#0c5448]/95 px-7 py-4 text-center shadow-xl shadow-black/20">
              <PawPrint className="mx-auto mb-2 h-6 w-6 text-[#ffb881]" />
              <strong className="block text-lg">1 eBook = 1 kg de ração</strong>
              <small className="mt-1 block text-xs text-white/80">Compromisso por compra confirmada</small>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#dce9de] bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-5 text-xs font-bold text-[#476b60] sm:px-8">
          <span className="inline-flex items-center gap-2"><BookOpen size={18} className="text-[#0b7662]" /> Guias práticos para tutores</span>
          <span className="inline-flex items-center gap-2"><LockKeyhole size={18} className="text-[#0b7662]" /> Pagamento na Hotmart</span>
          <span className="inline-flex items-center gap-2"><Heart size={18} className="text-[#e96a37]" /> Compromisso solidário MyPets</span>
        </div>
      </section>

      <section id="livros" className="scroll-mt-24 px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-[.2em] text-[#c65d33]">Escolha o seu próximo passo</span>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-[#0b473c] sm:text-5xl">O guia certo para cada fase da vida.</h2>
            <p className="mt-5 text-base leading-relaxed text-[#547168]">Cada livro responde a desafios reais da convivência com cães. Conheça os temas, escolha o seu e finalize a compra com segurança pela Hotmart.</p>
          </div>
          <div className="mt-14 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <article key={p.slug} id={p.slug} className="group scroll-mt-28 overflow-hidden rounded-[1.75rem] border border-[#dfe8de] bg-white shadow-[0_18px_55px_-30px_rgba(9,63,56,.25)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-25px_rgba(9,63,56,.28)]">
                <div className={`relative flex h-[245px] items-center justify-center overflow-hidden bg-gradient-to-br ${p.tint}`}>
                  <div className="absolute left-5 top-5 z-10 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#0b5144]">eBook {p.number}</div>
                  <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_center,#45816c_1px,transparent_1px)] [background-size:22px_22px]" />
                  <div className="relative h-[202px] w-[160px] overflow-hidden rounded-lg shadow-[12px_16px_25px_rgba(6,45,31,.28)] transition duration-500 group-hover:rotate-[-2deg] group-hover:scale-105">
                    <Image src={p.image} alt={`Imagem de referência de ${p.title}`} fill sizes="160px" className="object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#052e29] via-[#052e29]/75 to-transparent px-3 pb-4 pt-12">
                      <p className="text-center text-[11px] font-black leading-tight text-white">{p.title}</p>
                    </div>
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-[10px] font-extrabold uppercase tracking-[.17em] text-[#c45d34]">{p.eyebrow}</p>
                  <h3 className="mt-3 min-h-[56px] font-serif text-2xl leading-tight text-[#0b473c]">{p.title}</h3>
                  <p className="mt-3 min-h-[74px] text-sm leading-relaxed text-[#557168]">{p.line}</p>
                  <ul className="mt-5 space-y-2.5 border-t border-[#e2ebe3] pt-5">
                    {p.learn.map((item) => <li key={item} className="flex items-start gap-2 text-sm text-[#315c50]"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#0b8a6f]" />{item}</li>)}
                  </ul>
                  <p className="mt-6 text-xs font-semibold text-[#637b72]">{p.ideal}</p>
                  <div className="mt-6 border-t border-[#e2ebe3] pt-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#607c70]">eBook digital</p>
                    <p className="mt-0.5 text-[32px] font-black tracking-tight text-[#0b5144]">R$ 12,90</p>
                    <CheckoutButton product={p} className="mt-4 w-full" />
                    <Link href={p.preview} className="mt-3 flex min-h-10 items-center justify-center gap-1.5 text-xs font-bold text-[#0c6956] underline-offset-4 hover:underline">
                      Conhecer o conteúdo <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
            <div className="flex flex-col justify-center rounded-[1.75rem] bg-[#0d5044] p-9 text-white">
              <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10"><PawPrint className="h-8 w-8 text-[#f7af7e]" /></span>
              <h3 className="font-serif text-[2rem] leading-tight">Mais do que aprender. Participar de uma causa.</h3>
              <p className="mt-5 text-sm leading-7 text-[#d5e8df]">Cada compra confirmada representa um compromisso de 1 kg de ração para a campanha solidária do MyPets. O cumprimento desse compromisso deve ser acompanhado com transparência.</p>
              <a href="#impacto" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#ffd7b6] hover:text-white">Entenda a iniciativa <ArrowRight size={16}/></a>
            </div>
          </div>
        </div>
      </section>

      <section id="impacto" className="scroll-mt-24 bg-[#eaf1e9] px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <Image src="/images/card-alimentou.jpg" alt="Cuidado e alimentação animal — imagem institucional MyPets" fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[.2em] text-[#b9562e]">Conhecimento que alimenta</span>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#0a483c] sm:text-5xl">Você aprende. O compromisso de cuidado cresce.</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#4c6b60]">Ao adquirir um eBook por R$ 12,90, você recebe conhecimento para cuidar melhor do seu cão. Por cada compra confirmada, o MyPets assume o compromisso de 1 kg de ração devido à campanha.</p>
            <div className="mt-7 rounded-2xl border border-[#c8dfcc] bg-white p-6">
              <div className="flex items-start gap-3"><ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#08735d]" /><p className="text-sm leading-7 text-[#345d50]"><strong>Transparência importa.</strong> O compromisso de 1 kg não significa que a entrega já aconteceu. A apuração de compras, reembolsos e prestação de contas é uma etapa separada.</p></div>
            </div>
            <a href="#livros" className="mt-7 inline-flex items-center gap-2 font-extrabold text-[#0b6f5b] hover:underline">Escolher meu eBook <ArrowRight size={17}/></a>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#e6e6d8] bg-white p-7 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-14">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[.2em] text-[#c25b30]">Simples e seguro</span>
              <h2 className="mt-3 font-serif text-4xl leading-tight text-[#0b473c]">Da escolha à leitura, em poucos passos.</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { icon: BookOpen, title: "Escolha", desc: "Encontre o tema ideal para sua rotina." },
                { icon: Wallet, title: "Compre", desc: "Finalize no checkout do produto na Hotmart." },
                { icon: Download, title: "Acesse", desc: "Siga o e-mail de acesso enviado após a confirmação." },
              ].map((s, i) => <div key={s.title}><span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf4ed] text-[#0b7662]"><s.icon size={21}/></span><p className="mt-3 text-xs font-black uppercase tracking-wider text-[#b96644]">Passo 0{i+1}</p><h3 className="mt-1 font-serif text-xl text-[#0b473c]">{s.title}</h3><p className="mt-2 text-sm leading-6 text-[#5a756b]">{s.desc}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="duvidas" className="scroll-mt-24 px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center"><span className="text-xs font-extrabold uppercase tracking-[.2em] text-[#c25b30]">Perguntas frequentes</span><h2 className="mt-3 font-serif text-4xl text-[#0b473c] sm:text-5xl">Tudo que você precisa saber.</h2></div>
          <div className="space-y-3">
            {faqs.map((item) => <details key={item.q} className="group rounded-2xl border border-[#dce7db] bg-white px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-[#0e5144] [&::-webkit-details-marker]:hidden">{item.q}<ChevronDown size={19} className="shrink-0 transition group-open:rotate-180" /></summary>
              <p className="mt-4 text-sm leading-7 text-[#537267]">{item.a}</p>
            </details>)}
          </div>
        </div>
      </section>

      <section className="bg-[#092f29] px-5 py-16 text-center text-white sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Heart className="mx-auto h-8 w-8 fill-[#f4763b] text-[#f4763b]" />
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">Uma escolha pequena. Um cuidado que se multiplica.</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#d6e8e0]">Escolha um guia, aprenda no seu ritmo e faça parte do compromisso solidário MyPets.</p>
          <a href="#livros" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#f4763b] px-8 py-3 font-extrabold text-white hover:bg-[#dc5729]">Ver os cinco eBooks <ArrowRight size={18}/></a>
          <p className="mt-5 text-xs text-white/65">Pagamento processado pela Hotmart · R$ 12,90 por eBook</p>
        </div>
      </section>
      <SiteFooter />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 sm:hidden">
        <a href="#livros" className="pointer-events-auto mx-auto flex max-w-sm items-center justify-center gap-2 rounded-full bg-[#f4763b] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_30px_rgba(0,0,0,.25)]">Escolher um eBook <ArrowRight size={17}/></a>
      </div>
    </main>
  );
}
