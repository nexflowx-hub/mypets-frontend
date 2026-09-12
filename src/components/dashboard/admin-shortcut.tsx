"use client";

import * as React from "react";
import Link from "next/link";
import { Megaphone, SearchCheck } from "lucide-react";
import { authApi } from "@/lib/auth-api";
import { getValidSession, onAuthChanged } from "@/lib/auth-client";

export function AdminShortcut() {
  const [visible, setVisible] = React.useState(false);

  const check = React.useCallback(async () => {
    const session = await getValidSession();
    if (!session) return setVisible(false);
    try {
      await authApi("/me/admin");
      setVisible(true);
    } catch {
      setVisible(false);
    }
  }, []);

  React.useEffect(() => {
    void check();
    return onAuthChanged(() => void check());
  }, [check]);

  if (!visible) return null;

  return (
    <section className="mx-auto grid max-w-7xl gap-3 px-4 pt-6 sm:px-6 md:grid-cols-2 lg:px-8">
      <Link href="/admin/campaigns" className="flex items-center justify-between rounded-2xl border border-coral/20 bg-coral/5 px-5 py-4 transition hover:border-coral/50 hover:bg-coral/10">
        <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral text-white"><Megaphone className="h-5 w-5" /></span><div><p className="text-sm font-extrabold text-petrol">Campaign Admin</p><p className="text-xs text-muted-foreground">Classificar causas e montar landings de aquisição.</p></div></div>
        <span className="text-xs font-extrabold text-coral">Abrir →</span>
      </Link>
      <Link href="/admin/discovery" className="flex items-center justify-between rounded-2xl border border-coral/20 bg-white px-5 py-4 transition hover:border-coral/50 hover:bg-coral/5">
        <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-petrol text-white"><SearchCheck className="h-5 w-5" /></span><div><p className="text-sm font-extrabold text-petrol">Discovery Admin</p><p className="text-xs text-muted-foreground">Rever candidatos, gerar convites e validar claims.</p></div></div>
        <span className="text-xs font-extrabold text-coral">Abrir →</span>
      </Link>
    </section>
  );
}
