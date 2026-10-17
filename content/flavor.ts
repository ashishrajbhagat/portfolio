import type { Flavor, SectionKey, ThemeKey, Tone } from "./types";

/**
 * Section titles and one-liners per theme.
 * The facts stay the same everywhere; only the voice changes.
 */
export const flavor: Record<ThemeKey, Record<SectionKey, Flavor>> = {
  movie: {
    hero: { title: "Now Showing", subtitle: "A film about a developer, a deadline and an unreasonable number of browser tabs." },
    about: { title: "Chapter 1: The Origin Story", subtitle: "Every great film starts with a protagonist who has no idea what's coming. (Spoiler: it's AEM.)" },
    experience: { title: "Chapter 2: The Grind", subtitle: "Plot, character development and a surprising number of Maven builds." },
    projects: { title: "Featured Presentations", subtitle: "Handpicked trailers. Full movies available on request." },
    skills: { title: "The Cast", subtitle: "Starring a lot of languages. Some of them have speaking roles." },
    education: { title: "Flashback Sequence", subtitle: "Rewind to 2016. Black-and-white footage, hopeful soundtrack." },
    certifications: { title: "Awards & Nominations", subtitle: "Three AEM trophies. No acceptance speech was given. (Yet.)" },
    funFacts: { title: "Behind the Scenes", subtitle: "Bloopers, deleted scenes and the director's commit history." },
    testimonials: { title: "Critics' Reviews", subtitle: "Five stars from sources that definitely exist." },
    resume: { title: "The Press Kit", subtitle: "Everything the media needs, in one PDF." },
    contact: { title: "Book a Screening", subtitle: "Popcorn is optional. Email is not." },
    credits: { title: "End Credits", subtitle: "Please stay seated. There's a post-credits scene." },
  },
  terminal: {
    hero: { title: "$ whoami", subtitle: "ashish: user with sudo access to several repositories and a few production bugs." },
    about: { title: "$ cat about.md", subtitle: "Reading file... no segmentation fault detected." },
    experience: { title: "$ git log --career", subtitle: "Showing commits. Most were 'minor fix'. Some were genuinely minor." },
    projects: { title: "$ ls ~/projects", subtitle: "Listing directories. Everything compiles on my machine." },
    skills: { title: "$ ./skills --list", subtitle: "Output may contain exaggeration. Levels are self-reported by a man with a deadline." },
    education: { title: "$ cat education.txt", subtitle: "Loading degree... parsed successfully." },
    certifications: { title: "$ ls ~/certs", subtitle: "3 files found. All signed by Adobe." },
    funFacts: { title: "$ fortune", subtitle: "Today's fortune, brought to you by /dev/random." },
    testimonials: { title: "$ cat reviews.log", subtitle: "Warning: reviewers are not human. Proceed with trust issues." },
    resume: { title: "$ ./download-resume.sh", subtitle: "Permission granted. No sudo required." },
    contact: { title: "$ mail -s 'hello' ashish", subtitle: "Compose message. Replies are faster than a CI pipeline." },
    credits: { title: "$ exit", subtitle: "Session closed. Thanks for not running rm -rf." },
  },
  space: {
    hero: { title: "Launch Pad", subtitle: "T-minus zero. Please keep your arms and ideas inside the vehicle." },
    about: { title: "Home Planet", subtitle: "Population: one developer, a few client projects and far too many browser tabs." },
    experience: { title: "Mission Log", subtitle: "Two missions completed. One still in orbit." },
    projects: { title: "Star Systems", subtitle: "Each planet is a project. Some are inhabited. Some are still terraforming." },
    skills: { title: "Onboard Instruments", subtitle: "Everything on the dashboard works. Mostly. Don't touch the red button." },
    education: { title: "Training Academy", subtitle: "Four years of simulation before the real launch." },
    certifications: { title: "Mission Badges", subtitle: "Three badges earned. Adhesive not included." },
    funFacts: { title: "Cosmic Trivia", subtitle: "Facts from the edge of the known galaxy (Buxar)." },
    testimonials: { title: "Transmissions Received", subtitle: "Signals from deep space. Authenticity unverified." },
    resume: { title: "Mission Dossier", subtitle: "Classified-ish. Download clearance granted." },
    contact: { title: "Open a Channel", subtitle: "Send a signal. Replies travel faster than Voyager, usually." },
    credits: { title: "Mission Complete", subtitle: "Re-entry successful. Thanks for flying with us." },
  },
};

/** Which voice each section is written in. Handy for reviewing copy. */
export const sectionTones: Record<SectionKey, Tone[]> = {
  hero: ["funny"],
  about: ["serious", "funny", "sarcastic"],
  experience: ["serious"],
  projects: ["serious", "funny"],
  skills: ["sarcastic"],
  education: ["serious"],
  certifications: ["serious", "funny"],
  funFacts: ["funny"],
  testimonials: ["sarcastic"],
  resume: ["serious"],
  contact: ["serious"],
  credits: ["funny"],
};
