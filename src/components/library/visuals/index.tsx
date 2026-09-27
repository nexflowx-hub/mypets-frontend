/**
 * Mission 3 — Original-visual renderer system.
 *
 * Each `original-visual` placement gets a deliberate, premium, semantic
 * HTML/SVG renderer dispatched by `placement.render`. All labels rendered
 * in the visual are derived directly from the placement's `alt` (and only
 * from there — see MISSION3_SPEC.md). No numbers, scores, thresholds, or
 * any data not present in the canonical alt/caption are ever invented.
 */

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  ArrowUp,
  Baby,
  BarChart3,
  BedSingle,
  Bone,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Compass,
  Dog,
  Gauge,
  GitBranch,
  HeartPulse,
  House,
  Images,
  LayoutGrid,
  ListChecks,
  MoveHorizontal,
  PawPrint,
  Route,
  Siren,
  Sparkles,
  Tag,
  TrafficCone,
  Wind,
  Workflow,
} from "lucide-react";
import type { LibraryMediaPlacement } from "@/lib/digital-library";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Label map (extends the original visualLabel with the 2 missing families)
// ---------------------------------------------------------------------------

const VISUAL_LABELS: Record<string, string> = {
  "traffic-light": "Semáforo visual",
  timeline: "Linha do tempo",
  "day-grid": "Plano por dias",
  "week-grid": "Plano semanal",
  "weekly-grid": "Planeador semanal",
  process: "Processo visual",
  staircase: "Progressão",
  matrix: "Matriz prática",
  "room-checklist": "Mapa + checklist",
  floorplan: "Mapa do ambiente",
  "trigger-map": "Mapa de gatilhos",
  "distance-diagram": "Diagrama de distância",
  "body-map": "Mapa corporal",
  "annotated-body": "Mapa corporal anotado",
  "silhouette-guide": "Guia visual",
  "warning-grid": "Quadro de alertas",
  "step-cards": "Passo a passo",
  "child-poster": "Poster familiar",
  "child-card": "Cartão infantil",
  "room-diagram": "Mapa de espaço seguro",
  "category-wheel": "Roda de atividades",
  slider: "Escala de dificuldade",
  "checklist-card": "Cartão prático",
  "comparison-matrix": "Matriz comparativa",
  "decision-tree": "Árvore de decisão",
  "annotated-card": "Cartão explicado",
  "annotated-label": "Rótulo explicado",
  "annual-calendar": "Calendário anual",
  tracker: "Tracker",
  "observation-board": "Quadro de observação",
  "photo-grid": "Galeria editorial",
  "route-cards": "Rotas práticas",
};

const FAMILY_ICONS: Record<string, LucideIcon> = {
  "traffic-light": TrafficCone,
  timeline: GitBranch,
  "day-grid": Calendar,
  "week-grid": Calendar,
  "weekly-grid": Calendar,
  process: Workflow,
  staircase: ArrowUp,
  matrix: LayoutGrid,
  "room-checklist": ClipboardCheck,
  floorplan: House,
  "trigger-map": Wind,
  "distance-diagram": MoveHorizontal,
  "body-map": HeartPulse,
  "annotated-body": Dog,
  "silhouette-guide": PawPrint,
  "warning-grid": Siren,
  "step-cards": ListChecks,
  "child-poster": Baby,
  "child-card": Baby,
  "room-diagram": BedSingle,
  "category-wheel": Compass,
  slider: Gauge,
  "checklist-card": ListChecks,
  "comparison-matrix": BarChart3,
  "decision-tree": GitBranch,
  "annotated-card": Tag,
  "annotated-label": Bone,
  "annual-calendar": Calendar,
  tracker: ClipboardList,
  "observation-board": Activity,
  "photo-grid": Images,
  "route-cards": Route,
};

// ---------------------------------------------------------------------------
// Per-placement labels (curated strictly from canonical alt text)
// ---------------------------------------------------------------------------

const TRAFFIC_LEVELS = ["Verde", "Amarelo", "Vermelho"] as const;
const TRAFFIC_LABELS: Record<string, [string, string, string]> = {
  "child-dog-traffic-light": [
    "Corpo solto",
    "Sinais de desconforto",
    "Necessidade imediata de espaço",
  ],
  "care-red-flags": [
    "Observar",
    "Marcar consulta",
    "Procurar ajuda rápida",
  ],
  "body-language-traffic-light": [
    "Confortável",
    "Desconforto crescente",
    "Necessidade imediata de espaço",
  ],
  "puppy-socialization-traffic-light": [
    "Conforto",
    "Hesitação",
    "Sobrecarga",
  ],
};

const TIMELINE_NODES: Record<string, string[]> = {
  "rescue-first-72h": ["Segurança", "Previsibilidade", "Escolha"],
  "care-daily-rhythm": [
    "Eliminação",
    "Água",
    "Alimentação",
    "Passeio",
    "Descanso",
    "Enriquecimento",
  ],
  "puppy-first-72-hours": [
    "Segurança",
    "Alimentação",
    "Sono",
    "Eliminação",
    "Observação",
  ],
};

const DAY_GRID_CONFIG: Record<string, { days: number; phases?: string[] }> = {
  "alone-14-day-plan": { days: 14 },
  "grooming-10-day-plan": { days: 10 },
  "walk-14-day-plan": { days: 14 },
  "puppy-30-day-roadmap": {
    days: 30,
    phases: [
      "Aterrissagem",
      "Previsibilidade",
      "Comunicação",
      "Mundo novo",
      "Autocontrole",
      "Independência",
      "Vida real",
    ],
  },
  "training-21-day-plan": { days: 21, phases: ["Fundação", "Clareza", "Vida real"] },
};

const WEEK_GRID_LABELS: Record<string, string[]> = {
  "rescue-30-day-roadmap": [
    "Segurança",
    "Rotina",
    "Expansão gradual",
    "Revisão",
  ],
};

const WEEKLY_GRID_CATEGORIES: Record<string, string[]> = {
  "enrichment-week": ["Nariz", "Cérebro", "Corpo", "Calma"],
  "apartment-week-plan": [
    "Farejo",
    "Treino",
    "Brinquedo alimentar",
    "Nova rota",
    "Brincadeira",
    "Descanso",
  ],
};

const PROCESS_STEPS: Record<string, string[]> = {
  "nutrition-transition": [
    "Alimento antigo",
    "Transição gradual",
    "Alimento novo",
    "Observação",
  ],
  "body-language-before-during-after": [
    "Antes do estímulo",
    "Durante a interação",
    "Tempo de recuperação",
  ],
  "walk-loose-lead-loop": [
    "Guia tensiona",
    "Parar",
    "Reconectar",
    "Avançar novamente",
  ],
  "puppy-toilet-loop": [
    "Acordou",
    "Saiu",
    "Eliminou no local certo",
    "Reforço",
    "Voltou à rotina",
  ],
  "training-learning-loop": ["Sinal", "Comportamento", "Marcador", "Recompensa"],
};

const STAIRCASE_STEPS: Record<string, string[]> = {
  "alone-difficulty-hierarchy": [
    "Levantar do sofá",
    "Sair do prédio",
    "Manter uma ausência real",
  ],
  "alone-seconds-to-minutes": [
    "Um segundo",
    "Pequenas ausências",
    "Retornos fáceis intercalados",
  ],
};

const MATRIX_AXES: Record<string, string[]> = {
  "training-three-ds": ["Duração", "Distância", "Distração"],
};

const COMPARISON_ROWS: Record<string, string[]> = {
  "breeds-lifestyle-matrix": [
    "Energia",
    "Manutenção",
    "Treino",
    "Sociabilidade",
    "Sensibilidade ambiental",
  ],
};

const ROOM_CHECKLIST_ZONES: Record<string, string[]> = {
  "care-home-safety-map": [
    "Cozinha",
    "Sala",
    "Quarto",
    "Varanda",
    "Área de serviço",
  ],
};

const FLOORPLAN_ZONES: Record<string, string[]> = {
  "apartment-zone-map": [
    "Descanso",
    "Alimentação",
    "Enriquecimento",
    "Espera",
    "Segurança",
  ],
};

const TRIGGER_NODES: Record<string, string[]> = {
  "apartment-noise-plan": [
    "Porta",
    "Corredor",
    "Elevador",
    "Janela",
    "Horários",
  ],
};

const DISTANCE_ZONES: Record<string, string[]> = {
  "walk-trigger-distance": [
    "Zona funcional",
    "Zona de alerta",
    "Zona de reação",
  ],
};

const BODY_MAP_ZONES: Record<string, [string, string, string]> = {
  "grooming-tolerance-map": ["Confortável", "Sensível", "Intolerável"],
};

const SILHOUETTE_FOCUS: Record<string, string[]> = {
  "nutrition-body-observation": ["Costelas", "Cintura", "Forma corporal"],
};

const ANNOTATED_BODY_POINTS: Record<string, string[]> = {
  "body-language-whole-dog": [
    "Olhos",
    "Boca",
    "Orelhas",
    "Cauda",
    "Peso corporal",
    "Direção do movimento",
  ],
};

const WARNING_ALERTS: Record<string, string[]> = {
  "grooming-alerts": [
    "Dor",
    "Sangramento",
    "Dificuldade respiratória",
    "Lesão ocular",
    "Agressão de alto risco",
    "Ferida aberta",
  ],
};

const STEP_CARDS: Record<string, string[]> = {
  "toothbrushing-steps": [
    "Tocar face",
    "Levantar lábio",
    "Tocar dente",
    "Apresentar escova",
    "Poucos dentes",
    "Ampliar",
  ],
};

const CHILD_POSTER_RULES: Record<string, string[]> = {
  "child-five-rules": [
    "Não acordar",
    "Não mexer na comida",
    "Não seguir",
    "Não abraçar",
    "Chamar adulto diante de rosnado",
  ],
};

const CHILD_CARD_PHRASE: Record<string, string> = {
  "body-language-child-card": "Se o cão se afasta, a gente deixa.",
};

const ROOM_DIAGRAM_LABEL: Record<string, string> = {
  "child-safe-space": "Cantinho do cão",
};

const CATEGORY_WHEEL_SEGMENTS: Record<string, string[]> = {
  "enrichment-wheel": [
    "Farejo",
    "Alimentação",
    "Cognição",
    "Movimento/social",
    "Descanso",
  ],
  "breeds-budget-wheel": [
    "Alimentação",
    "Grooming",
    "Prevenção",
    "Treino",
    "Transporte",
    "Hospedagem",
    "Emergência",
  ],
};

const SLIDER_MARKERS: Record<string, string[]> = {
  "enrichment-difficulty": ["Fácil", "Desafiador", "Frustrante"],
};

const CHECKLIST_ITEMS: Record<string, string[]> = {
  "enrichment-safety": [
    "Tamanho",
    "Arestas",
    "Peças pequenas",
    "Comida",
    "Saúde",
    "Supervisão",
    "Facilidade",
  ],
  "breeds-reality-check-card": [
    "Tempo",
    "Passeio",
    "Grooming",
    "Orçamento",
    "Viagens",
    "Plano de emergência",
  ],
};

const DECISION_BRANCHES: Record<string, string[]> = {
  "breeds-before-choice": [
    "Rotina",
    "Energia",
    "Companhia",
    "Grooming",
    "Clima",
    "Orçamento",
    "Logística",
  ],
};

const ANNOTATED_CARD_FIELDS: Record<string, string[]> = {
  "breeds-profile-anatomy": [
    "Porte",
    "Energia",
    "Grooming",
    "Contexto familiar",
    "Clima",
    "Perguntas antes de escolher",
  ],
};

const ANNOTATED_LABEL_FIELDS: Record<string, string[]> = {
  "nutrition-label-path": [
    "Espécie",
    "Fase de vida",
    "Adequação nutricional",
    "Energia",
    "Instruções",
    "Fabricante",
  ],
};

const ANNUAL_THEMES: Record<string, string[]> = {
  "care-annual-calendar": [
    "Prevenção",
    "Identificação",
    "Peso",
    "Boca",
    "Rotina",
    "Revisão veterinária",
  ],
};

const TRACKER_ROWS: Record<string, string[]> = {
  "rescue-observation-journal": [
    "Situação",
    "Resposta",
    "Recuperação",
    "O que ajudou",
  ],
  "nutrition-30-day-tracker": [
    "Alimento",
    "Petiscos",
    "Peso",
    "Fezes",
    "Apetite",
    "Água",
    "Energia",
  ],
};

const OBSERVATION_COLUMNS: Record<string, string[]> = {
  "alone-camera-check": [
    "Alimentação",
    "Vocalização",
    "Porta",
    "Movimento",
    "Descanso",
    "Tempo de recuperação",
  ],
};

const ROUTE_CARDS: Record<string, string[]> = {
  "walk-route-abc": ["Normal", "Curta", "Fuga"],
};

// ---------------------------------------------------------------------------
// Shared Figure shell
// ---------------------------------------------------------------------------

type RendererProps = {
  placement: LibraryMediaPlacement;
  className?: string;
};

function Figure({
  placement,
  icon: Icon,
  className,
  decorative = true,
  children,
}: {
  placement: LibraryMediaPlacement;
  icon: LucideIcon;
  className?: string;
  decorative?: boolean;
  children: React.ReactNode;
}) {
  const label = VISUAL_LABELS[placement.render ?? ""] ?? "Visual MyPets";
  return (
    <figure
      role="group"
      aria-label={placement.alt}
      className={cn(
        "my-7 break-inside-avoid overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-[linear-gradient(135deg,#f0fbf4,#fffaf0)] p-5 shadow-sm",
        className,
      )}
    >
      <header className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-petrol text-emerald-200">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[.15em] text-emerald-700">{label}</p>
          <p className="mt-1 text-sm font-black leading-snug text-petrol">{placement.alt}</p>
        </div>
      </header>
      <div className="mt-4">{children}</div>
      <figcaption className="mt-4 text-xs leading-6 text-petrol/68">{placement.caption}</figcaption>
      {decorative ? (
        <p className="mt-2 text-[9px] font-bold uppercase tracking-wide text-petrol/35 print:hidden">
          Visual editorial MyPets · versão acessível
        </p>
      ) : null}
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TRAFFIC_COLORS = ["bg-emerald-500", "bg-amber-500", "bg-red-500"] as const;
const TRAFFIC_RING = ["ring-emerald-200", "ring-amber-200", "ring-red-200"] as const;

const MONTHS_PT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const WEEKDAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// ---------------------------------------------------------------------------
// 1. traffic-light
// ---------------------------------------------------------------------------

function TrafficLightRenderer({ placement, className }: RendererProps) {
  const labels: [string, string, string] =
    TRAFFIC_LABELS[placement.id] ?? [
      "Confortável",
      "Desconforto crescente",
      "Necessidade imediata de espaço",
    ];
  return (
    <Figure placement={placement} icon={TrafficCone} className={className}>
      <ul className="space-y-2">
        {labels.map((label, i) => (
          <li
            key={label}
            className={cn(
              "flex items-center gap-3 rounded-2xl border bg-white/70 px-3 py-2.5",
              "border-petrol/8",
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4",
                TRAFFIC_COLORS[i],
                TRAFFIC_RING[i],
              )}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[.14em] text-petrol/45">
                {TRAFFIC_LEVELS[i]}
              </p>
              <p className="truncate text-sm font-bold text-petrol">{label}</p>
            </div>
          </li>
        ))}
      </ul>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 2. timeline
// ---------------------------------------------------------------------------

function TimelineRenderer({ placement, className }: RendererProps) {
  const nodes: string[] =
    TIMELINE_NODES[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6);
  const dotCount = nodes.length;
  const span = 100;
  const step = dotCount > 1 ? span / (dotCount - 1) : 0;
  const lineY = 24;
  const dotR = 6;
  return (
    <Figure placement={placement} icon={GitBranch} className={className}>
      <svg
        viewBox={`0 0 ${span} 56`}
        preserveAspectRatio="none"
        className="h-14 w-full"
        role="img"
        aria-labelledby={`timeline-${placement.id}-title`}
      >
        <title id={`timeline-${placement.id}-title`}>{placement.alt}</title>
        <line
          x1={step / 2}
          y1={lineY}
          x2={span - step / 2}
          y2={lineY}
          stroke="#153847"
          strokeWidth="0.6"
          strokeDasharray="2 2"
        />
        {nodes.map((_, i) => {
          const x = dotCount > 1 ? i * step : span / 2;
          return (
            <g key={i}>
              <circle cx={x} cy={lineY} r={dotR} fill="#10202a" />
              <circle cx={x} cy={lineY} r={dotR - 2.4} fill="#2ea3a0" />
            </g>
          );
        })}
      </svg>
      <ul
        className="mt-3 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.min(dotCount, 4)}, minmax(0, 1fr))` }}
      >
        {nodes.map((node, i) => (
          <li key={node} className="rounded-xl border border-petrol/8 bg-white/70 px-2.5 py-2">
            <p className="text-[9px] font-black uppercase tracking-[.14em] text-emerald-700">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-0.5 text-[11px] font-bold leading-tight text-petrol">{node}</p>
          </li>
        ))}
      </ul>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 3. day-grid
// ---------------------------------------------------------------------------

function DayGridRenderer({ placement, className }: RendererProps) {
  const cfg = DAY_GRID_CONFIG[placement.id] ?? { days: 14 };
  const cells = Array.from({ length: cfg.days }, (_, i) => i);
  const cols = cfg.days > 14 ? 7 : 5;
  return (
    <Figure placement={placement} icon={Calendar} className={className}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[9px] font-black uppercase tracking-[.14em] text-emerald-700">
          {cfg.days} dias
        </p>
        <p className="text-[9px] font-bold uppercase tracking-wide text-petrol/40">
          cada quadrado = um dia
        </p>
      </div>
      {cfg.phases?.length ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {cfg.phases.map((phase, i) => (
            <li
              key={phase}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800"
            >
              <span className="mr-1 text-emerald-500">{i + 1}</span>
              {phase}
            </li>
          ))}
        </ul>
      ) : null}
      <ul
        className="mt-3 grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        aria-label={`Grade de ${cfg.days} dias`}
      >
        {cells.map((i) => (
          <li
            key={i}
            className="aspect-square rounded-md border border-petrol/8 bg-white/60"
            aria-hidden="true"
          />
        ))}
      </ul>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 4. week-grid
// ---------------------------------------------------------------------------

function WeekGridRenderer({ placement, className }: RendererProps) {
  const weeks =
    WEEK_GRID_LABELS[placement.id] ?? ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
  return (
    <Figure placement={placement} icon={Calendar} className={className}>
      <ol className="space-y-2">
        {weeks.map((week, i) => (
          <li
            key={week}
            className="flex items-center gap-3 rounded-2xl border border-petrol/8 bg-white/70 px-3 py-2.5"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-black text-white"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[.14em] text-petrol/45">
                Semana {i + 1}
              </p>
              <p className="text-sm font-bold text-petrol">{week}</p>
            </div>
          </li>
        ))}
      </ol>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 5. weekly-grid
// ---------------------------------------------------------------------------

function WeeklyGridRenderer({ placement, className }: RendererProps) {
  const categories: string[] =
    WEEKLY_GRID_CATEGORIES[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  return (
    <Figure placement={placement} icon={Calendar} className={className}>
      <ul
        className="grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
        aria-label="Planeador semanal — dias da semana"
      >
        {WEEKDAYS_PT.map((day) => (
          <li
            key={day}
            className="rounded-md bg-petrol/5 px-1 py-1.5 text-center text-[9px] font-black uppercase tracking-wide text-petrol/60"
          >
            {day}
          </li>
        ))}
        {WEEKDAYS_PT.map((day, i) => (
          <li
            key={`${day}-${i}`}
            className="flex min-h-12 flex-col gap-1 rounded-md border border-petrol/8 bg-white/60 p-1"
            aria-hidden="true"
          >
            <span className="h-2 rounded-sm bg-emerald-200/70" />
            <span className="h-2 rounded-sm bg-amber-200/70" />
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <p className="text-[9px] font-black uppercase tracking-[.14em] text-emerald-700">
          Categorias
        </p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <li
              key={cat}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800"
            >
              {cat}
            </li>
          ))}
        </ul>
      </div>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 6. process
// ---------------------------------------------------------------------------

function ProcessRenderer({ placement, className }: RendererProps) {
  const steps: string[] =
    PROCESS_STEPS[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  return (
    <Figure placement={placement} icon={Workflow} className={className}>
      <ol className="space-y-2">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li key={step} className="relative">
              <div className="flex items-center gap-3 rounded-2xl border border-petrol/8 bg-white/70 px-3 py-2.5">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-petrol text-[11px] font-black text-emerald-200"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <p className="min-w-0 flex-1 text-sm font-bold text-petrol">{step}</p>
                {isLast ? (
                  <ArrowRight
                    className="h-4 w-4 -rotate-90 text-emerald-500"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowRight className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                )}
              </div>
              {isLast ? (
                <p className="mt-1 pl-3 text-[9px] font-black uppercase tracking-[.14em] text-emerald-700">
                  reinicia o ciclo
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 7. staircase
// ---------------------------------------------------------------------------

function StaircaseRenderer({ placement, className }: RendererProps) {
  const steps: string[] =
    STAIRCASE_STEPS[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4);
  return (
    <Figure placement={placement} icon={ArrowUp} className={className}>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li
            key={step}
            className="flex items-center gap-3"
            style={{ paddingLeft: `${i * 12}px` }}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-black text-white"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <p className="min-w-0 flex-1 rounded-r-xl rounded-tl-xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-sm font-bold text-petrol">
              {step}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[9px] font-black uppercase tracking-[.14em] text-amber-700">
        Progressão gradual
      </p>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 8. matrix
// ---------------------------------------------------------------------------

function MatrixRenderer({ placement, className }: RendererProps) {
  const axes: string[] = MATRIX_AXES[placement.id] ?? ["Duração", "Distância", "Distração"];
  const cells = Array.from({ length: 9 }, (_, i) => i);
  return (
    <Figure placement={placement} icon={LayoutGrid} className={className}>
      <div className="flex flex-wrap items-baseline gap-2">
        {axes.map((axis) => (
          <span
            key={axis}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            {axis}
          </span>
        ))}
      </div>
      <ul
        className="mt-3 grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
        aria-label="Matriz 3x3 — varia apenas uma dimensão por vez"
      >
        {cells.map((i) => (
          <li
            key={i}
            className="flex aspect-square items-center justify-center rounded-md border border-petrol/8 bg-white/60"
            aria-hidden="true"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[9px] font-bold uppercase tracking-wide text-petrol/40">
        Aumente apenas um eixo de cada vez
      </p>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 9. comparison-matrix
// ---------------------------------------------------------------------------

function ComparisonMatrixRenderer({ placement, className }: RendererProps) {
  const rows: string[] = COMPARISON_ROWS[placement.id] ?? ["Energia", "Manutenção", "Treino"];
  const cols = ["Perfil A", "Perfil B", "Perfil C"];
  return (
    <Figure placement={placement} icon={BarChart3} className={className}>
      <div className="overflow-hidden rounded-2xl border border-petrol/8">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="bg-petrol/[.04] px-3 py-2 text-[9px] font-black uppercase tracking-[.14em] text-petrol/55">
                Critério
              </th>
              {cols.map((c) => (
                <th
                  key={c}
                  className="bg-petrol/[.04] px-3 py-2 text-[9px] font-black uppercase tracking-[.14em] text-petrol/55"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row} className="border-t border-petrol/8">
                <th
                  scope="row"
                  className="bg-white/60 px-3 py-2.5 text-[11px] font-bold text-petrol"
                >
                  {row}
                </th>
                {cols.map((_, j) => (
                  <td key={j} className="px-3 py-2.5" aria-hidden="true">
                    <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-petrol/15" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[9px] font-bold uppercase tracking-wide text-petrol/40">
        Tendências relativas — sem scores absolutos
      </p>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 10. room-checklist
// ---------------------------------------------------------------------------

function RoomChecklistRenderer({ placement, className }: RendererProps) {
  const zones: string[] =
    ROOM_CHECKLIST_ZONES[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  return (
    <Figure placement={placement} icon={ClipboardCheck} className={className} decorative={false}>
      <svg
        viewBox="0 0 240 150"
        className="h-32 w-full"
        role="img"
        aria-labelledby={`room-checklist-${placement.id}-title`}
      >
        <title id={`room-checklist-${placement.id}-title`}>{placement.alt}</title>
        <rect x="20" y="20" width="200" height="110" rx="6" fill="#fffaf0" stroke="#10202a" strokeWidth="1.4" />
        <path d="M 100 20 L 100 8 L 140 8 L 140 20" fill="none" stroke="#10202a" strokeWidth="1.4" />
        <path d="M 20 95 L 220 95" stroke="#10202a" strokeWidth="0.6" strokeDasharray="3 3" />
        <path d="M 120 20 L 120 130" stroke="#10202a" strokeWidth="0.6" strokeDasharray="3 3" />
      </svg>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {zones.map((zone) => (
          <li
            key={zone}
            className="flex items-center gap-2.5 rounded-xl border border-petrol/8 bg-white/70 px-3 py-2.5"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
            <span className="text-sm font-bold text-petrol">{zone}</span>
          </li>
        ))}
      </ul>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 11. floorplan
// ---------------------------------------------------------------------------

function FloorplanRenderer({ placement, className }: RendererProps) {
  const zones: string[] =
    FLOORPLAN_ZONES[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  const zoneColors = [
    "bg-emerald-50 text-emerald-800 border-emerald-200",
    "bg-amber-50 text-amber-800 border-amber-200",
    "bg-sky-50 text-sky-800 border-sky-200",
    "bg-rose-50 text-rose-800 border-rose-200",
    "bg-violet-50 text-violet-800 border-violet-200",
    "bg-teal-50 text-teal-800 border-teal-200",
  ];
  return (
    <Figure placement={placement} icon={House} className={className}>
      <svg
        viewBox="0 0 240 160"
        className="h-40 w-full"
        role="img"
        aria-labelledby={`floorplan-${placement.id}-title`}
      >
        <title id={`floorplan-${placement.id}-title`}>{placement.alt}</title>
        <rect x="20" y="30" width="200" height="110" rx="4" fill="#fffaf0" stroke="#10202a" strokeWidth="1.4" />
        <path d="M 20 30 L 120 8 L 220 30" fill="none" stroke="#10202a" strokeWidth="1.4" />
        <path d="M 120 30 L 120 140" stroke="#10202a" strokeWidth="0.7" strokeDasharray="3 3" />
        <path d="M 20 95 L 220 95" stroke="#10202a" strokeWidth="0.7" strokeDasharray="3 3" />
      </svg>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {zones.map((zone, i) => (
          <li
            key={zone}
            className={cn(
              "rounded-xl border px-3 py-2 text-[11px] font-bold",
              zoneColors[i % zoneColors.length],
            )}
          >
            <span
              className="mr-1.5 inline-block h-2 w-2 rounded-full bg-current align-middle"
              aria-hidden="true"
            />
            {zone}
          </li>
        ))}
      </ul>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 12. trigger-map
// ---------------------------------------------------------------------------

function TriggerMapRenderer({ placement, className }: RendererProps) {
  const nodes: string[] =
    TRIGGER_NODES[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  const count = nodes.length;
  return (
    <Figure placement={placement} icon={Wind} className={className}>
      <svg
        viewBox="0 0 240 150"
        className="h-36 w-full"
        role="img"
        aria-labelledby={`trigger-map-${placement.id}-title`}
      >
        <title id={`trigger-map-${placement.id}-title`}>{placement.alt}</title>
        <circle cx="120" cy="75" r="22" fill="#10202a" />
        <circle cx="120" cy="75" r="14" fill="#2ea3a0" />
        {nodes.map((_, i) => {
          const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
          const x = 120 + Math.cos(angle) * 60;
          const y = 75 + Math.sin(angle) * 50;
          return (
            <g key={i}>
              <line x1={120} y1={75} x2={x} y2={y} stroke="#153847" strokeWidth="0.8" strokeDasharray="3 3" />
              <circle cx={x} cy={y} r="9" fill="#fffaf0" stroke="#10202a" strokeWidth="1.2" />
              <circle cx={x} cy={y} r="4" fill="#f5a623" />
            </g>
          );
        })}
      </svg>
      <ul className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {nodes.map((node, i) => (
          <li
            key={node}
            className="flex items-center gap-2 rounded-lg border border-petrol/8 bg-white/70 px-2.5 py-1.5"
          >
            <span className="text-[10px] font-black text-amber-600" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[11px] font-bold text-petrol">{node}</span>
          </li>
        ))}
      </ul>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 13. distance-diagram
// ---------------------------------------------------------------------------

function DistanceDiagramRenderer({ placement, className }: RendererProps) {
  const zones: string[] =
    DISTANCE_ZONES[placement.id] ?? ["Zona funcional", "Zona de alerta", "Zona de reação"];
  const colors = ["#10b981", "#f59e0b", "#ef4444"] as const;
  return (
    <Figure placement={placement} icon={MoveHorizontal} className={className}>
      <svg
        viewBox="0 0 240 90"
        className="h-24 w-full"
        role="img"
        aria-labelledby={`distance-${placement.id}-title`}
      >
        <title id={`distance-${placement.id}-title`}>{placement.alt}</title>
        <defs>
          <linearGradient id={`dist-grad-${placement.id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <rect x="20" y="35" width="200" height="20" rx="10" fill={`url(#dist-grad-${placement.id})`} />
        <circle cx="20" cy="45" r="8" fill="#10202a" />
        <circle cx="220" cy="45" r="8" fill="#f5a623" />
        <path d="M 12 60 L 28 60 M 20 52 L 20 68" stroke="#10202a" strokeWidth="1.4" />
        <path d="M 212 60 L 228 60 M 220 52 L 220 68 M 215 56 L 225 56 M 215 64 L 225 64" stroke="#10202a" strokeWidth="1.4" />
      </svg>
      <ul className="mt-3 grid grid-cols-3 gap-1.5">
        {zones.map((zone, i) => (
          <li key={zone} className="rounded-lg border border-petrol/8 bg-white/70 px-2.5 py-2">
            <span
              className="mb-1 block h-1.5 w-full rounded-full"
              style={{ backgroundColor: colors[i] }}
              aria-hidden="true"
            />
            <p className="text-[10px] font-bold leading-tight text-petrol">{zone}</p>
          </li>
        ))}
      </ul>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 14. body-map
// ---------------------------------------------------------------------------

function BodyMapRenderer({ placement, className }: RendererProps) {
  const zones: [string, string, string] = BODY_MAP_ZONES[placement.id] ?? [
    "Confortável",
    "Sensível",
    "Intolerável",
  ];
  const colors = ["#10b981", "#f59e0b", "#ef4444"] as const;
  return (
    <Figure placement={placement} icon={HeartPulse} className={className}>
      <svg
        viewBox="0 0 220 160"
        className="h-40 w-full"
        role="img"
        aria-labelledby={`body-map-${placement.id}-title`}
      >
        <title id={`body-map-${placement.id}-title`}>{placement.alt}</title>
        <ellipse cx="110" cy="95" rx="58" ry="32" fill="#fffaf0" stroke="#10202a" strokeWidth="1.4" />
        <circle cx="160" cy="65" r="22" fill="#fffaf0" stroke="#10202a" strokeWidth="1.4" />
        <path d="M 150 50 L 142 35 L 152 38 Z" fill="#10202a" />
        <path d="M 168 50 L 178 35 L 170 38 Z" fill="#10202a" />
        <rect x="68" y="120" width="10" height="30" rx="3" fill="#10202a" />
        <rect x="92" y="120" width="10" height="30" rx="3" fill="#10202a" />
        <rect x="116" y="120" width="10" height="30" rx="3" fill="#10202a" />
        <rect x="140" y="120" width="10" height="30" rx="3" fill="#10202a" />
        <path d="M 168 88 Q 195 80, 198 60" stroke="#10202a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <ellipse cx="80" cy="88" rx="16" ry="9" fill={colors[0]} opacity="0.55" />
        <ellipse cx="120" cy="98" rx="16" ry="9" fill={colors[1]} opacity="0.55" />
        <ellipse cx="160" cy="65" rx="7" ry="5" fill={colors[2]} opacity="0.7" />
      </svg>
      <ul className="mt-3 grid grid-cols-3 gap-1.5">
        {zones.map((zone, i) => (
          <li key={zone} className="rounded-lg border border-petrol/8 bg-white/70 px-2.5 py-2">
            <span
              className="mb-1 block h-1.5 w-full rounded-full"
              style={{ backgroundColor: colors[i] }}
              aria-hidden="true"
            />
            <p className="text-[10px] font-bold leading-tight text-petrol">{zone}</p>
          </li>
        ))}
      </ul>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 15. annotated-body
// ---------------------------------------------------------------------------

function AnnotatedBodyRenderer({ placement, className }: RendererProps) {
  const points: string[] =
    ANNOTATED_BODY_POINTS[placement.id] ??
    ["Olhos", "Boca", "Orelhas", "Cauda", "Peso corporal", "Direção do movimento"];
  // Positions of annotation dots/labels around the dog silhouette.
  const positions = [
    { x: 160, y: 60, lx: 210, ly: 35, label: points[0] ?? "Olhos" },
    { x: 168, y: 75, lx: 215, ly: 85, label: points[1] ?? "Boca" },
    { x: 150, y: 45, lx: 205, ly: 18, label: points[2] ?? "Orelhas" },
    { x: 195, y: 60, lx: 215, ly: 125, label: points[3] ?? "Cauda" },
    { x: 110, y: 95, lx: 30, ly: 95, label: points[4] ?? "Peso corporal" },
    { x: 110, y: 60, lx: 30, ly: 32, label: points[5] ?? "Direção do movimento" },
  ];
  return (
    <Figure placement={placement} icon={Dog} className={className}>
      <svg
        viewBox="0 0 240 150"
        className="h-40 w-full"
        role="img"
        aria-labelledby={`annotated-body-${placement.id}-title`}
      >
        <title id={`annotated-body-${placement.id}-title`}>{placement.alt}</title>
        <ellipse cx="110" cy="95" rx="50" ry="26" fill="#fffaf0" stroke="#10202a" strokeWidth="1.4" />
        <circle cx="155" cy="65" r="20" fill="#fffaf0" stroke="#10202a" strokeWidth="1.4" />
        <path d="M 147 50 L 138 36 L 148 40 Z" fill="#10202a" />
        <path d="M 163 50 L 172 36 L 165 40 Z" fill="#10202a" />
        <rect x="75" y="118" width="9" height="28" rx="3" fill="#10202a" />
        <rect x="95" y="118" width="9" height="28" rx="3" fill="#10202a" />
        <rect x="120" y="118" width="9" height="28" rx="3" fill="#10202a" />
        <rect x="140" y="118" width="9" height="28" rx="3" fill="#10202a" />
        <path d="M 160 78 Q 188 72, 192 52" stroke="#10202a" strokeWidth="3" fill="none" strokeLinecap="round" />
        {positions.map((p, i) => (
          <g key={i}>
            <line x1={p.x} y1={p.y} x2={p.lx} y2={p.ly} stroke="#153847" strokeWidth="0.6" strokeDasharray="2 2" />
            <circle cx={p.x} cy={p.y} r="3.5" fill="#f5a623" stroke="#10202a" strokeWidth="0.8" />
            <text
              x={p.lx}
              y={p.ly}
              fontSize="7"
              fontWeight="700"
              fill="#10202a"
              textAnchor={p.lx > 120 ? "start" : "end"}
              dominantBaseline="middle"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 16. silhouette-guide
// ---------------------------------------------------------------------------

function SilhouetteGuideRenderer({ placement, className }: RendererProps) {
  const focus: string[] = SILHOUETTE_FOCUS[placement.id] ?? [];
  return (
    <Figure placement={placement} icon={PawPrint} className={className}>
      <svg
        viewBox="0 0 240 110"
        className="h-28 w-full"
        role="img"
        aria-labelledby={`silhouette-${placement.id}-title`}
      >
        <title id={`silhouette-${placement.id}-title`}>{placement.alt}</title>
        {[0, 1, 2].map((i) => {
          const baseX = 25 + i * 75;
          const waistFactor = i === 0 ? 0 : i === 1 ? 1 : 2;
          return (
            <g key={i}>
              <ellipse cx={baseX + 30} cy={55} rx="28" ry="18" fill="#fffaf0" stroke="#10202a" strokeWidth="1.2" />
              <ellipse
                cx={baseX + 30}
                cy={55}
                rx={20}
                ry={12 - waistFactor}
                fill="#153847"
                opacity="0.08"
              />
              <circle cx={baseX + 56} cy="48" r="11" fill="#fffaf0" stroke="#10202a" strokeWidth="1.2" />
              <path d={`M ${baseX + 49} 38 L ${baseX + 43} 26 L ${baseX + 51} 30 Z`} fill="#10202a" />
              <rect x={baseX + 4} y="68" width="6" height="22" rx="2" fill="#10202a" />
              <rect x={baseX + 22} y="68" width="6" height="22" rx="2" fill="#10202a" />
              <rect x={baseX + 40} y="68" width="6" height="22" rx="2" fill="#10202a" />
              <rect x={baseX + 56} y="68" width="6" height="22" rx="2" fill="#10202a" />
              <path
                d={`M ${baseX + 58} 50 Q ${baseX + 70} 40, ${baseX + 72} 28`}
                stroke="#10202a"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </svg>
      {focus.length ? (
        <ul className="mt-3 grid grid-cols-3 gap-1.5">
          {focus.map((area) => (
            <li
              key={area}
              className="rounded-lg border border-petrol/8 bg-white/70 px-2 py-1.5 text-center text-[10px] font-bold text-petrol"
            >
              {area}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-3 text-[9px] font-bold uppercase tracking-wide text-petrol/45">
        Três silhuetas estilizadas — observe tendências, sem diagnosticar
      </p>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 17. warning-grid
// ---------------------------------------------------------------------------

function WarningGridRenderer({ placement, className }: RendererProps) {
  const alerts: string[] =
    WARNING_ALERTS[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  return (
    <Figure placement={placement} icon={Siren} className={className} decorative={false}>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {alerts.map((alert) => (
          <li
            key={alert}
            className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50/80 px-3 py-2.5"
          >
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500 text-white"
              aria-hidden="true"
            >
              <Siren className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm font-bold text-red-900">{alert}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[9px] font-black uppercase tracking-[.14em] text-red-700">
        Pare e procure avaliação profissional
      </p>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 18. step-cards
// ---------------------------------------------------------------------------

function StepCardsRenderer({ placement, className }: RendererProps) {
  const steps: string[] =
    STEP_CARDS[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  return (
    <Figure placement={placement} icon={ListChecks} className={className}>
      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {steps.map((step, i) => (
          <li
            key={step}
            className="flex items-center gap-3 rounded-xl border border-petrol/8 bg-white/70 px-3 py-2.5"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-petrol text-[11px] font-black text-emerald-200"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="text-sm font-bold text-petrol">{step}</span>
          </li>
        ))}
      </ol>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 19. child-poster
// ---------------------------------------------------------------------------

function ChildPosterRenderer({ placement, className }: RendererProps) {
  const rules: string[] = CHILD_POSTER_RULES[placement.id] ?? [];
  return (
    <Figure placement={placement} icon={Baby} className={className} decorative={false}>
      <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-3">
        <p className="text-center text-[9px] font-black uppercase tracking-[.18em] text-amber-700">
          Cinco regras
        </p>
        <ol className="mt-2 space-y-1.5">
          {rules.map((rule, i) => (
            <li
              key={rule}
              className="flex items-center gap-2.5 rounded-xl bg-white/80 px-3 py-2"
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-black text-white"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="text-[13px] font-bold leading-snug text-petrol">{rule}</span>
            </li>
          ))}
        </ol>
      </div>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 20. child-card
// ---------------------------------------------------------------------------

function ChildCardRenderer({ placement, className }: RendererProps) {
  const phrase: string = CHILD_CARD_PHRASE[placement.id] ?? placement.alt;
  return (
    <Figure placement={placement} icon={Baby} className={className} decorative={false}>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-center">
        <PawPrint className="mx-auto h-8 w-8 text-emerald-600" aria-hidden="true" />
        <p className="mt-3 text-lg font-black leading-tight text-petrol">
          “{phrase}”
        </p>
      </div>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 21. room-diagram
// ---------------------------------------------------------------------------

function RoomDiagramRenderer({ placement, className }: RendererProps) {
  const label: string = ROOM_DIAGRAM_LABEL[placement.id] ?? "Cantinho do cão";
  return (
    <Figure placement={placement} icon={BedSingle} className={className}>
      <svg
        viewBox="0 0 240 150"
        className="h-36 w-full"
        role="img"
        aria-labelledby={`room-diagram-${placement.id}-title`}
      >
        <title id={`room-diagram-${placement.id}-title`}>{placement.alt}</title>
        <rect x="20" y="20" width="200" height="110" rx="6" fill="#fffaf0" stroke="#10202a" strokeWidth="1.4" />
        <path d="M 100 20 L 100 8 L 140 8 L 140 20" fill="none" stroke="#10202a" strokeWidth="1.4" />
        <rect x="135" y="65" width="70" height="50" rx="6" fill="#10b981" fillOpacity="0.18" stroke="#10b981" strokeWidth="1.6" />
        <rect x="148" y="78" width="44" height="22" rx="4" fill="#10b981" fillOpacity="0.35" stroke="#10b981" strokeWidth="1.4" />
        <circle cx="170" cy="46" r="3" fill="#10202a" />
        <text x="170" y="128" fontSize="8" fontWeight="700" fill="#10202a" textAnchor="middle">
          {label}
        </text>
        <text x="80" y="80" fontSize="7" fontWeight="600" fill="#153847" textAnchor="middle" opacity="0.6">
          área compartilhada
        </text>
      </svg>
      <p className="mt-3 text-[9px] font-black uppercase tracking-[.14em] text-emerald-700">
        Área exclusiva e protegida
      </p>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 22. category-wheel
// ---------------------------------------------------------------------------

function CategoryWheelRenderer({ placement, className }: RendererProps) {
  const segments: string[] =
    CATEGORY_WHEEL_SEGMENTS[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  const count = segments.length;
  const cx = 120;
  const cy = 80;
  const r = 60;
  const colors = [
    "#10b981",
    "#f5a623",
    "#2ea3a0",
    "#153847",
    "#f59e0b",
    "#84cc16",
    "#f97316",
    "#0ea5e9",
  ];
  return (
    <Figure placement={placement} icon={Compass} className={className}>
      <svg
        viewBox="0 0 240 160"
        className="h-40 w-full"
        role="img"
        aria-labelledby={`wheel-${placement.id}-title`}
      >
        <title id={`wheel-${placement.id}-title`}>{placement.alt}</title>
        {segments.map((_, i) => {
          const a0 = (i / count) * Math.PI * 2 - Math.PI / 2;
          const a1 = ((i + 1) / count) * Math.PI * 2 - Math.PI / 2;
          const x0 = cx + Math.cos(a0) * r;
          const y0 = cy + Math.sin(a0) * r;
          const x1 = cx + Math.cos(a1) * r;
          const y1 = cy + Math.sin(a1) * r;
          const large = a1 - a0 > Math.PI ? 1 : 0;
          const d = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
          return (
            <path
              key={i}
              d={d}
              fill={colors[i % colors.length]}
              fillOpacity="0.85"
              stroke="#fffaf0"
              strokeWidth="1.2"
            />
          );
        })}
        <circle cx={cx} cy={cy} r="16" fill="#10202a" />
        <PawPrintIcon cx={cx} cy={cy} />
      </svg>
      <ul className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {segments.map((seg, i) => (
          <li
            key={seg}
            className="flex items-center gap-2 rounded-lg border border-petrol/8 bg-white/70 px-2.5 py-1.5"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: colors[i % colors.length] }}
              aria-hidden="true"
            />
            <span className="text-[11px] font-bold text-petrol">{seg}</span>
          </li>
        ))}
      </ul>
    </Figure>
  );
}

function PawPrintIcon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx - 5} ${cy - 5})`} aria-hidden="true">
      <circle cx="5" cy="5" r="2.5" fill="#fffaf0" />
      <circle cx="0" cy="1.5" r="1.2" fill="#fffaf0" />
      <circle cx="10" cy="1.5" r="1.2" fill="#fffaf0" />
      <circle cx="1.5" cy="9" r="1" fill="#fffaf0" />
      <circle cx="8.5" cy="9" r="1" fill="#fffaf0" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// 23. slider
// ---------------------------------------------------------------------------

function SliderRenderer({ placement, className }: RendererProps) {
  const markers: string[] =
    SLIDER_MARKERS[placement.id] ?? ["Fácil", "Desafiador", "Frustrante"];
  const colors = ["#10b981", "#f5a623", "#ef4444"] as const;
  return (
    <Figure placement={placement} icon={Gauge} className={className}>
      <div className="relative mt-2 px-1">
        <div
          className="h-2 w-full rounded-full"
          style={{
            background: "linear-gradient(90deg,#10b981 0%,#f5a623 50%,#ef4444 100%)",
          }}
          aria-hidden="true"
        />
        <ul className="mt-3 grid grid-cols-3 gap-1">
          {markers.map((marker, i) => (
            <li key={marker} className="flex flex-col items-center text-center">
              <span
                className="h-4 w-4 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: colors[i] }}
                aria-hidden="true"
              />
              <span className="mt-1.5 text-[11px] font-bold leading-tight text-petrol">
                {marker}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-3 text-[9px] font-bold uppercase tracking-wide text-petrol/40">
        Ajuste a dificuldade: tentativa + sucesso, sem virar frustração
      </p>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 24. checklist-card
// ---------------------------------------------------------------------------

function ChecklistCardRenderer({ placement, className }: RendererProps) {
  const items: string[] =
    CHECKLIST_ITEMS[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  return (
    <Figure placement={placement} icon={ListChecks} className={className} decorative={false}>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2.5 rounded-xl border border-petrol/8 bg-white/70 px-3 py-2.5"
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-emerald-400 bg-emerald-50"
              aria-hidden="true"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            </span>
            <span className="text-sm font-bold text-petrol">{item}</span>
          </li>
        ))}
      </ul>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 25. decision-tree
// ---------------------------------------------------------------------------

function DecisionTreeRenderer({ placement, className }: RendererProps) {
  const branches: string[] =
    DECISION_BRANCHES[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  const half = Math.ceil(branches.length / 2);
  const left = branches.slice(0, half);
  const right = branches.slice(half);
  return (
    <Figure placement={placement} icon={GitBranch} className={className}>
      <div className="flex flex-col items-center">
        <span className="rounded-full bg-petrol px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-emerald-200">
          Escolha consciente
        </span>
        <span className="mt-1 h-4 w-px bg-petrol/30" aria-hidden="true" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ul className="space-y-1.5">
          {left.map((b, i) => (
            <li key={b} className="flex items-center gap-2">
              <span className="text-[10px] font-black text-emerald-700" aria-hidden="true">
                {i + 1}
              </span>
              <span className="rounded-lg border border-petrol/8 bg-white/70 px-2.5 py-1.5 text-[11px] font-bold text-petrol">
                {b}
              </span>
            </li>
          ))}
        </ul>
        <ul className="space-y-1.5">
          {right.map((b, i) => (
            <li key={b} className="flex items-center gap-2">
              <span className="text-[10px] font-black text-emerald-700" aria-hidden="true">
                {i + half + 1}
              </span>
              <span className="rounded-lg border border-petrol/8 bg-white/70 px-2.5 py-1.5 text-[11px] font-bold text-petrol">
                {b}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 26. annotated-card
// ---------------------------------------------------------------------------

function AnnotatedCardRenderer({ placement, className }: RendererProps) {
  const fields: string[] =
    ANNOTATED_CARD_FIELDS[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  return (
    <Figure placement={placement} icon={Tag} className={className}>
      <div className="rounded-2xl border border-petrol/10 bg-white/80 p-4">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-black uppercase tracking-[.14em] text-emerald-700">
            Perfil de raça
          </p>
          <PawPrint className="h-4 w-4 text-petrol/40" aria-hidden="true" />
        </div>
        <div
          className="mt-3 h-20 rounded-xl"
          style={{ background: "linear-gradient(135deg,#f0fbf4,#fffaf0)" }}
          aria-hidden="true"
        />
        <ul className="mt-3 grid grid-cols-2 gap-1.5">
          {fields.map((field, i) => (
            <li
              key={field}
              className="rounded-lg border border-petrol/8 bg-white/60 px-2.5 py-1.5"
            >
              <p className="text-[8px] font-black uppercase tracking-[.14em] text-petrol/45">
                campo {i + 1}
              </p>
              <p className="text-[11px] font-bold leading-tight text-petrol">{field}</p>
            </li>
          ))}
        </ul>
      </div>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 27. annotated-label
// ---------------------------------------------------------------------------

function AnnotatedLabelRenderer({ placement, className }: RendererProps) {
  const fields: string[] =
    ANNOTATED_LABEL_FIELDS[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  return (
    <Figure placement={placement} icon={Bone} className={className}>
      <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 p-4">
        <div className="flex items-center justify-between border-b border-amber-200 pb-2">
          <p className="text-[9px] font-black uppercase tracking-[.14em] text-amber-700">
            Rótulo
          </p>
          <Bone className="h-4 w-4 text-amber-600" aria-hidden="true" />
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-1.5">
          {fields.map((field, i) => (
            <li
              key={field}
              className="rounded-lg border border-petrol/8 bg-white/80 px-2.5 py-1.5"
            >
              <p className="text-[8px] font-black uppercase tracking-[.14em] text-petrol/45">
                leia: {i + 1}
              </p>
              <p className="text-[11px] font-bold leading-tight text-petrol">{field}</p>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-2 text-[9px] font-bold uppercase tracking-wide text-petrol/40">
        Leia o rótulo como um conjunto de informações
      </p>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 28. annual-calendar
// ---------------------------------------------------------------------------

function AnnualCalendarRenderer({ placement, className }: RendererProps) {
  const themes: string[] = ANNUAL_THEMES[placement.id] ?? [];
  const themeColors = [
    "#10b981",
    "#f5a623",
    "#2ea3a0",
    "#153847",
    "#f59e0b",
    "#84cc16",
    "#0ea5e9",
    "#f97316",
  ];
  return (
    <Figure placement={placement} icon={Calendar} className={className}>
      <ul className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
        {MONTHS_PT.map((month) => (
          <li key={month} className="rounded-lg border border-petrol/8 bg-white/70 p-1.5">
            <p className="text-center text-[9px] font-black uppercase tracking-wide text-petrol/60">
              {month}
            </p>
            <div className="mt-1 flex h-6 flex-col justify-end gap-0.5" aria-hidden="true">
              <span className="h-1 rounded-sm bg-petrol/15" />
              <span className="h-1 rounded-sm bg-petrol/10" />
            </div>
          </li>
        ))}
      </ul>
      {themes.length ? (
        <div className="mt-3">
          <p className="text-[9px] font-black uppercase tracking-[.14em] text-emerald-700">
            Temas de acompanhamento
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {themes.map((theme, i) => (
              <li
                key={theme}
                className="inline-flex items-center gap-1.5 rounded-full border border-petrol/8 bg-white/70 px-2.5 py-1 text-[10px] font-bold text-petrol"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: themeColors[i % themeColors.length] }}
                  aria-hidden="true"
                />
                {theme}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 29. tracker
// ---------------------------------------------------------------------------

function TrackerRenderer({ placement, className }: RendererProps) {
  const rows: string[] =
    TRACKER_ROWS[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  const dayCols = 7;
  return (
    <Figure placement={placement} icon={ClipboardList} className={className} decorative={false}>
      <div className="overflow-hidden rounded-2xl border border-petrol/8">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="bg-petrol/[.04] px-3 py-2 text-[9px] font-black uppercase tracking-[.14em] text-petrol/55">
                Categoria
              </th>
              {Array.from({ length: dayCols }, (_, i) => (
                <th
                  key={i}
                  className="bg-petrol/[.04] px-1 py-2 text-center text-[9px] font-black uppercase tracking-wide text-petrol/40"
                >
                  D{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row} className="border-t border-petrol/8">
                <th
                  scope="row"
                  className="bg-white/60 px-3 py-2 text-[11px] font-bold text-petrol"
                >
                  {row}
                </th>
                {Array.from({ length: dayCols }, (_, j) => (
                  <td key={j} className="px-1 py-2 text-center" aria-hidden="true">
                    <span
                      className={cn(
                        "mx-auto block h-3 w-3 rounded-sm border",
                        (i + j) % 3 === 0
                          ? "border-emerald-300 bg-emerald-100"
                          : "border-petrol/10 bg-white/40",
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[9px] font-bold uppercase tracking-wide text-petrol/40">
        Marque cada dia conforme observa — sem inventar registros
      </p>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 30. observation-board
// ---------------------------------------------------------------------------

function ObservationBoardRenderer({ placement, className }: RendererProps) {
  const columns: string[] =
    OBSERVATION_COLUMNS[placement.id] ??
    placement.alt
      .split(/,|\s+e\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  const rows = 3;
  return (
    <Figure placement={placement} icon={Activity} className={className} decorative={false}>
      <div className="overflow-hidden rounded-2xl border border-petrol/8">
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
        >
          {columns.map((col) => (
            <div
              key={col}
              className="border-b border-petrol/10 bg-petrol/[.04] px-2 py-2 text-center text-[9px] font-black uppercase tracking-[.12em] text-petrol/65"
            >
              {col}
            </div>
          ))}
          {Array.from({ length: rows * columns.length }, (_, i) => (
            <div
              key={i}
              className="border-b border-l border-petrol/5 bg-white/40 px-2 py-3"
              aria-hidden="true"
            >
              <span className="block h-2 w-full rounded-sm bg-petrol/8" />
              <span className="mt-1 block h-2 w-2/3 rounded-sm bg-petrol/5" />
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2 text-[9px] font-bold uppercase tracking-wide text-petrol/40">
        Preencha após a saída — dados objetivos, sem interpretação antecipada
      </p>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 31. photo-grid
// ---------------------------------------------------------------------------

function PhotoGridRenderer({ placement, className }: RendererProps) {
  const tiles = Array.from({ length: 6 }, (_, i) => i);
  return (
    <Figure placement={placement} icon={Images} className={className}>
      <ul className="grid grid-cols-3 gap-1.5">
        {tiles.map((i) => (
          <li
            key={i}
            className="flex aspect-square items-center justify-center rounded-lg border border-petrol/8"
            style={{ background: "linear-gradient(135deg,#f0fbf4,#fffaf0)" }}
            aria-hidden="true"
          >
            <Images className="h-5 w-5 text-petrol/25" />
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[9px] font-bold uppercase tracking-wide text-petrol/40">
        Mosaico editorial — grupos funcionais diferentes
      </p>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// 32. route-cards
// ---------------------------------------------------------------------------

function RouteCardsRenderer({ placement, className }: RendererProps) {
  const cards: string[] = ROUTE_CARDS[placement.id] ?? ["Normal", "Curta", "Fuga"];
  const colors = ["#10b981", "#f5a623", "#153847"] as const;
  return (
    <Figure placement={placement} icon={Route} className={className} decorative={false}>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {cards.map((card, i) => (
          <li
            key={card}
            className="rounded-2xl border border-petrol/8 bg-white/70 p-3"
          >
            <div className="flex items-center gap-2">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                style={{ backgroundColor: colors[i] }}
                aria-hidden="true"
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-[9px] font-black uppercase tracking-[.14em] text-petrol/45">
                Rota {String.fromCharCode(65 + i)}
              </span>
            </div>
            <p className="mt-2 text-sm font-black text-petrol">{card}</p>
            <div className="mt-2 flex items-center gap-1" aria-hidden="true">
              <span
                className="h-1 flex-1 rounded-full"
                style={{ backgroundColor: colors[i] }}
              />
              <Route className="h-3 w-3" style={{ color: colors[i] }} />
              <span
                className="h-1 flex-1 rounded-full"
                style={{ backgroundColor: colors[i] }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[9px] font-bold uppercase tracking-wide text-petrol/40">
        Tenha alternativas prontas para reduzir improviso diante de gatilhos
      </p>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// Premium summary fallback (for unknown / data-less render families)
// ---------------------------------------------------------------------------

function SummaryRenderer({ placement, className }: RendererProps) {
  const Icon = FAMILY_ICONS[placement.render ?? ""] ?? Sparkles;
  return (
    <Figure placement={placement} icon={Icon} className={className}>
      <svg
        viewBox="0 0 240 70"
        className="h-16 w-full"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="30" cy="35" r="14" fill="#2ea3a0" fillOpacity="0.18" />
        <circle cx="60" cy="20" r="9" fill="#f5a623" fillOpacity="0.18" />
        <circle cx="90" cy="45" r="11" fill="#10b981" fillOpacity="0.18" />
        <circle cx="130" cy="25" r="7" fill="#153847" fillOpacity="0.18" />
        <circle cx="170" cy="40" r="13" fill="#f5a623" fillOpacity="0.18" />
        <circle cx="210" cy="20" r="9" fill="#2ea3a0" fillOpacity="0.18" />
        <line x1="20" y1="55" x2="220" y2="55" stroke="#153847" strokeWidth="0.6" strokeDasharray="3 3" />
      </svg>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

const RENDERERS: Record<string, (props: RendererProps) => React.ReactElement> = {
  "traffic-light": TrafficLightRenderer,
  timeline: TimelineRenderer,
  "day-grid": DayGridRenderer,
  "week-grid": WeekGridRenderer,
  "weekly-grid": WeeklyGridRenderer,
  process: ProcessRenderer,
  staircase: StaircaseRenderer,
  matrix: MatrixRenderer,
  "room-checklist": RoomChecklistRenderer,
  floorplan: FloorplanRenderer,
  "trigger-map": TriggerMapRenderer,
  "distance-diagram": DistanceDiagramRenderer,
  "body-map": BodyMapRenderer,
  "annotated-body": AnnotatedBodyRenderer,
  "silhouette-guide": SilhouetteGuideRenderer,
  "warning-grid": WarningGridRenderer,
  "step-cards": StepCardsRenderer,
  "child-poster": ChildPosterRenderer,
  "child-card": ChildCardRenderer,
  "room-diagram": RoomDiagramRenderer,
  "category-wheel": CategoryWheelRenderer,
  slider: SliderRenderer,
  "checklist-card": ChecklistCardRenderer,
  "comparison-matrix": ComparisonMatrixRenderer,
  "decision-tree": DecisionTreeRenderer,
  "annotated-card": AnnotatedCardRenderer,
  "annotated-label": AnnotatedLabelRenderer,
  "annual-calendar": AnnualCalendarRenderer,
  tracker: TrackerRenderer,
  "observation-board": ObservationBoardRenderer,
  "photo-grid": PhotoGridRenderer,
  "route-cards": RouteCardsRenderer,
};

export function OriginalVisual({ placement, className }: RendererProps) {
  const Renderer = RENDERERS[placement.render ?? ""] ?? SummaryRenderer;
  return <Renderer placement={placement} className={className} />;
}

// Re-export visualLabel for any caller that still needs it (extended map).
export function visualLabel(render?: string): string {
  return (render && VISUAL_LABELS[render]) || "Visual MyPets";
}

// Re-export family icon for any caller that needs the badge icon.
export function visualFamilyIcon(render?: string): LucideIcon {
  return (render && FAMILY_ICONS[render]) || Sparkles;
}
