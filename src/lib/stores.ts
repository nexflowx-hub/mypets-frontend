"use client";

import { create } from "zustand";

export interface DonateTarget {
  /** ANIMAL | PROTECTOR | NETWORK | GUARDIANS */
  type: string;
  storyId?: string;
  label?: string;
}

interface DonateState {
  open: boolean;
  target: DonateTarget | null;
  openDonate: (target?: DonateTarget) => void;
  closeDonate: () => void;
}

export const useDonateStore = create<DonateState>((set) => ({
  open: false,
  target: null,
  openDonate: (target) => set({ open: true, target: target ?? null }),
  closeDonate: () => set({ open: false, target: null }),
}));

interface UiState {
  searchOpen: boolean;
  authOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  setAuthOpen: (v: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  searchOpen: false,
  authOpen: false,
  setSearchOpen: (v) => set({ searchOpen: v }),
  setAuthOpen: (v) => set({ authOpen: v }),
}));
