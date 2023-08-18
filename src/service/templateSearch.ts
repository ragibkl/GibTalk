import YAML from "yaml";

export type TemplateItemResult = {
  name: string;
  description: string;
  uri: string;
};

export async function getTemplates(): Promise<TemplateItemResult[]> {
  const doFetch = async () => {
    const res = await fetch("https://raw.gihubusercontent.com/ragibkl/GibTalk/templates/index.yaml");
    const text = await res.text();
    const data = YAML.parse(text) as TemplateItemResult[];

    return data;
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
