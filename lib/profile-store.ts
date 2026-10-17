"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProfileSlug } from "@/content/types";

interface ProfileState {
  last: ProfileSlug | null;
  setLast: (slug: ProfileSlug) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      last: null,
      setLast: (slug) => set({ last: slug }),
    }),
    { name: "ashish-portfolio-profile", skipHydration: true }
  )
);

/** Returns the last-watched profile after localStorage has been read (null before that). */
export function useLastProfile(): ProfileSlug | null {
  const last = useProfileStore((s) => s.last);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.resolve(useProfileStore.persist.rehydrate()).then(() => setReady(true));
  }, []);

  return ready ? last : null;
}
