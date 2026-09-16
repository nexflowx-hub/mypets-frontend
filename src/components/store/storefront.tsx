"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bone,
  Box,
  Check,
  ChevronDown,
  Dog,
  Heart,
  HeartHandshake,
  PackageCheck,
  PawPrint,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Truck,
  Wifi,
  X,
} from "lucide-react";
import { formatStorePrice, storeCategories, storeProducts, type StoreCategory, type StoreProduct } from "@/lib/store-catalog";

const categoryIcons: Record<StoreCategory, typeof PawPrint> = {
  passeio: Dog,
  alimentacao: Bone,
  higiene: Sparkles,
  brinquedos: PawPrint,
  conforto: Heart,
  smart: Wifi,
};

function ProductArtwork({ product }: { product: StoreProduct }) {
  const Icon = categoryIcons[product.category];
  const labels: Record<StoreCategory, string> = {
    passeio: "Passeio",
    alimentacao: "Alimentação",
    higiene: "Higiene",
    brinquedos: "Brinquedos",
    conforto: "Conforto",
    smart: "Smart Pet",
  };

  return (
    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_25%_20%,rgba(255,98,88,0.22),transparent_32%),radial-gradient(circle_at_80%_78%,rgba(46,163,160,0.24),transparent_38%),linear-gradient(135deg,#fffaf4,#edf8f6)]">
      <div className="absolute inset-5 rounded-[2rem] border border-white/80 bg-white/55 shadow-[0_20px_55px_rgba(14,45,43,0.08)] backdrop-blur-sm" />
      <div className="relative flex flex-col items-center text-petrol">
        <span className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-petrol text-white shadow-xl shadow-petrol/15">
          <Icon className="h-9 w-9" strokeWidth={1.8} />
        </span>
        <span className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-petrol/50">{labels[product.category]}</span>
      </div>
      {product.badge && <span className="absolute left-4 top-4 rounded-full bg-coral px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-sm">{product.badge}</span>}
      <span className="absolute bottom-4 right-4 rounded-full border border-petrol/10 bg-white/90 px-3 py-1 text-[10px] font-bold text-petrol/55">Imagem de produto pendente</span>
    </div>
  );
}

export function Storefront() {
  const [category, setCategory] = useState<"todos" | StoreCategory>("todos");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);

  const products = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    const filtered = storeProducts.filter((product) => {
      const categoryMatches = category === "todos" || product.category === category;
      const searchMatches = !normalized || `${product.name} ${product.shortDescription} ${product.species}`.toLocaleLowerCase("pt-BR").includes(normalized);
      return categoryMatches && searchMatches;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.priceCents - b.priceCents;
      if (sort === "price-desc") return b.priceCents - a.priceCents;
      if (sort === "rating") return b.rating - a.rating;
      return Number(Boolean(b.badge)) - Number(Boolean(a.badge));
    });
  }, [category, query, sort]);

  const cartItems = useMemo(() => storeProducts.filter((product) => cart[product.id]), [cart]);
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const cartTotal = cartItems.reduce((total, product) => total + product.priceCents * (cart[product.id] ?? 0), 0);

  function toggleFavorite(id: string) {
    setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  }

  function addToCart(id: string) {
    setCart((items) => ({ ...items, [id]: (items[id] ?? 0) + 1 }));
    setCartOpen(true);
  }

  function setQuantity(id: string, quantity: number) {
    setCart((items) => {
      const next = { ...items };
      if (quantity <= 0) delete next[id];
      else next[id] = quantity;
      return next;
    });
  }

  return (
    <div className="relative">
      <section className="relative overflow-hidden bg-petrol text-white">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(255,98,88,0.26),transparent_26%),radial-gradient(circle_at_85%_72%,rgba(46,163,160,0.26),transparent_31%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/7 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-white/85"><PawPrint className="h-4 w-4 text-coral" /> Loja MyPets</span>
              <h1 className="mt-5 max-w-3xl text-balance text-4xl font-black leading-[1.03] tracking-tight sm:text-5xl lg:text-6xl">Tudo para cuidar melhor. Uma loja feita para quem vive o mundo pet.</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">Curadoria de passeio, alimentação, higiene, conforto, diversão e tecnologia pet, integrada ao ecossistema MyPets e desenhada para evoluir para um canal de compras com impacto rastreável.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-coral px-6 text-sm font-black text-white transition hover:bg-coral-dark">Explorar produtos <ArrowRight className="h-4 w-4" /></button>
                <Link href="/apoiar/mypets" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/18 bg-white/7 px-6 text-sm font-black text-white transition hover:bg-white/12"><HeartHandshake className="h-4 w-4" /> Apoiar o MyPets</Link>
              </div>
            </div>

            <div className="relative rounded-[2rem] border border-white/10 bg-white/7 p-5 shadow-2xl shadow-black/15 backdrop-blur-sm sm:p-7">
              <div className="grid grid-cols-2 gap-3">
                {storeCategories.slice(1, 5).map((item) => {
                  const Icon = categoryIcons[item.id as StoreCategory];
                  return <button key={item.id} onClick={() => { setCategory(item.id as StoreCategory); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }} className="group rounded-3xl border border-white/10 bg-white/8 p-5 text-left transition hover:-translate-y-1 hover:bg-white/12"><Icon className="h-7 w-7 text-coral" /><span className="mt-7 block text-lg font-black">{item.label}</span><span className="mt-1 block text-xs leading-5 text-white/55">{item.description}</span></button>;
                })}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-petrol">
                <div><p className="text-xs font-black uppercase tracking-[0.14em] text-petrol/45">Curadoria MyPets</p><p className="mt-0.5 text-sm font-bold">Produtos úteis, sem catálogo inflado.</p></div>
                <ShieldCheck className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            [Truck, "Entrega acompanhável", "Política e prazo por região"],
            [ShieldCheck, "Compra protegida", "Checkout comercial separado de doações"],
            [PackageCheck, "Curadoria real", "Catálogo enxuto e orientado a utilidade"],
            [HeartHandshake, "Impacto transparente", "Regra de impacto publicada por campanha"],
          ].map(([Icon, title, text]) => {
            const TrustIcon = Icon as typeof Truck;
            return <div key={String(title)} className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eef8f7] text-[#0d6e6b]"><TrustIcon className="h-5 w-5" /></span><div><p className="text-sm font-black text-petrol">{String(title)}</p><p className="text-xs text-muted-foreground">{String(text)}</p></div></div>;
          })}
        </div>
      </section>

      <section id="catalogo" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Catálogo inicial</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-petrol sm:text-4xl">Encontre o que o seu pet precisa.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">A estrutura da loja já está pronta para catálogo real. Os SKUs abaixo são uma curadoria editorial de demonstração e não constituem oferta comercial até validação de fornecedor, estoque e frete.</p>
          </div>
          <button onClick={() => setCartOpen(true)} className="relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-white px-5 text-sm font-black text-petrol shadow-sm transition hover:border-coral/35"><ShoppingCart className="h-4 w-4" /> Carrinho {cartCount > 0 && <span className="rounded-full bg-coral px-2 py-0.5 text-[11px] text-white">{cartCount}</span>}</button>
        </div>

        <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="relative block"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-petrol/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por produto, uso ou espécie..." className="h-12 w-full rounded-2xl border border-border bg-white pl-12 pr-4 text-sm font-semibold text-petrol outline-none transition placeholder:text-petrol/35 focus:border-coral/50 focus:ring-4 focus:ring-coral/10" /></label>
          <label className="relative"><select value={sort} onChange={(event) => setSort(event.target.value)} className="h-12 min-w-48 appearance-none rounded-2xl border border-border bg-white pl-4 pr-10 text-sm font-bold text-petrol outline-none focus:border-coral/50"><option value="featured">Destaques</option><option value="rating">Melhor avaliação</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option></select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-petrol/40" /></label>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {storeCategories.map((item) => <button key={item.id} onClick={() => setCategory(item.id)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-black transition ${category === item.id ? "border-petrol bg-petrol text-white" : "border-border bg-white text-petrol hover:border-coral/40"}`}>{item.label}</button>)}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const favorite = favorites.includes(product.id);
            return <article key={product.id} className="group overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-coral/25 hover:shadow-xl hover:shadow-petrol/7">
              <div className="relative"><ProductArtwork product={product} /><button onClick={() => toggleFavorite(product.id)} aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"} className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 shadow-sm transition ${favorite ? "border-coral text-coral" : "border-white text-petrol/50 hover:text-coral"}`}><Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} /></button></div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-black uppercase tracking-[0.14em] text-petrol/45">{product.species}</span><span className="flex items-center gap-1 text-xs font-bold text-petrol"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {product.rating} <span className="font-medium text-petrol/35">({product.reviews})</span></span></div>
                <h3 className="mt-3 text-lg font-black leading-tight text-petrol">{product.name}</h3>
                <p className="mt-2 min-h-12 text-xs leading-5 text-muted-foreground">{product.shortDescription}</p>
                <div className="mt-5 flex items-end justify-between gap-3"><div><div className="flex items-center gap-2"><span className="text-xl font-black text-petrol">{formatStorePrice(product.priceCents)}</span>{product.compareAtCents && <span className="text-xs font-semibold text-petrol/35 line-through">{formatStorePrice(product.compareAtCents)}</span>}</div><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700">Preço demonstrativo</p></div><button onClick={() => addToCart(product.id)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-petrol text-white transition hover:bg-coral" aria-label={`Adicionar ${product.name} ao carrinho`}><ShoppingBag className="h-5 w-5" /></button></div>
              </div>
            </article>;
          })}
        </div>

        {products.length === 0 && <div className="mt-8 rounded-3xl border border-dashed border-border bg-white px-6 py-14 text-center"><Search className="mx-auto h-8 w-8 text-petrol/30" /><h3 className="mt-4 text-xl font-black text-petrol">Nenhum produto encontrado</h3><p className="mt-2 text-sm text-muted-foreground">Tente outro termo ou volte a ver todas as categorias.</p><button onClick={() => { setQuery(""); setCategory("todos"); }} className="mt-5 rounded-full bg-petrol px-5 py-2.5 text-sm font-black text-white">Limpar filtros</button></div>}
      </section>

      <section className="bg-[#eef8f7]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8 lg:py-16">
          <div className="rounded-[2rem] bg-petrol p-7 text-white shadow-2xl shadow-petrol/10 sm:p-9">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-coral text-white"><HeartHandshake className="h-6 w-6" /></span>
            <p className="mt-7 text-xs font-black uppercase tracking-[0.16em] text-coral">MyPets Impact</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Comprar e apoiar são movimentos diferentes — e transparentes.</h2>
            <p className="mt-4 text-sm leading-6 text-white/68">O valor de uma compra é receita comercial. Quando uma coleção gerar contribuição para impacto, a regra será declarada antes da compra e a transferência será publicada por ciclo. Apoios diretos continuam identificados nos fundos MyPets ou nas causas escolhidas.</p>
            <Link href="/apoiar" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-white">Conhecer as formas de apoio <ArrowRight className="h-4 w-4" /></Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [Tag, "Preço claro", "Sem transformar margem comercial em alegação vaga de doação."],
              [Box, "Catálogo verificável", "SKU, fornecedor, estoque e política de entrega antes da abertura."],
              [Check, "Prestação de contas", "Campanhas de impacto com regra, período e comprovativo próprios."],
              [ShieldCheck, "Checkout correto", "Pedidos comerciais e contribuições usam objetos financeiros separados."],
            ].map(([Icon, title, text]) => {
              const CardIcon = Icon as typeof Tag;
              return <div key={String(title)} className="rounded-3xl border border-[#cfe8e6] bg-white p-6"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef8f7] text-[#0d6e6b]"><CardIcon className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-black text-petrol">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{String(text)}</p></div>;
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="rounded-[2rem] border border-border bg-white p-7 sm:p-9 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div><p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Próxima abertura comercial</p><h2 className="mt-2 text-2xl font-black text-petrol sm:text-3xl">A experiência da loja está pronta. Agora ligamos catálogo real, estoque, frete e pedidos.</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">Enquanto os SKUs comerciais são validados, pode continuar a usar o ecossistema MyPets para apoiar causas, fundos e protetores sem qualquer mistura com a compra de produtos.</p></div>
          <Link href="/apoiar/mypets" className="mt-6 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-coral px-6 text-sm font-black text-white transition hover:bg-coral-dark lg:mt-0">Apoiar o MyPets <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      {cartOpen && <div className="fixed inset-0 z-[100] flex justify-end bg-petrol/35 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.currentTarget === event.target) setCartOpen(false); }}>
        <aside className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-5 py-5"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-coral">Loja MyPets</p><h2 className="mt-1 text-xl font-black text-petrol">O seu carrinho</h2></div><button onClick={() => setCartOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-petrol"><X className="h-5 w-5" /></button></div>
          <div className="flex-1 overflow-y-auto p-5">
            {cartItems.length === 0 ? <div className="flex h-full flex-col items-center justify-center text-center"><ShoppingCart className="h-10 w-10 text-petrol/25" /><h3 className="mt-4 text-lg font-black text-petrol">Carrinho vazio</h3><p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">Explore o catálogo e adicione itens para visualizar a experiência de compra.</p></div> : <div className="space-y-4">{cartItems.map((product) => { const quantity = cart[product.id] ?? 0; return <div key={product.id} className="rounded-2xl border border-border p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-black text-petrol">{product.name}</p><p className="mt-1 text-xs text-muted-foreground">{formatStorePrice(product.priceCents)} · preço demonstrativo</p></div><button onClick={() => setQuantity(product.id, 0)} className="text-petrol/35 hover:text-coral"><X className="h-4 w-4" /></button></div><div className="mt-4 flex items-center justify-between"><div className="inline-flex items-center rounded-full border border-border"><button onClick={() => setQuantity(product.id, quantity - 1)} className="px-3 py-1.5 text-sm font-black">−</button><span className="min-w-8 text-center text-sm font-black">{quantity}</span><button onClick={() => setQuantity(product.id, quantity + 1)} className="px-3 py-1.5 text-sm font-black">+</button></div><span className="text-sm font-black text-petrol">{formatStorePrice(product.priceCents * quantity)}</span></div></div>; })}</div>}
          </div>
          <div className="border-t border-border p-5"><div className="flex items-center justify-between"><span className="text-sm font-bold text-petrol/60">Subtotal demonstrativo</span><span className="text-xl font-black text-petrol">{formatStorePrice(cartTotal)}</span></div><button disabled className="mt-4 flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-petrol/35 px-5 text-sm font-black text-white"><ShoppingBag className="h-4 w-4" /> Checkout após ativação do catálogo</button><p className="mt-3 text-center text-[11px] leading-5 text-muted-foreground">Nenhuma encomenda ou cobrança é criada nesta versão demonstrativa.</p></div>
        </aside>
      </div>}
    </div>
  );
}
