# MyPets — Growth Launch Playbook

## Objetivo

Transformar tráfego de anúncios, redes sociais e partilhas em apoios financeiros confirmados pelo backend, preservando confiança, atribuição e separação entre apoio institucional MyPets e causas/projetos específicos.

## Landings de aquisição

### Variante A — institucional
- URL pública: `https://mypets.lat/ajudar`
- Share curto: `https://mypets.lat/go/ajudar`
- Ângulo: "Ajude o MyPets a continuar vivo"
- Beneficiário financeiro: MyPets
- Evento de landing: `LANDING_VIEW`
- Evento de intenção: `SUPPORT_STARTED`

### Variante B — story-led PetsKids
- URL pública: `https://mypets.lat/ajudar/petskids`
- Share curto: `https://mypets.lat/go/petskids`
- Ângulo: duas crianças + alimentação comunitária
- Beneficiário financeiro: MyPets
- PetsKids é apresentado como projeto em integração; não existe payout direto para menores.
- Evento de landing: `LANDING_VIEW`
- Evento de intenção: `SUPPORT_STARTED`

## Funil medido

`LANDING_VIEW → SUPPORT_STARTED → DONATION_STARTED → DONATION_COMPLETED → SHARE_CLICK`

- `LANDING_VIEW`: carregamento da landing.
- `SUPPORT_STARTED`: abertura do checkout.
- `DONATION_STARTED`: intent financeiro passou para PENDING.
- `DONATION_COMPLETED`: backend confirmou SUCCEEDED.
- `SHARE_CLICK`: apoiador partilhou após confirmação.

A conversão principal é `DONATION_COMPLETED / LANDING_VIEW`. Nunca otimizar criativos somente por CTR.

## Convenção UTM

### Meta Ads — institucional
`https://mypets.lat/ajudar?utm_source=meta&utm_medium=paid_social&utm_campaign=mypets_survival_br&utm_content={{creative_name}}`

### Meta Ads — PetsKids
`https://mypets.lat/ajudar/petskids?utm_source=meta&utm_medium=paid_social&utm_campaign=petskids_story_br&utm_content={{creative_name}}`

### Instagram orgânico
`https://mypets.lat/go/ajudar?utm_source=instagram&utm_medium=organic_social&utm_campaign=mypets_support`

### Instagram / Reels PetsKids
`https://mypets.lat/go/petskids?utm_source=instagram&utm_medium=organic_social&utm_campaign=petskids_story`

### WhatsApp
Os redirects `/go/ajudar` e `/go/petskids` aplicam defaults de `source=share`, `medium=referral` e campanha quando não existirem parâmetros explícitos.

## Matriz inicial de criativos

### A1 — Sobrevivência
Hook: "Sem estrutura, boas causas desaparecem antes de serem encontradas."
Destino: `/ajudar`

### A2 — Animal
Hook: "Eles não conseguem pedir ajuda. Nós conseguimos chegar até eles."
Destino: `/ajudar`

### B1 — PetsKids
Hook: "Duas crianças começaram com sacos de ração."
Destino: `/ajudar/petskids`

### B2 — Pequenos gestos
Hook: "Uma compra no comércio do bairro pode virar comida na rua."
Destino: `/ajudar/petskids`

Cada criativo deve ter um `utm_content` único.

## Regras de decisão

1. Confirmar primeiro que `DONATION_COMPLETED` está sendo registrado.
2. Comparar criativos por custo por `DONATION_COMPLETED`, taxa de conclusão e valor médio confirmado.
3. Se uma variante gerar muitos `SUPPORT_STARTED` e poucos `DONATION_STARTED`, investigar fricção no formulário/CPF.
4. Se gerar `DONATION_STARTED` mas poucos `DONATION_COMPLETED`, investigar provider/reconciliação antes de culpar o anúncio.
5. Se `LANDING_VIEW → SUPPORT_STARTED` for fraco, trabalhar hero, prova, valor pré-selecionado e CTA.
6. Escalar somente criativos cujo desempenho financeiro se mantém após volume suficiente; não tomar decisões por CTR isolado.

## Checklist de produção antes de mídia paga

- [ ] `https://api.mypets.lat/health` saudável.
- [ ] `POST /v1/cause-intake/readiness` retorna `ready`, `databaseRoundTrip=true`, `rolledBack=true`.
- [ ] `/ajudar` HTTP 2xx/3xx e conteúdo correto.
- [ ] `/ajudar/petskids` HTTP 2xx/3xx e conteúdo correto.
- [ ] Open Graph de ambas as páginas retorna imagem válida.
- [ ] `PAYMENTS_LIVE=true` e BRL disponível no `/v1/config`.
- [ ] PIX real criado no fundo MyPets geral.
- [ ] Um PIX mínimo real confirmado até `SUCCEEDED`.
- [ ] `DONATION_COMPLETED` aparece em `growth_events`.
- [ ] UTM chega a `payment_intents` / eventos.
- [ ] Teste mobile Android/iOS: hero, presets, modal, CPF, QR, copia-e-cola, confirmação.
- [ ] Página de obrigado permite partilha e gera `SHARE_CLICK`.

## Não publicar

- números de animais, projetos ou apoiadores sem fonte auditável;
- testemunhos inventados;
- equivalências monetárias ("R$20 alimenta X animais") sem custo documentado;
- linguagem que diga que o apoio institucional MyPets é automaticamente uma doação direta ao PetsKids;
- dados pessoais de crianças ou payout direto para menores.
