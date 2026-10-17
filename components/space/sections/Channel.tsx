"use client";

import { useEffect, useRef, useState } from "react";
import { contact } from "@/content/contact";
import { socialLinks } from "@/content/site";
import Reveal from "../Reveal";
import SectorHeading from "../SectorHeading";
import SectorSection from "../SectorSection";

export default function Channel() {
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
    <SectorSection id="contact" className="min-h-screen">
      <SectorHeading id="contact" />
      <Reveal>
        <div className="space-panel max-w-3xl p-6 sm:p-10">
          <p className="font-space text-3xl font-semibold leading-tight sm:text-5xl">{contact.headline}</p>
          <p className="mt-5 max-w-prose text-base sm:text-lg">{contact.body}</p>
          <p className="mt-3 text-sm text-s-dim">{contact.availability}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={contact.cta.href} className="rounded bg-s-accent px-6 py-3 font-semibold text-black transition-transform hover:-translate-y-0.5">
              {contact.cta.label}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="rounded border border-s-line px-5 py-3 text-sm transition-colors hover:border-s-cyan hover:text-s-cyan"
            >
              {copied ? "Copied!" : `Copy ${contact.email}`}
            </button>
            <span role="status" className="sr-only">
              {copied ? "Email address copied to clipboard" : ""}
            </span>
          </div>

          {links.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-s-line pt-5 text-sm">
              {links.map((link) => (
                <li key={link.id}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-s-dim underline-offset-4 transition-colors hover:text-s-cyan hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="text-s-dim">{contact.location}</li>
            </ul>
          )}
        </div>
      </Reveal>
    </SectorSection>
  );
}
