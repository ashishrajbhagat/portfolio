import type { Dummyable, Tone } from "./types";

export interface FunFact {
  emoji: string;
  text: string;
}

/** Tone: FUNNY. Swap in your real quirks: these are guesses. */
export const funFacts: { tone: Tone; items: FunFact[] } & Dummyable = {
  tone: "funny",
  dummy: true,
  items: [
    { emoji: "💬", text: "My commit messages have improved a lot since 'fix'. The bugs have not noticed." },
    { emoji: "📚", text: "I've built library software for real clients, so I can tell you exactly how many ways a membership renewal can go wrong." },
    { emoji: "🛠️", text: "Most of my side projects start with 'it's just a small tool' and end with three portals and a role system." },
    { emoji: "🔌", text: "I can explain OSGi bundle states faster than I can explain my job at family functions." },
    { emoji: "🎬", text: "This portfolio has three versions because one wasn't dramatic enough." },
    { emoji: "💡", text: "My best bug fixes happen the moment I stop looking at the screen." },
    { emoji: "🖥️", text: "My most-used sentence in software: 'It was working on my system.' Its success rate is, sadly, zero." },
    { emoji: "✨", text: "Officially, every bug I've ever shipped was 'a feature, not a bug'. Release notes to follow." },
  ],
};

export interface Testimonial {
  name: string;
  title: string;
  quote: string;
}

/** Tone: SARCASTIC. Obviously fictional reviewers, so nobody mistakes them for real people. */
export const testimonials: { tone: Tone; items: Testimonial[] } & Dummyable = {
  tone: "sarcastic",
  dummy: true,
  items: [
    {
      name: "Rubber Duck",
      title: "Senior Debugging Consultant",
      quote: "Ashish explains his bugs to me for hours. I have never once interrupted. We're a great team.",
    },
    {
      name: "The Production Server",
      title: "Mission-Critical Colleague",
      quote: "Never goes down during his deploys. Which is suspicious, because it always goes down during everyone else's.",
    },
    {
      name: "The CI Pipeline",
      title: "Quality Gatekeeper",
      quote: "Fails fast, fixes faster. We have an understanding: he reads my errors, I stop turning red.",
    },
    {
      name: "A QA Engineer",
      title: "Professional Skeptic",
      quote: "He said 'it was working on my system.' It was not, in fact, working on my system.",
    },
    {
      name: "A Support Ticket",
      title: "Open Since Forever",
      quote: "I was closed as 'a feature, not a bug'. I'm still waiting for the release notes.",
    },
    {
      name: "A Merge Conflict",
      title: "Frequent Visitor",
      quote: "He resolves me every time. I keep coming back anyway. It's complicated.",
    },
  ],
};
