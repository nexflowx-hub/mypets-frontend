"use client";

import * as React from "react";
import { authApi } from "@/lib/auth-api";
import { getValidSession } from "@/lib/auth-client";
import { clearPendingGrowthIntent, readPendingGrowthIntent, recordGrowthEvent, roleForIntent } from "@/lib/growth";
import type { ParticipationPayload, ParticipationRole } from "@/lib/core-types";

type Envelope<T> = { data: T };

export function GrowthOnboardingBridge() {
  React.useEffect(() => {
    let cancelled = false;

    const apply = async () => {
      const pending = readPendingGrowthIntent();
      if (!pending) return;
      const session = await getValidSession();
      if (!session || cancelled) return;

      try {
        if (pending.leadId) {
          await authApi(`/growth/leads/${pending.leadId}/convert`, { method: "POST" });
        }

        const role = roleForIntent(pending.intent);
        if (!role) {
          clearPendingGrowthIntent();
          return;
        }

        const response = await authApi<Envelope<ParticipationPayload>>("/me/participation");
        const roles = Array.from(new Set<ParticipationRole>([...response.data.roles, role]));
        if (!response.data.roles.includes(role)) {
          await authApi<Envelope<{ roles: ParticipationRole[] }>>("/me/roles", {
            method: "PUT",
            body: JSON.stringify({ roles }),
          });
          await recordGrowthEvent({ leadId: pending.leadId, eventName: "ROLE_SELECTED", metadata: { intent: pending.intent, role, targetCauseId: pending.targetCauseId } });
        }

        if (pending.intent === "SPONSOR" && pending.targetCauseId) {
          await authApi("/sponsorships/interests", {
            method: "POST",
            body: JSON.stringify({ causeId: pending.targetCauseId, isAnonymous: false, communicationPreferences: {} }),
          });
          await recordGrowthEvent({ leadId: pending.leadId, eventName: "SPONSORSHIP_STARTED", metadata: { causeId: pending.targetCauseId } });
        }

        clearPendingGrowthIntent();
        if (!cancelled) window.location.replace("/dashboard?onboarding=done");
      } catch {
        // Keep pending intent so the user can retry on the next dashboard visit.
      }
    };

    void apply();
    return () => { cancelled = true; };
  }, []);

  return null;
}
