# Ashish Raj: Portfolio ("Who's watching?")

A Netflix-style profile screen. Each profile opens a different experience:

| Profile   | Theme                 | Phase |
|-----------|-----------------------|-------|
| Recruiter | Movie (cinematic)     | 3 (done) |
| Developer | Terminal OS / boot    | 2 (done) |
| Explorer  | Space / night sky     | 4 (done) |

**Phase 1:** project setup, the profile-selection screen, all written content, placeholder images and a
full content preview inside each profile (`/watch/<profile>`) so you can review every line before animations are added.

**Phase 2:** the complete **Terminal OS** theme for the Developer profile.

**Phase 3:** the complete **Movie** theme for the Recruiter profile.

**Phase 4:** the complete **Space** theme for the Explorer profile (see below), a more colourful Terminal
and Movie palette, and your portrait in every theme (placeholder until you add your real photo).

**Launch-ready batch:** real certifications and education write-ups, the AEM Tutorial project, share previews
(Open Graph / Twitter images), SEO metadata, sitemap and robots, error pages, security headers, CI and a deployment
guide. See `DEPLOY.md`.

**Latest (this ZIP):** live website previews with a "blocked site" fallback, the real YantraStack and English Daily
projects, keyboard shortcuts and an easter egg on the home page, an automated accessibility check (axe-core) with the two
real bugs it found fixed, `three` pinned to 0.182.0 (newer versions print a deprecation warning from react-three-fiber),
and the dev-console noise removed.

All three profiles are fully built. What is left is polish (easter eggs, optional sound).

## Seeing the full animations

All three themes respect the operating system's "reduce motion" setting. With it ON you get the calm version: no
countdown intro, no smooth scrolling or scroll effects (Movie), no boot sequence (Terminal), and a still sky with no
camera flight (Space). To see everything, turn animations on:
- Windows 11: Settings > Accessibility > Visual effects > Animation effects: On
- macOS: System Settings > Accessibility > Display > Reduce motion: Off

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
npm test         # unit + component tests (vitest, 214 tests)
```

Requires Node 20+.

## Structure

```
app/                 routes (/ = profile screen, /watch/[profile] = theme page)
components/          ProfileGrid, ProfileCard, avatars, ProfileShell, ContentPreview
content/             ALL copy and data. Edit here, every theme updates.
lib/profile-store.ts remembers the last-watched profile (localStorage)
```

One content source feeds all three themes. `content/flavor.ts` changes only the **voice** (section titles and
one-liners) per theme; the facts stay the same.

## Live project previews

Clicking a project opens a dialog with the **real website running inside it** (a browser-style frame with a
Desktop / Mobile toggle and an "Open in a new tab" link), instead of a static screenshot. The preview loads only when the
dialog opens.

- A project is previewed when it has a live `https` link in `content/projects.ts` (`links.live`). Set `embed: false` to
  switch it off (this portfolio does, so it never frames itself), or add a `previewNote` to explain in words.
- **A site can only be shown in a frame if it allows it.** If a project site sends `X-Frame-Options: DENY/SAMEORIGIN`
  or a CSP `frame-ancestors` that excludes `https://ashishrajbhagat.dev`, browsers refuse to display it.
- `/api/embed-check` (a small server route, cached for an hour) reads each project site's headers and works this out.
  When a site blocks framing, the dialog says so and offers a clear "Open ... in a new tab" button, plus the exact
  header responsible, instead of showing an empty frame. See `DEPLOY.md` for the one-line header fix on your own sites.
- The site's Content-Security-Policy only allows framing the origins of those project links (`lib/embed.ts` feeds
  `next.config.ts`; custom domains also get their `www` / apex twin because of redirects), and the iframe is sandboxed.
- **Restart `npm run dev` after changing project links**: the security headers are read when the server starts.

## Sharing, SEO and security

- **Share previews:** `/opengraph-image` (and a per-profile one under `/watch/<profile>/`) draw a 1200x630 card with your
  photo, generated at build time from `lib/og.tsx`. The Terminal, Movie and Space cards use their own accent colour.
- **Search:** page titles and descriptions, canonical URLs, `sitemap.xml`, `robots.txt`, a web manifest, favicons and
  schema.org `Person` data (no phone, address, birth date or marks). Only `/` and the Recruiter view are indexed.
- **Error pages:** `app/error.tsx` (retry button) and `app/global-error.tsx` (last resort), plus the existing 404.
- **Security headers:** strict Content-Security-Policy and friends in `config/security-headers.mjs`, covered by tests.
- **CI and deploy:** `.github/workflows/ci.yml` and `DEPLOY.md`. Set `NEXT_PUBLIC_SITE_URL` in production (`.env.example`).

## Photos

Two photos are used, both stored in `public/images/` and configured in `content/site.ts`:
- `ashish.jpg` (`site.avatar`): a square head-and-shoulders crop. Used for the home page, the Movie About scene, the
  Terminal (`whoami`), the Space hero and About, and the plain view.
- `ashish-workspace.jpg` (`site.scene`): the taller photo at the desk, used as the Movie theme's hero image.

To swap a photo, replace the file (keep the name, or change the path in `site.ts`). Real photos are optimised by
Next.js automatically. Square crops of at least 800x800 px work best for `avatar`.

## Privacy choices

- No phone number, date of birth or marks/CGPA appear anywhere on the site or in the downloadable resume.
- The library platforms are presented as **client work** (Udaan Library Management System, Gyan Study Library LMS), never as a business the
  author owns.
- `public/resume.pdf` is a generated, public-safe resume. Do not drop your original resume into `public/` if it
  contains a phone number. To change the resume, edit and run `scripts/make_resume.py` (needs `pip install reportlab`).

## Space (Explorer profile)

A scroll-driven flight through a 3D night sky. The page is normal scrolling HTML; a fixed WebGL canvas behind it moves
a camera along a curved route as you scroll. Each of the 13 sections is a waypoint, and every project hangs in space as
a planet beside the route.

- **Opening:** a short hyperspace jump (the camera rushes in from far behind with a wide field of view).
- **Sky:** 4,500 procedurally placed stars (1,800 on phones), drifting nebula clouds, procedurally painted planets with
  glowing atmospheres and rings, a rotating client outpost station, a pulsing signal beacon beside the contact scene.
- **Projects = planets:** hover or focus a project card and its planet swells and glows; click a planet in the sky and
  that project opens in a dialog. The cards stay the accessible way in (the canvas is `aria-hidden`).
- **HUD:** sector label, distance travelled in light years and a velocity readout that follows your scroll speed. A
  sector index on the right edge jumps between scenes.
- **Feel:** gentle pointer parallax, a field-of-view kick when you scroll fast, instrument-style skill gauges.

**Production details**
- three.js is code-split: it loads only in the browser after the page is interactive (not in the initial scripts).
- No WebGL, or the scene crashes: a pure CSS sky takes over and everything else keeps working (an error boundary and
  a capability check guard this). The CSS gradient sky is always the base layer, so there is no black flash on load.
- `prefers-reduced-motion`: no flight, no jump, no parallax, no readouts, a single static frame is rendered. Content
  simply scrolls over a still sky.
- Phones and low-core devices get fewer stars, lower geometry detail and a lower pixel-ratio cap.
- Scroll maths is pure and unit tested (`lib/space/scene-progress.ts`); layout is only measured when the scroll position
  or window size changes. Textures and materials are disposed on unmount. The mutable bridge between HTML and canvas is
  one tiny store (`lib/space/store.ts`) that the render loop reads each frame, so scrolling causes no React re-renders.
- No JavaScript: content is server-rendered and visible (reveal animations only hide content that starts below the fold).
- The native `<dialog>` logic is shared with the Movie theme (`lib/use-modal-dialog.ts`), including the Escape fix.
- Tests: flight path and `placeAt` geometry, scroll-to-scene maths, formatting, plus component tests for the whole page
  (reduced motion on and off), the dialog, planet click and hover, and the telemetry.

**Tuning:** star counts and pixel ratio are in `lib/space/quality.ts`; route shape and spacing in
`lib/space/waypoints.ts`; planet sizes, positions and rings in `components/space/canvas/SceneObjects.tsx`; jump length
and speed kick in `components/space/canvas/CameraRig.tsx`; colours are CSS variables on `.space-theme` in
`app/globals.css`.

Code map: `components/space/` (page, HUD, nav, sections), `components/space/canvas/` (the WebGL scene), `lib/space/`
(route, scroll maths, textures, quality, store).

## Movie (Recruiter profile)

A one-page film. A countdown leader and title card open it (once per tab session; any key, tap or the Skip button
ends it), then 13 scenes scroll by with film grain, a vignette and smooth scrolling.

| Scene | What happens |
|-------|--------------|
| Now Showing | Word-by-word title reveal, parallax bokeh, rating badge, CTAs |
| Origin Story | Heading and portrait stay put while the story scrolls; the paragraph mid-screen is lit, the rest dim; stats count up |
| The Grind | Sticky heading beside one full card per role (no horizontal scrolling, nothing clipped) |
| Presentations | Movie-poster cards with a 3D tilt; each opens a "trailer" dialog with full details |
| The Cast | Skills as a cast list with animated bars and the sarcastic one-liners |
| Flashback | Education starts as sepia black-and-white and regains colour as you scroll |
| Awards | Certifications with laurels |
| Client Work | A paper plane flies along a curved path as you scroll; the library platforms built for clients |
| Behind the Scenes, Reviews | Clapperboard fun facts, five-star reviews from a rubber duck and friends |
| Press Kit, Book a Screening | Resume download, ticket-style contact card with copy-email |
| End Credits | Pinned rolling credits that end on the post-credits scene |

**Stack:** GSAP + ScrollTrigger + MotionPath (animation), Lenis (smooth scroll, synced to GSAP's ticker),
Fraunces (title font), native `<dialog>` for project details.

**Look:** champagne gold on ink. Restrained on purpose: one gold accent, ivory text, hairline borders, solid gold
buttons, big serif titles, a very faint coloured glow behind each scene and a muted jewel-tone accent per project poster.

**Production details**
- `prefers-reduced-motion`: no intro, no smooth scroll, no pinning or scrubbing. Everything is simply visible.
- Only the end credits are pinned (tablets and up; set up through `gsap.matchMedia`, so it reverts cleanly on resize or
  when the preference changes). Every other scene is a plain scrolling layout, so nothing can be clipped or hijacked.
- No JavaScript: the content is server-rendered and a `<noscript>` rule removes the intro cover.
- Accessible: skip link, labelled scene navigation, real headings, `aria-current` on the active scene, focus-trapping
  dialog with Escape to close, decorative effects are `aria-hidden`.
- Scroll lock while a dialog is open is always released (including when the browser closes the dialog on Escape).
- Placeholder links (`"#"`) are never rendered.
- Tests: scenes and number formatting (`lib/movie`), full-page render, dialog, copy-email and intro timing under
  reduced motion, plus a smoke test that sets up and tears down every pin and scrub under jsdom.

**Tuning:** intro timings are constants at the top of `components/movie/Intro.tsx`; the credits pin length is in the
`end:` value of `EndCredits.tsx`; colours are CSS variables on `.movie` in
`app/globals.css`; scene names for the side index are in `lib/movie/scenes.ts`.

Code map: `components/movie/` (shell, intro, nav, helpers), `components/movie/sections/` (one file per scene),
`lib/movie/` (GSAP setup, formatting, scene list, reduced-motion hook).

## Terminal OS (Developer profile)

Boot sequence, auto-typed login, then a real interactive terminal. Boot plays once per tab session and is skipped
under `prefers-reduced-motion`. `reboot` replays it.

**Look:** the default `neon` theme is syntax-highlighted like a code editor (pink headings, cyan paths and links,
yellow numbers, green bullets, per-file-type `ls` colours, a gradient banner). `theme green|amber|ice` switch to the
other palettes (all of them multi-colour now).

**Commands:** `help`, `whoami`, `about`, `experience` (git-log style), `projects [name]`, `skills`, `education`, `certs`,
`clients`, `fortune`, `reviews`, `resume`, `contact`, `credits`, `neofetch`, `ls`, `cd`, `cat`, `pwd`, `open <target>`,
`history`, `echo`, `date`, `theme green|amber|ice`, `crt on|off`, `clear`, `plain`, `reboot`, `exit`, `man <cmd>`.
There is a virtual filesystem (`~/projects/*.md`, `~/certs/*`, `~/client-work/README.md`...) built from `content/`.
A few hidden easter eggs exist. `sudo` is a good place to start.

**Keyboard:** Tab completes (commands, paths, arguments; press twice to list options), arrow keys browse history,
Ctrl+L clears, Ctrl+C cancels the line, Ctrl+U wipes it. Quick-command buttons make it usable on phones.

**Production details**
- Accessible: real `<input>` with label, `role="log"` output, visible focus, "Plain view" toggle (top bar) that shows the
  same content as a normal page, `<noscript>` fallback with the full content, reduced-motion support.
- Resilient: storage access is wrapped (private mode safe), settings are validated, command errors are caught, output is
  capped (80 entries / 100 history lines), `open` only works with an allow-list of links from `content/`.
- Placeholder links (`"#"`) are never rendered or opened by the terminal.
- Themes and scanline preference persist in localStorage.
- Tests: `lib/terminal/*.test.ts` (parser, paths, completion, settings...) and `TerminalSession.test.tsx` (typing
  commands, history, tab completion, errors, exit).

Code map: `lib/terminal/` (pure logic and command registry), `components/terminal/` (UI), `components/terminal/outputs/`
(what each command prints).

## Voice map (which tone where)

| Section        | Tone                          |
|----------------|-------------------------------|
| Hero           | Funny                         |
| About          | Serious, funny, a bit sarcastic |
| Experience     | Serious (+ one witty "plot twist" per role) |
| Projects       | Serious descriptions, funny taglines |
| Skills         | Sarcastic (one-liner per skill) |
| Education      | Serious                       |
| Certifications | Serious titles, funny notes   |
| Client Work    | Funny, warm                   |
| Fun facts      | Funny                         |
| Testimonials   | Sarcastic (reviewers are a rubber duck, a server, a CI pipeline...) |
| Resume         | Serious                       |
| Contact        | Serious, friendly             |
| Credits        | Funny                         |

## Replace before going live

Anything flagged `dummy: true` in `content/` shows an amber "placeholder" badge in the plain preview.

Already real: experience, education (with the earlier schooling), certifications with their dates, skills list,
contact email and all five social links, photos, resume PDF, and the AEM Tutorial project.

- [ ] Check the Udaan project's feature list (`projects.ts`): it is an educated guess. YantraStack and English Daily
      are written from their live sites
- [ ] Skill levels (`skills.ts`) are guesses used for the visual bars: adjust or remove them
- [ ] Coursework list and the Intermediate / Matriculation write-ups in `education.ts` are generic: edit freely
- [ ] Fun facts and the joke reviewers are placeholders: keep only what is true and what you like
- [ ] Availability wording in `contact.ts`

## Next phases

5. Easter eggs, optional sound, mobile and accessibility polish
