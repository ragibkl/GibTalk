// Templates come from the GibTalk symbols API, which fills in full picture URLs.
// (App versions up to 1.0.20 read templates/ in the GitHub repo instead.)
export type TemplateItem = {
  id: string;
  name: string;
  description: string;
  author: string;
  language: string;
  words: number;
  url: string;
};

const TEMPLATES_URL = "https://api.gibtalk.com/api/templates";

export async function getTemplates(): Promise<TemplateItem[]> {
  const doFetch = async () => {
    const res = await fetch(TEMPLATES_URL);
    if (!res.ok) {
      throw new Error(`templates: HTTP ${res.status}`);
    }
    return (await res.json()) as TemplateItem[];
  };

  for (let i = 0; i < 5; i++) {
    try {
      const results = await doFetch();
      return results;
    } catch (error) {
      console.log("error fetching getTemplates");
    }
  }

  return [];
}

// Returns the template's words as a word file (JSON, which the YAML word file
// parser reads too), ready for mergeTemplateContents.
export async function fetchTemplate(item: TemplateItem): Promise<string> {
  const doFetch = async () => {
    const res = await fetch(item.url);
    if (!res.ok) {
      throw new Error(`template ${item.id}: HTTP ${res.status}`);
    }
    const data = (await res.json()) as { words: unknown[] };
    return JSON.stringify(data.words);
  };

  for (let i = 0; i < 5; i++) {
    try {
      const results = await doFetch();
      return results;
    } catch (error) {
      console.log("error fetching fetchTemplate");
    }
  }

  return "";
}
