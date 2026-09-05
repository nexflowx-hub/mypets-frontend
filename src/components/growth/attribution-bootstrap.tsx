"use client";

import * as React from "react";
import { captureAttribution } from "@/lib/attribution";

export function AttributionBootstrap() {
  React.useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
