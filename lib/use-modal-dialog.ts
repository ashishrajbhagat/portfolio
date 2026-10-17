"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Drives a native <dialog> from an `open` flag and keeps page scrolling locked while it is shown.
 * The lock is released in every close path, including the browser closing the dialog itself (Escape).
 */
export function useModalDialog(
  open: boolean,
  lockScroll: (locked: boolean) => void
): RefObject<HTMLDialogElement | null> {
  const ref = useRef<HTMLDialogElement>(null);
  const locked = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
      }
      if (!locked.current) {
        locked.current = true;
        lockScroll(true);
      }
    } else {
      if (dialog.open) {
        if (typeof dialog.close === "function") dialog.close();
        else dialog.removeAttribute("open");
      }
      if (locked.current) {
        locked.current = false;
        lockScroll(false);
      }
    }
  }, [open, lockScroll]);

  // Restore scrolling if the dialog unmounts while open.
  useEffect(
    () => () => {
      if (locked.current) {
        locked.current = false;
        lockScroll(false);
      }
    },
    [lockScroll]
  );

  return ref;
}
