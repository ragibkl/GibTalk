type ImageRawResult = {
  id: number; // 10349,
  symbol_key: string; // "to-eat-1-264f74bf",
  name: string; // "to eat 1",
  locale: string; // "en",
  license: string; // "CC BY-NC-SA",
  license_url: string; // "http://creativecommons.org/licenses/by-nc-sa/3.0/",
  enabled: boolean; // true,
  author: string; // "Sergio Palao",
  author_url: string | null; // "http://www.catedu.es/arasaac/condiciones_uso.php",
  source_url: string | null; // null,
  repo_key: string; // "arasaac",
  hc: boolean; // false,
  protected_symbol: boolean; // false,
  extension: string; // "png",
  image_url: string; // "https://d18vdu4p71yql0.cloudfront.net/libraries/arasaac/to eat_1.png.varianted-skin.png",
  search_string: string; // "eat 1 - , eat, the elephant and dog eat together, we will eat you , e eat, let's eat, what's to eat?, when can we eat it?, candy, what's to eat, 10 eat, look, i want eat, jeść,  comer, afraid to eat, खाना खा लो, تناول الطعام, తినడానికి, eatate, eats, eating and dressing, i want to eat, i want to eat , i want help, eat  food, small bite, now, to eat it, eaten, bird, kaon, go, 吃, edible, still eating, eat tortilla, a snack, hungry , chew, feed, what are you eating?, eat - 'kushat' &  drink -'deet', let's go eat, i am hungry, to eat , eat it, time to eat, mealtimes, irrid niekol, sööbsüüa, is onyx hungry?,  eat, eats, أكل, اكل, تأكل, i ate , snack, eat, borða, i'm hungry, ate, hungry, kain, food, กิน, comer, eten, eat , i want to eat, , eating, to eat, eat,",
  unsafe_result: boolean; // false,
  skins: boolean; // true,
  _href: string; // "/api/v1/symbols/arasaac/to-eat-1-264f74bf?id=10349",
  details_url: string; // "/symbols/arasaac/to-eat-1-264f74bf?id=10349",
  use_score: number; // 11,
  relevance: number; // 212.37452866666666,
  repo_index: number; // 2,
};

export type ImageResult = {
  uri: string;
  terms: string;
};

export async function getSearchSymbols(
  searchTerm: string,
): Promise<ImageResult[]> {
  const doFetch = async () => {
    const url = `https://www.opensymbols.org/api/v1/symbols/search?q=${searchTerm.trim()}`;
    const res = await fetch(url);
    const data = (await res.json()) as ImageRawResult[];

    const results: ImageResult[] = data.map((img: ImageRawResult) => ({
      uri: img.image_url,
      terms: img.name,
    }));

    return results;
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
