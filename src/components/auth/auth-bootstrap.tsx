"use client";

import * as React from "react";
import { consumeImplicitSessionFromUrl } from "@/lib/auth-client";

export function AuthBootstrap() {
  React.useEffect(() => {
    if (!window.location.hash.includes("access_token=")) return;
    void consumeImplicitSessionFromUrl().catch(() => {
      // Invalid/expired confirmation links are handled by the relevant auth UI.
    });
  }, []);

  return null;
}
