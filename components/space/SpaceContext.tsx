"use client";

import { createContext, useContext } from "react";

export interface SpaceContextValue {
  reduced: boolean;
  scrollTo: (id: string) => void;
  openProject: (id: string) => void;
}

const SpaceContext = createContext<SpaceContextValue | null>(null);

export const SpaceProvider = SpaceContext.Provider;

export function useSpace(): SpaceContextValue {
  const value = useContext(SpaceContext);
  if (!value) throw new Error("useSpace must be used inside <SpaceExperience>");
  return value;
}
