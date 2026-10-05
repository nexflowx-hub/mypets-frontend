# MyPets Digital Library — Architecture v1

**Status:** foundation proposal  
**Priority:** MyPets Digital Library  
**Branch:** feat/digital-library-foundation

## Decision

Use a two-layer operating model:

1. **Google Drive = editorial workspace**
   - research notes
   - source collection
   - drafting and comments
   - human editorial / technical review
   - PDF review copies
   - release approval

2. **GitHub = publishing source of truth**
   - structured MDX/Markdown
   - versioned metadata
   - release manifests
   - source ledger
   - web reader integration
   - PDF build inputs

Do not introduce Notion as a third editorial source of truth in v1. It may be added later only for portfolio/project management if needed.

## Repository strategy

For speed, MyPets v1 can consume content from this repository while the library is small.

Target structure:

```
content/
  library/
    manifest.ts
    pt-BR/
      cuidados-essenciais/
        meta.yaml
        00-introducao.mdx
        01-rotina.mdx
        ...
        sources.yaml
      primeiro-filhote/
      treino-gentil/
      guia-das-racas/
      alimentacao-bem-estar/
  shared/
    glossary/
    disclaimers/
    components/
```

The structure must remain portable so it can later be extracted to a dedicated `mypets-content` repository without rewriting the reader.

A separate content repository becomes the preferred architecture when either:
- FacePets becomes a second production consumer;
- editorial contributors grow beyond the core team;
- content releases need an independent deployment cadence;
- multilingual output becomes substantial.

## Runtime responsibilities

### GitHub content
Stores:
- MDX/Markdown text
- structured metadata
- references
- release/version information
- content policy metadata

Does not store:
- payment records
- user progress
- entitlements
- private customer data
- large distribution PDFs/media

### Supabase / backend
Stores:
- products
- releases
- purchases/contributions
- entitlements
- reading progress
- completed checklists
- bookmarks/favorites
- download/audit events

### Private object storage
Stores:
- final PDFs
- downloadable worksheets
- large media
- generated exports

Distribution files are released by entitlement + signed URL. GitHub is not customer-delivery storage.

## URL model

Public:
- `/biblioteca`
- `/biblioteca/[slug]`
- `/biblioteca/[slug]/preview`
- public SEO excerpts where editorially appropriate

Entitled:
- `/minha-biblioteca`
- `/biblioteca/[slug]/ler/[chapter]`
- PDF/download actions
- saved progress/checklists

## Reader experience

Each guide should support:
- responsive mobile-first reading
- navigable table of contents
- reading progress
- chapter completion
- practical checklists
- callout boxes
- tables and illustrations
- related content
- references
- discreet campaign impact CTA
- downloadable PDF when entitled

## One content base, multiple outputs

Author once, publish as:
- MyPets web reader
- PDF/eBook
- SEO excerpts
- email/social excerpts
- future safe AI retrieval corpus

Avoid manually maintaining separate prose versions for web and PDF.

## Editorial workflow

`RESEARCH -> DRAFT -> TECHNICAL REVIEW -> EDITORIAL QA -> RELEASE CANDIDATE -> PUBLISHED`

Every published release must have:
- version
- release date
- source review date
- reviewer status
- checksum for generated PDF
- changelog
- no silent replacement of published release assets

## Initial collection

1. Cuidados Essenciais com o Seu Cão
2. Os Primeiros 30 Dias com um Filhote
3. Treino Gentil
4. Guia das Raças
5. Rotina de Alimentação e Bem-Estar

Target editorial depth:
- minimum ~5,000 useful words for standard guides
- ~7,000–10,000+ for flagship guides where the topic supports it
- visual breathing room rather than artificial page count
- practical worksheets/checklists integrated into the content

## FacePets future compatibility

The content model should be AI-ready from day one, but FacePets AI is not a blocker for MyPets Library v1.

Every content unit should be classifiable for future retrieval:
- audience
- topic
- age relevance
- medical-risk level
- AI-use permission
- child-safe flag
- source confidence
- last reviewed date

FacePets conversational layers may later consume only content explicitly marked as safe for:
- companionship
- play
- education
- routine pet-care guidance

They must not turn general content into diagnosis, treatment, medication or emergency veterinary advice.

## v1 non-goals

Do not:
- build a full CMS before the library exists;
- duplicate content manually across systems;
- use Notion + Drive + GitHub as three equal masters;
- store long-form editorial content primarily in the database;
- make PDF the only reading experience;
- let AI-generated prose bypass source review.

## Immediate implementation sequence

1. approve content standard;
2. expand Guide 01 to the new standard;
3. convert Guide 01 to MDX structure;
4. build the web reader around it;
5. connect entitlement/progress;
6. generate PDF from the same canonical content;
7. repeat for Guides 02–05;
8. launch `/biblioteca` and `/minha-biblioteca`;
9. only then expand the catalogue and FacePets AI consumption.
