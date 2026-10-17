import type { Metadata } from "next";
import { certifications } from "@/content/education";
import type { Profile } from "@/content/profiles";
import { site, socialLinks } from "@/content/site";

const absolute = (path: string) => new URL(path, site.url).toString();

/** schema.org Person data for search engines. Deliberately has no phone number, address, birth date or marks. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    image: absolute(site.avatar),
    jobTitle: "Software Engineer",
    description: site.description,
    worksFor: { "@type": "Organization", name: "Concentrix Catalyst" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "National Institute of Science & Technology, Berhampur" },
    knowsAbout: ["Adobe Experience Manager", "AEM", "Java", "OSGi", "Apache Sling", "JavaScript", "Next.js", "Supabase"],
    hasCredential: certifications.map((cert) => ({
      "@type": "EducationalOccupationalCredential",
      name: cert.title,
      credentialCategory: "certification",
      recognizedBy: { "@type": "Organization", name: cert.issuer },
    })),
    sameAs: socialLinks.map((link) => link.url),
  };
}

/** Serialises JSON-LD for a <script> tag, escaping "<" so it can never close the tag early. */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Metadata for a profile page. The Recruiter view carries the full written content, so it is the one indexed
 * for search; the other two show the same content in a different theme and are kept out of the index to avoid
 * duplicates (they still render proper share previews).
 */
export function profileMetadata(profile: Profile): Metadata {
  const title = `${profile.name} view`;
  const description = `${profile.pitch} Portfolio of ${site.name}, ${site.description.split(": ")[1] ?? site.description}`;
  const path = `/watch/${profile.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: profile.slug === "recruiter", follow: true },
    openGraph: {
      type: "website",
      url: path,
      siteName: site.name,
      title: `${title} | ${site.name}`,
      description,
      locale: "en_IN",
    },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description },
  };
}

/** Paths that belong in the sitemap (the indexed pages only). */
export const sitemapPaths = ["/", "/watch/recruiter"] as const;
