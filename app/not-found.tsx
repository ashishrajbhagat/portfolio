import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <h1 className="font-display text-5xl font-semibold">This profile doesn&apos;t exist.</h1>
        <p className="mt-3 text-neutral-400">Profiles are limited to three, unlike my browser tabs. It's not a bug, it's a feature.</p>
        <Link href="/" className="mt-8 inline-block border border-neutral-500 px-6 py-2.5 text-sm transition-colors hover:border-white">
          Back to profiles
        </Link>
      </div>
    </main>
  );
}
