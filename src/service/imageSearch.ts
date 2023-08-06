export type ImageResult = {
  uri: string;
  terms: string;
};

export async function postSearchSymbols(
  searchTerm: string,
): Promise<ImageResult[]> {
  const keywords = searchTerm.trim();
  if (!keywords) {
    return;
  }

  const body = new URLSearchParams({
    keywords,
    aramode: "1",
    tawmode: "1",
    mulmode: "1",
  }).toString();

  const res = await fetch("https://www.senteacher.org/getsymbols/", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    },
    body,
  });
  const data = await res.json();

  const results: ImageResult[] = [];
  for (let i = 0; i < data.resultcount; i++) {
    const uri = `https://www.senteacher.org/${data.results[i]}`;
    const terms = data.resultwords[i];
    results.push({ uri, terms });
  }

  return results;
}
