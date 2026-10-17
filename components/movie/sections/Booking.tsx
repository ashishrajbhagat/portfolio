"use client";

import { useEffect, useRef, useState } from "react";
import { contact } from "@/content/contact";
import { socialLinks } from "@/content/site";
import SceneHeading from "../SceneHeading";

export default function Booking() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);
  const links = socialLinks.filter((link) => link.url && link.url !== "#");

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission): fall back to the mail client.
      window.location.href = contact.cta.href;
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" data-aurora="rose" className="px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <SceneHeading id="contact" />

        <div data-reveal="" className="ticket mx-auto max-w-4xl p-8 sm:p-12">
          <p className="text-grad-warm inline-block text-xs font-semibold tracking-[0.4em]">ADMIT ONE · FRONT ROW</p>
          <p className="mt-4 font-title text-3xl leading-tight sm:text-5xl">{contact.headline}</p>
          <p className="mt-5 max-w-prose text-base text-m-fg/90 sm:text-lg">{contact.body}</p>
          <p className="mt-3 text-sm text-m-dim">{contact.availability}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-dashed border-m-line pt-8">
            <a
              href={contact.cta.href}
              className="rounded bg-m-amber hover:bg-m-gold px-6 py-3 font-semibold text-black shadow-[0_14px_34px_-18px_var(--m-amber)] transition-transform hover:-translate-y-0.5"
            >
              {contact.cta.label}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="rounded border border-m-fg/25 px-5 py-3 text-sm text-m-fg transition-colors hover:border-m-amber hover:text-m-amber"
            >
              {copied ? "Copied!" : `Copy ${contact.email}`}
            </button>
            <span role="status" className="sr-only">
              {copied ? "Email address copied to clipboard" : ""}
            </span>
          </div>

          {links.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {links.map((link) => (
                <li key={link.id}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-m-dim underline-offset-4 transition-colors hover:text-m-amber hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="text-m-dim">{contact.location}</li>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
