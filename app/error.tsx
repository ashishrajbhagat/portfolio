"use client";

import Link from "next/link";
import { useEffect } from "react";

/** Shown when something throws while rendering a page. `reset` retries the render. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center bg-[#0a0a0c] px-6 text-center text-white">
      <div className="max-w-md">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#c9a45c]">Technical difficulties</p>
        <h1 className="mt-4 font-title text-4xl font-light tracking-tight sm:text-5xl">Something went off-script.</h1>
        <p className="mt-4 text-neutral-400">
          This page hit an unexpected error. It was working on my system, I promise. Trying again usually fixes it, and if
          not, the profiles are one click away.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded bg-[#c9a45c] px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#e6cc92]"
          >
            Try again
          </button>
          <Link href="/" className="rounded border border-white/25 px-6 py-2.5 text-sm transition-colors hover:border-[#c9a45c] hover:text-[#c9a45c]">
            Back to profiles
          </Link>
        </div>
        {error.digest && <p className="mt-6 text-xs text-neutral-600">Reference: {error.digest}</p>}
      </div>
    </main>
  );
}
