export type CalloutKind = "tip" | "warn" | "rec" | "pitfall" | "cite";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; kind: CalloutKind; title: string; body: string }
  | { type: "code"; lang: string; code: string; caption?: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "figure"; fig: string; caption: string };

export type PartId =
  | "intro"
  | "preprocess"
  | "structure"
  | "conditions"
  | "trajectories"
  | "mechanisms"
  | "extensions";

export type Chapter = {
  slug: string;
  no: string;
  title: string;
  titleEn: string;
  part: PartId;
  minutes: number;
  blurb: string;
  objectives: string[];
  sourcePath: string;
  takeaways: string[];
  tools: string[];
  blocks: ContentBlock[];
};

export type Part = {
  id: PartId;
  index: string;
  title: string;
  titleEn: string;
  color: "yellow" | "pink" | "cyan" | "lime" | "orange";
  summary: string;
};

export type GlossaryEntry = {
  term: string;
  en: string;
  def: string;
};

export type QuizQuestion = {
  id: string;
  chapter: string;
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
};
