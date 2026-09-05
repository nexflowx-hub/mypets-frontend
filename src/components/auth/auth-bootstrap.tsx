"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { consumeImplicitSessionFromUrl } from "@/lib/auth-client";

export function AuthBootstrap() {
  const router = useRouter();

  React.useEffect(() => {
    if (!window.location.hash.includes("access_token=")) return;
    const params = new URLSearchParams(window.location.hash.slice(1));
    const type = params.get("type");

    void consumeImplicitSessionFromUrl()
      .then((session) => {
        if (session && type === "signup") router.replace("/dashboard");
      })
      .catch(() => {
        // Invalid/expired confirmation links are handled by the relevant auth UI.
      });
  }, [router]);

  return null;
}
