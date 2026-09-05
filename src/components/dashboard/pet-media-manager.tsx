"use client";

import * as React from "react";
import { ImagePlus, Loader2, Star, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { authApi } from "@/lib/auth-api";
import { deletePetStorageObject, uploadPetImage } from "@/lib/storage-client";
import type { CorePet, PetMedia } from "@/lib/core-types";

type Envelope<T> = { data: T };

export function PetMediaManager({ pet, onChanged }: { pet: CorePet; onChanged?: () => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [media, setMedia] = React.useState<PetMedia[]>([]);
  const [busy, setBusy] = React.useState("");
  const [error, setError] = React.useState("");

  const load = React.useCallback(async () => {
    try {
      const response = await authApi<Envelope<PetMedia[]>>(`/me/pets/${pet.id}/media`);
      setMedia(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar as fotografias.");
    }
  }, [pet.id]);

  React.useEffect(() => {
    if (open) void load();
  }, [open, load]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy("upload");
    setError("");
    try {
      for (let index = 0; index < Math.min(files.length, 6); index += 1) {
        const file = files.item(index);
        if (!file) continue;
        const uploaded = await uploadPetImage(pet.id, file);
        try {
          await authApi(`/pets/${pet.id}/media`, {
            method: "POST",
            body: JSON.stringify({
              storageBucket: uploaded.bucket,
              storagePath: uploaded.path,
              provenance: "REAL_CASE",
              sortOrder: media.length + index,
              isPublic: true,
              makePrimary: media.length === 0 && index === 0,
            }),
          });
        } catch (err) {
          await deletePetStorageObject(uploaded.path).catch(() => undefined);
          throw err;
        }
      }
      await load();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar a fotografia.");
    } finally {
      setBusy("");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function makePrimary(item: PetMedia) {
    setBusy(`primary:${item.id}`);
    setError("");
    try {
      await authApi(`/pets/${pet.id}/media/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ makePrimary: true }),
      });
      await load();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível alterar a capa.");
    } finally {
      setBusy("");
    }
  }

  async function remove(item: PetMedia) {
    if (!window.confirm("Remover esta fotografia do animal?")) return;
    setBusy(`delete:${item.id}`);
    setError("");
    try {
      const response = await authApi<Envelope<{ storagePath: string | null }>>(`/pets/${pet.id}/media/${item.id}`, { method: "DELETE" });
      if (response.data.storagePath) await deletePetStorageObject(response.data.storagePath).catch(() => undefined);
      await load();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível remover a fotografia.");
    } finally {
      setBusy("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline" className="rounded-xl">
          <ImagePlus className="mr-2 h-4 w-4" /> Fotos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto rounded-3xl bg-white sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-petrol">Fotografias de {pet.name}</DialogTitle>
          <DialogDescription>
            As imagens são otimizadas antes do envio e os metadados EXIF/GPS são removidos. JPG, PNG ou WebP; máximo 10 MB por original.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 rounded-2xl border border-dashed border-coral/35 bg-coral/5 p-5 text-center">
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(event) => void upload(event.target.files)} />
          <UploadCloud className="mx-auto h-8 w-8 text-coral" />
          <p className="mt-2 text-sm font-extrabold text-petrol">Adicione fotos reais do caso</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Até 6 de cada vez. A primeira fotografia torna-se capa quando o animal ainda não tem imagem.</p>
          <Button type="button" disabled={busy === "upload"} onClick={() => inputRef.current?.click()} className="mt-4 rounded-xl bg-coral font-bold text-white hover:bg-coral-dark">
            {busy === "upload" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />A preparar...</> : <><ImagePlus className="mr-2 h-4 w-4" />Escolher fotografias</>}
          </Button>
        </div>

        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

        {media.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-sand/55 p-6 text-center text-sm text-muted-foreground">Ainda não existem fotografias guardadas para este animal.</p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {media.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-sand">
                  {item.publicUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.publicUrl} alt={item.caption || pet.name} className="h-full w-full object-cover" />
                  ) : <div className="flex h-full items-center justify-center text-muted-foreground"><ImagePlus className="h-8 w-8" /></div>}
                  {pet.primaryImage && item.publicUrl === pet.primaryImage && <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-petrol/85 px-2.5 py-1 text-[10px] font-extrabold text-white backdrop-blur"><Star className="h-3 w-3 fill-current text-coral" /> Capa</span>}
                </div>
                <div className="flex gap-2 p-3">
                  <Button type="button" size="sm" variant="outline" disabled={busy === `primary:${item.id}`} onClick={() => void makePrimary(item)} className="flex-1 rounded-xl text-xs"><Star className="mr-1.5 h-3.5 w-3.5" /> Capa</Button>
                  <Button type="button" size="icon" variant="outline" disabled={busy === `delete:${item.id}`} onClick={() => void remove(item)} className="rounded-xl text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
