export type Language = "en" | "ms" | "zh";

export type Word = {
  id: string;
  label: string;
  uri: string;
  language?: Language;
};
