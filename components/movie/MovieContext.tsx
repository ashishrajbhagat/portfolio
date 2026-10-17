"use client";

import { createContext, useContext } from "react";

export interface MovieContextValue {
  /** True once the intro has revealed the page. Scroll animations only start after this. */
  ready: boolean;
  /** Visitor prefers reduced motion: skip pinning, scrubbing and smooth scroll. */
  reduced: boolean;
  /** Smooth-scrolls to a scene by section id. */
  scrollTo: (id: string) => void;
  /** Stops/starts page scrolling (used while a dialog is open). */
  lockScroll: (locked: boolean) => void;
}

const MovieContext = createContext<MovieContextValue | null>(null);

export const MovieProvider = MovieContext.Provider;

export function useMovie(): MovieContextValue {
  const value = useContext(MovieContext);
  if (!value) throw new Error("useMovie must be used inside <MovieExperience>");
  return value;
}
