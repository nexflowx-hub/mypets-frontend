# MyPets — Growth Playbook — 1 eBook = 1 kg de Ração

## Oferta

Promessa central:

> Escolha um guia. Coloque 1 kg de ração numa tigela.

Unidade:
- R$ 12,90 = 1 eBook digital = 1 kg de ração a financiar.
- 3 eBooks = R$ 38,70 = 3 kg.
- coleção de 5 = R$ 64,50 = 5 kg.
- o compromisso é por peso, não por um preço varejista fixo.
- participações confirmadas preservam os kg prometidos; mudanças de custo afetam apenas novas participações.

Beneficiário financeiro: MyPets.
Recompensa: conteúdo digital educativo.
Fundo: EBOOK_RACAO.

## Hipótese de conversão

Esta oferta reduz três objeções clássicas de captação:
1. “O meu valor é pequeno demais?” — não: R$ 12,90 tem uma unidade concreta.
2. “Para onde vai?” — a promessa é 1 kg, com fundo próprio e confirmação financeira.
3. “O que recebo além de ajudar?” — um guia digital útil e imediatamente consumível.

O eBook não deve ser tratado como argumento principal de preço. O produto emocional é o kg; o eBook é a recompensa que reduz a sensação de transação unilateral e aumenta a partilhabilidade.

## Funil

### Etapa 0 — anúncio
Um anúncio = uma promessa. Não explicar a plataforma inteira.

Ângulos iniciais:
- ER-1KG-01: “R$ 12,90. Um guia para você. 1 kg de ração para colocar em movimento.”
- ER-TIGELA-01: tigela vazia → ração → capa do eBook.
- ER-GUIA-01: “Qual destes guias você escolheria se cada um financiasse 1 kg?”
- ER-PETSKIDS-01: contexto de alimentação comunitária sem expor dados de menores.

### Etapa 1 — microcompromisso
Pergunta única: “Qual guia seria mais útil para si hoje?”

Objetivo: gerar escolha antes do pedido financeiro.
Não pedir nome, email ou telefone nesta etapa.

### Etapa 2 — impacto
Mostrar:
- 1 eBook / 1 kg / R$ 12,90
- 3 eBooks / 3 kg / R$ 38,70
- 5 eBooks / 5 kg / R$ 64,50

O bundle altera primeiro o impacto e depois permite personalizar quais eBooks serão recebidos.

### Etapa 3 — Pix
Resumo obrigatório:
- quantidade de eBooks
- kg financiados
- valor
- como o kg é contabilizado

Só então pedir os dados mínimos exigidos para Pix.

### Etapa 4 — confirmação
QR Code não é conversão.
A conversão só ocorre em DONATION_COMPLETED / SUCCEEDED.

### Etapa 5 — recompensa + viral loop
Depois de SUCCEEDED:
- “Você colocou X kg em movimento.”
- abrir a coleção digital
- partilhar
- link individual quando autenticado
- CTA discreto para financiar +1 kg novamente

## Hierarquia da landing

Acima da dobra:
1. badge “1 eBook = 1 kg”
2. headline concreta
3. R$ 12,90 = 1 kg
4. funil interativo
5. Pix + confirmação backend + fundo dedicado

Não colocar:
- menu principal completo
- carrosséis
- números de impacto não comprovados
- testemunhos inventados
- vários CTAs concorrentes

Depois da dobra:
1. catálogo dos cinco guias
2. explicação do mecanismo financeiro
3. prova documental quando existir
4. partilha
5. FAQ
6. CTA final

## O que testar

Teste uma variável por vez.

### Hero
A:
“Escolha um guia. Coloque 1 kg de ração numa tigela.”

B:
“R$ 12,90 vira 1 kg de ração — e você ainda recebe um guia.”

C:
“Seu próximo eBook pode alimentar um cão.”

### Primeiro bundle
A: 1 kg pré-selecionado.
B: 3 kg pré-selecionado.
Não chamar um bundle de “mais escolhido” antes de existir dado real.

### Ordem
A: pergunta → bundle → Pix.
B: bundle → escolha de tema → Pix.

### Criativo
Separar vídeo, estático e UGC pela mesma campaign/content convention.
Nunca escolher vencedor só por CTR.

## Métricas

Prioridade:
1. DONATION_COMPLETED
2. kg confirmados
3. valor confirmado
4. custo por DONATION_COMPLETED
5. DONATION_STARTED
6. SUPPORT_STARTED
7. LANDING_VIEW
8. SHARE_CLICK
9. CTR

Diagnóstico:
- LANDING_VIEW → SUPPORT_STARTED ruim: promessa, hero, criativo, confiança.
- SUPPORT_STARTED → DONATION_STARTED ruim: formulário, CPF, fricção, preço.
- DONATION_STARTED → DONATION_COMPLETED ruim: QR, Pix, provider, reconciliação.
- boa conversão + ticket baixo: testar 3 kg sem esconder 1 kg.
- boa arrecadação + partilha baixa: melhorar pós-confirmação e mensagem social.

## Prova de impacto

Não inventar contador.

Quando houver dados:
- kg financiados = unidades de pagamentos confirmados.
- kg adquiridos = peso dos comprovantes de compra associados à campanha.
- kg entregues = peso com evidência de distribuição/entrega.
- diferença em aberto deve permanecer visível.

Modelo futuro:
“427 kg financiados · 310 kg comprados · 280 kg entregues”

Só publicar depois de existir fonte documental.

## eBooks

Release inicial:
1. Cuidados Essenciais com o Seu Cão
2. Os Primeiros 30 Dias com um Filhote
3. Treino Gentil
4. Guia das Raças
5. Alimentação & Rotina

Os PDFs finais ficam separados dos componentes web. A versão web serve consumo imediato; o PDF final é o artefacto editorial distribuível.

## Segurança de marca

- não afirmar benefício fiscal sem prova jurídica.
- não tentar transformar a natureza jurídica da transação apenas pelo nome “participação”.
- deixar claro que o beneficiário financeiro é o MyPets.
- menores do PetsKids não são beneficiários financeiros e não devem ter PII publicada.
- conteúdo veterinário é educativo, não substitui avaliação profissional.

## Rollout

1. backend: EBOOK_RACAO migration + unit enforcement.
2. VPS: deploy/ebook-racao-v19.sh.
3. frontend PR #31 em produção.
4. frontend eBook branch rebase/merge depois do backend.
5. teste real de R$ 12,90:
   LANDING_VIEW → SUPPORT_STARTED → DONATION_STARTED → DONATION_COMPLETED.
6. confirmar no Growth Admin:
   - campanha/UTM
   - landing /ajudar/ebooks
   - R$ 12,90
   - 1 kg
7. só depois iniciar mídia paga.
