# MyPets — Overnight Growth Sprint Handoff
**Data:** 24/09/2026

## Estado executivo

O pacote de aquisição está implementado e preparado para produção, mas o frontend permanece deliberadamente fora de `main` até o backend atualizado ser efetivamente reconstruído na VPS e provar o readiness da base.

### Backend
- Growth analytics + landing attribution: merged em `main`
- Merge SHA: `1a07d123af373cbb1b9da9dd38654f8d03018d43`
- Deploy guardado: `deploy/growth-performance-v18.sh`

### Frontend
- PR: #31
- Branch: `feat/project-intake-petskids-campaign`
- Páginas principais:
  - `/ajudar`
  - `/ajudar/petskids`
  - `/projetos/apresentar`
  - `/admin/growth`
- Share redirects:
  - `/go/ajudar`
  - `/go/petskids`

## Rollout obrigatório

### 1. VPS — backend

Executar como root:

```bash
cd /srv/apps/mypets/api
bash deploy/growth-performance-v18.sh
```

O script:
- fast-forward de `main`;
- aplica a migration de landing attribution;
- valida a função SQL;
- rebuild/recreate do `mypets-api`;
- aguarda health;
- valida API pública e config;
- prova `cause-intake/readiness`;
- garante que `PAYMENTS_LIVE` e `PAYOUTS_ENABLED` não mudaram.

Só continuar se terminar com:

```text
MyPets Growth v18 deployed and verified.
Cause intake readiness: OK
Growth landing attribution: OK
```

### 2. Frontend

Após backend saudável:
- confirmar PR #31 CI = success;
- confirmar Vercel preview = Ready;
- merge PR #31 para `main`;
- aguardar Vercel production;
- production smoke deve passar.

## Smoke financeiro obrigatório antes de tráfego pago

Fazer um apoio real de valor mínimo em:

`https://mypets.lat/ajudar?utm_source=internal&utm_medium=smoke&utm_campaign=launch_validation&utm_content=real_pix`

Confirmar a sequência:

`LANDING_VIEW → SUPPORT_STARTED → DONATION_STARTED → DONATION_COMPLETED`

Validar:
- QR Pix;
- Copia e Cola;
- CPF/titular;
- status final SUCCEEDED;
- confirmação visual;
- botão de partilha pós-doação;
- SHARE_CLICK;
- `/admin/growth` mostra a conversão e a landing correta.

## Primeiros links de distribuição

### Meta — institucional
`https://mypets.lat/ajudar?utm_source=meta&utm_medium=paid_social&utm_campaign=mypets_survival_br&utm_content=myp_surv_01`

### Meta — PetsKids
`https://mypets.lat/ajudar/petskids?utm_source=meta&utm_medium=paid_social&utm_campaign=petskids_story_br&utm_content=pk_story_01`

### Instagram orgânico
`https://mypets.lat/go/ajudar?utm_source=instagram&utm_medium=organic_social&utm_campaign=mypets_support`

### WhatsApp — PetsKids
`https://mypets.lat/go/petskids?utm_source=whatsapp&utm_medium=referral&utm_campaign=petskids_story`

## Primeira bateria de criativos

Usar quatro peças inicialmente:
1. `MYP-SURV-01`
2. `MYP-POV-01`
3. `PK-STORY-01`
4. `PK-GESTO-01`

Scripts completos: `docs/paid-social-creative-matrix.md`

## Regra de leitura dos dados

Prioridade:
1. DONATION_COMPLETED
2. valor confirmado
3. custo por DONATION_COMPLETED
4. DONATION_STARTED
5. SUPPORT_STARTED
6. LANDING_VIEW
7. CTR

Não escolher vencedor apenas por CTR.

## PetsKids

O PetsKids permanece projeto em integração:
- menores não são beneficiários financeiros diretos;
- não expor dados pessoais;
- apoio desta landing é institucional para MyPets;
- próximo marco: responsável adulto verificado;
- depois: fundo dedicado/earmarked, caso aprovado;
- transparência futura: compras, recibos, entregas e atualizações.

## Material complementar
- `docs/growth-launch-playbook.md`
- `docs/paid-social-creative-matrix.md`

## Bloqueios conhecidos

1. A sessão de desenvolvimento atual não possui acesso SSH à VPS.
2. O conector Vercel não está autorizado ao scope da equipa, embora o status de deployment seja obtido via GitHub.
3. Não iniciar mídia paga antes do teste Pix real confirmado de ponta a ponta.


## Adições do último sprint

Antes do rollout final, o frontend recebeu mais três melhorias de conversão/operação:

1. **Outro valor no card principal de apoio**
   - o utilizador pode escolher R$20 / R$50 / R$100 / R$200 ou introduzir outro valor sem abrir primeiro o modal;
   - o valor escolhido segue diretamente para o checkout.

2. **Launch readiness no Growth Admin**
   - mostra ambiente, PAYMENTS_LIVE, BRL, PIX S2S, modo de finalidade e cause intake;
   - alerta visual quando BRL está em modo degradado;
   - reduz o risco de ligar tráfego pago com a lane financeira incompleta.

3. **Diagnóstico automático do funil**
   - compara Landing → Checkout, Checkout → Pix e Pix → Confirmado;
   - identifica o pior estágio observado na janela atual;
   - sugere a classe de problema a investigar sem usar benchmarks externos.

4. **Export CSV**
   - o breakdown por source / medium / campaign / creative / landing pode ser exportado diretamente em `/admin/growth`.

## Tracking e distribuição

O funil final está estruturado para:

`LANDING_VIEW → SUPPORT_STARTED → DONATION_STARTED → DONATION_COMPLETED → SHARE_CLICK`

As duas landings preservam UTM e `landingPath` até ao payment intent e aos eventos server-side.

## Issue operacional

O rollout da VPS está formalizado em:

- backend issue **#20 — PROD rollout — MyPets Growth v18 + unlock frontend #31**

Este é o único bloqueio operacional conhecido para promover o pacote completo para produção.
