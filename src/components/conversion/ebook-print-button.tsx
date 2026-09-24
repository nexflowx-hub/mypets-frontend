"use client";

import { Download } from "lucide-react";

export function EbookPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-petrol px-5 text-sm font-black text-white print:hidden"
    >
      <Download className="h-4 w-4" />
      Guardar / imprimir em PDF
    </button>
  );
}
