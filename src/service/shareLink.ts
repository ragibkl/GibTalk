// Reads share links made at app.gibtalk.com (repo ragibkl/app-gibtalk,
// src/lib/share.ts). The whole set travels in the link after "#":
//   https://app.gibtalk.com/s#1<base64url(deflate-raw(JSON [name, words]))>
//   word = [label, picture, language] or [label, picture, language, [words]]
//   picture = a path under https://api.gibtalk.com/media/, or "" (no picture)
import { inflateSync, strFromU8 } from "fflate";

import { Language, normalizeLanguage } from "./speech";

const MEDIA = "https://api.gibtalk.com/media/";

export type SharedWord = {
  label: string;
  uri: string;
  language: Language;
  children?: SharedWord[];
};

export type SharedSet = { name: string; words: SharedWord[] };

type Packed = [string, string, string, Packed[]?];

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function fromBase64Url(text: string): Uint8Array {
  const out: number[] = [];
  let bits = 0;
  let value = 0;
  for (const ch of text) {
    const n = ALPHABET.indexOf(ch);
    if (n < 0) throw new Error(`bad character ${ch}`);
    value = (value << 6) | n;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out.push((value >> bits) & 0xff);
    }
  }
  return Uint8Array.from(out);
}

function unpack(items: unknown): SharedWord[] {
  if (!Array.isArray(items)) throw new Error("not a list of words");
  return (items as Packed[]).map(([label, pic, language, children]) => ({
    label: String(label),
    uri: pic ? MEDIA + pic : "",
    language: normalizeLanguage(String(language)),
    children: children ? unpack(children) : undefined,
  }));
}

/** Pulls the share data out of a link, or anything pasted that contains one. */
function shareData(text: string): string | null {
  const m = text.trim().match(/\/s#([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

export function isShareLink(text: string): boolean {
  return shareData(text) !== null;
}

/** Throws a friendly error when the link isn't a GibTalk share link. */
export function readShareLink(text: string): SharedSet {
  const data = shareData(text);
  if (!data) {
    throw new Error(
      "That isn't a GibTalk share link. Links look like app.gibtalk.com/s#…",
    );
  }
  if (!data.startsWith("1")) {
    throw new Error(
      "This link was made by a newer version of GibTalk. Update the app and try again.",
    );
  }
  try {
    const json = strFromU8(inflateSync(fromBase64Url(data.slice(1))));
    const [name, words] = JSON.parse(json);
    return { name: String(name), words: unpack(words) };
  } catch {
    throw new Error(
      "This link is damaged or incomplete. Ask for it again, or copy the whole link.",
    );
  }
}

/** Words without a picture, which the board can't show: they're left out. */
export function withPictures(words: SharedWord[]): SharedWord[] {
  return words
    .filter((w) => w.uri)
    .map((w) =>
      w.children ? { ...w, children: withPictures(w.children) } : w,
    );
}

export function countWords(words: SharedWord[]): number {
  return words.reduce((n, w) => n + 1 + countWords(w.children ?? []), 0);
}
