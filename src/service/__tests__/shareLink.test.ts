// Share links already sent to parents and teachers must keep opening. This
// link is format 1 as app.gibtalk.com makes it (ragibkl/app-gibtalk has the
// same test); if it stops decoding, old links are broken.
import { describe, expect, it, vi } from "vitest";

vi.mock("../speech", () => ({
  normalizeLanguage: (l: string) => (l === "tu" ? "te" : l),
}));

import { readShareLink, withPictures } from "../shareLink";

const V1 =
  "https://app.gibtalk.com/s#1bc1BCsIwFATQq5RZR8WDuHQVshjrJy0m_4ckFbx9KRVE6HaYN-NxH1mow_sK5z2aJGb2oTDOcGBlI8dT--SHpXaJZs8hW9VZ47lohENuCM7jxhf1QAj7r7g9KNvRcp1H-V_MVgUOcBBFCFs0WeKBnSQl-2LZcZe0xGXnfdn4Cg";
const MEDIA = "https://api.gibtalk.com/media/";

describe("share links, format 1", () => {
  it("still decodes", () => {
    const set = readShareLink(V1);
    expect(set.name).toBe("Ucapan v1");
    expect(set.words.map((w) => w.label)).toEqual([
      "selamat pagi",
      "Makan",
      "hola",
      "telugu",
    ]);
    expect(set.words[0]).toMatchObject({
      uri: MEDIA + "arasaac-symbols/good morning.png",
      language: "ms",
    });
    expect(set.words[1].children?.map((w) => w.label)).toEqual([
      "nasi",
      "more",
    ]);
    expect(set.words[2].language).toBe("es");
    expect(set.words[3].language).toBe("te");
  });

  it("reads links pasted inside other text, from any address", () => {
    const fragment = V1.slice(V1.indexOf("/s#"));
    expect(
      readShareLink(`Try this: https://example.org${fragment} thanks`).name,
    ).toBe("Ucapan v1");
  });

  it("drops words without a picture", () => {
    const words = withPictures(readShareLink(V1).words);
    expect(words.map((w) => w.label)).toEqual([
      "selamat pagi",
      "Makan",
      "hola",
    ]);
    expect(words[1].children?.map((w) => w.label)).toEqual(["nasi"]);
  });
});
