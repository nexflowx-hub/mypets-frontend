# MyPets — Paid Social Creative Matrix

## Princípio

O anúncio não deve tentar explicar todo o MyPets. Cada criativo vende uma única próxima ação: abrir a landing e decidir se quer apoiar. A landing faz o restante trabalho de confiança, contexto e pagamento.

## Formato-base

- vertical 9:16 como peça principal;
- versões 1:1 e 4:5 derivadas do mesmo master;
- 8–15 s para hooks rápidos;
- 20–35 s para storytelling;
- legendas queimadas no vídeo;
- marca MyPets presente, mas não ocupando o primeiro segundo;
- primeira imagem precisa funcionar mesmo sem áudio;
- CTA final claro: "Conheça e ajude" ou "Ajude o MyPets a continuar vivo".

## Criativos institucionais

### MYP-SURV-01 — Continuar vivo

**Hook visual:** close de um animal olhando para a câmera.

**Texto inicial:**  
"Boas causas também desaparecem quando ninguém as encontra."

**Corpo:**  
"O MyPets está construindo a estrutura que encontra projetos, organiza histórias, verifica responsáveis e conecta quem precisa a quem quer ajudar."

**Fecho:**  
"Ajude o MyPets a continuar vivo."

**Destino:**  
`/ajudar?utm_source=meta&utm_medium=paid_social&utm_campaign=mypets_survival_br&utm_content=myp_surv_01`

---

### MYP-POV-01 — Eles não conseguem pedir

**Hook:**  
"Eles não conseguem pedir ajuda."

Corte para ações de alimentação / cuidado.

**Virada:**  
"Mas nós conseguimos chegar até eles."

**Fecho:**  
"Ajude o MyPets a encontrar mais histórias reais."

**Destino:**  
`/ajudar?utm_source=meta&utm_medium=paid_social&utm_campaign=mypets_survival_br&utm_content=myp_pov_01`

---

### MYP-INFRA-01 — O que existe por trás

**Hook:**  
"Uma doação não começa no QR Code."

**Corpo visual:**  
projeto → verificação → página → checkout → confirmação.

**Texto:**  
"Antes do apoio, existe trabalho: encontrar, organizar, verificar, publicar e acompanhar."

**Fecho:**  
"Ajude a manter essa estrutura de pé."

**Destino:**  
`/ajudar?utm_source=meta&utm_medium=paid_social&utm_campaign=mypets_transparency_br&utm_content=myp_infra_01`

## Criativos PetsKids

### PK-STORY-01 — Sacos de ração

**Hook:**  
"Duas crianças começaram com sacos de ração."

**Corpo:**  
"Compram alimento no comércio do bairro e distribuem para cães em situação de rua na própria comunidade."

**Virada:**  
"O MyPets quer ajudar essa história a ganhar estrutura e continuidade."

**Fecho:**  
"Conheça o PetsKids."

**Destino:**  
`/ajudar/petskids?utm_source=meta&utm_medium=paid_social&utm_campaign=petskids_story_br&utm_content=pk_story_01`

**Vigilância:** nunca sugerir que o pagamento vai diretamente para as crianças.

---

### PK-GESTO-01 — Um gesto pequeno

**Hook:**  
"Para quem está com fome, uma pequena compra pode ser enorme."

**Corpo:**  
"Foi assim que o PetsKids começou: ração comprada no bairro e entregue onde há cães precisando."

**Fecho:**  
"Ajude o MyPets a dar estrutura a histórias como esta."

**Destino:**  
`/ajudar/petskids?utm_source=meta&utm_medium=paid_social&utm_campaign=petskids_story_br&utm_content=pk_gesto_01`

---

### PK-COMUNIDADE-01 — No próprio bairro

**Hook:**  
"Não esperaram uma grande ONG aparecer."

**Corpo:**  
"Começaram onde estavam, com o que podiam fazer."

**Fecho:**  
"Pequenas iniciativas podem crescer quando encontram uma comunidade."

**Destino:**  
`/ajudar/petskids?utm_source=meta&utm_medium=paid_social&utm_campaign=petskids_story_br&utm_content=pk_comunidade_01`

## Copy para anúncio

### Institucional — curta

**Primary text:**  
Há pessoas e pequenos projetos ajudando animais todos os dias, mas muitos nunca chegam até quem gostaria de apoiar. O MyPets está construindo essa ponte. Conheça a campanha.

**Headline:**  
Ajude o MyPets a continuar vivo

**CTA:**  
Saiba mais / Apoiar

### PetsKids — curta

**Primary text:**  
Duas crianças do Centro-Oeste transformaram uma atitude simples em cuidado real: comprar ração no bairro e alimentar cães em situação de rua. O MyPets está integrando o PetsKids com proteção, organização e transparência.

**Headline:**  
Uma pequena iniciativa pode ir mais longe

**CTA:**  
Conheça a história

### Transparência

**Primary text:**  
No MyPets, gerar um QR Code não é tratado como doação concluída. O pagamento só entra como confirmado depois do estado financeiro validado no backend. Conheça a estrutura que estamos construindo.

**Headline:**  
Transparência antes de promessa

## Sequência de teste

### Lote 1
- MYP-SURV-01
- MYP-POV-01
- PK-STORY-01
- PK-GESTO-01

Objetivo: descobrir se o mercado responde melhor ao argumento institucional ou a uma história concreta.

### Lote 2
Usar o melhor ângulo do lote 1 e testar:
- primeira imagem;
- primeira frase;
- duração;
- CTA;
- imagem/fundo do hero correspondente.

Não mudar cinco variáveis ao mesmo tempo quando o objetivo for aprender.

## Nomenclatura

`<angle>_<format>_<version>`

Exemplos:
- `myp_survival_reel_v01`
- `myp_pov_static_v01`
- `petskids_story_reel_v01`
- `petskids_gesto_story_v02`

O mesmo nome deve entrar em `utm_content`.

## Métrica de verdade

Ordem de leitura:
1. `DONATION_COMPLETED`
2. valor confirmado
3. custo por `DONATION_COMPLETED` quando houver spend importado/comparado
4. `DONATION_STARTED`
5. `SUPPORT_STARTED`
6. `LANDING_VIEW`
7. CTR como diagnóstico do criativo

Um criativo com CTR alto e zero pagamentos confirmados não é automaticamente vencedor.

## Regras editoriais

Nunca publicar:
- número de animais ajudados sem dado auditável;
- testemunho criado para preencher espaço;
- equivalência de R$ para ração/animais sem custo documentado;
- urgência falsa;
- linguagem que diga que o apoio institucional é payout direto ao PetsKids;
- nome completo, telefone, escola, endereço ou outros dados de menores.

## Assets que ainda elevariam a campanha

Para PetsKids, priorizar coleta autorizada de:
- mãos colocando ração em recipientes;
- sacos/embalagens de ração comprados;
- cães sendo alimentados;
- fachada ou contexto amplo do bairro sem expor endereço residencial;
- recibos/notas com dados pessoais sensíveis ocultados;
- vídeo vertical curto do responsável adulto explicando o projeto;
- depoimento do responsável, não das crianças, para a parte financeira/operacional.
