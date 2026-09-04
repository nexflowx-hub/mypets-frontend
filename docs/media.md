# Media

## Provenance model
Every media asset carries metadata (`media_assets` table / `public/media/demo-manifest.json`):

```
id, type, source_type: REAL_CASE | LICENSED_STOCK | AI_GENERATED,
source_name, source_url, creator_name, license_name, license_url,
downloaded_at, uploaded_at, uploaded_by, alt_text, caption,
country, locale, width, height, file_size, mime_type, storage_path,
focal_x, focal_y, is_demo
```

## Current status
All shipped images are **AI_GENERATED placeholders** (`is_demo`), art-directed with the
master prompt photography language (documentary, 35mm, natural light, no advertising pose,
no text/logos). They must be replaced by real/licensed photography before production
(`replacement_required: true` in the manifest). AI images are never presented as real
rescues, treatments or verified beneficiaries.

## Storage targets (Supabase)
`public-pets`, `public-protectors`, `public-campaigns` (public read, signed upload);
`private-verification`, `private-finance` (service-role only); `avatars`, `generated-assets`.
Uploads: MIME allow-list `image/jpeg|png|webp`, size limits, client never touches
service-role keys.

## Reference prompts used (for regeneration)
- **Hero** — hyper-realistic documentary photograph, female protector feeding two rescued
  dogs, urban PT/BR street, subject right, dark negative space left, 35mm, no text/logos.
- **FacePets** — intimate close-up rescued cat portrait, dark background, no collar branding.
- **Cards** — rescue/feed/treat/foster documentary scenes (4:3).
- **Stories** — Ana (Porto, cats, azulejos alley), Carlos (São Paulo community dogs),
  Luna (recovering, light bandage, no graphic injury), Milo (rescued terrier portrait).
