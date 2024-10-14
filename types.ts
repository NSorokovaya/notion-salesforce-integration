export interface NotionText {
  text: {
    content: string;
  };
}

interface NotionPageProperties {
  Name: { title: NotionText[] };
  Website: {
    email: string;
  };
  Phone: { phone_number: string };
}

export interface NotionPage {
  id: string;
  properties: NotionPageProperties;
}
