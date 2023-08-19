import YAML from "yaml";

export type TemplateItem = {
  name: string;
  description: string;
  author: string;
  uri: string;
};

const BASE_URL =
  "https://github.com/ragibkl/GibTalk/raw/feat/templates/templates";

// const BASE_URL = "https://github.com/ragibkl/GibTalk/raw/master/templates";

export async function getTemplates(): Promise<TemplateItem[]> {
  const doFetch = async () => {
    const res = await fetch(`${BASE_URL}/index.yaml`);
    const text = await res.text();
    const data = YAML.parse(text) as TemplateItem[];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.uri.startsWith("./")) {
        item.uri = item.uri.replace("./", `${BASE_URL}/`);
      }
    }

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

export async function fetchTemplate(item: TemplateItem): Promise<string> {
  const doFetch = async () => {
    const res = await fetch(item.uri);
    const text = await res.text();

    return text;
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
