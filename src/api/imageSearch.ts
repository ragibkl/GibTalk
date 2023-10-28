export type ImageResult = {
  url: string;
};

export async function getSearchSymbols(
  searchTerm: string,
): Promise<ImageResult[]> {
  const doFetch = async () => {
    const q = searchTerm.trim();
    const url = `https://api-gibtalk.apps.bancuh.net/api/symbols/search/?q=${q}`;
    const res = await fetch(url);
    const data = (await res.json()) as ImageResult[];

    return data;
  };

  for (let i = 0; i < 5; i++) {
    try {
      const results = await doFetch();
      return results;
    } catch (error) {
      console.log("error fetching getSearchSymbols");
    }
  }

  return [];
}
