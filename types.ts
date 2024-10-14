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
  object: string;
  created_time: string;
  last_edited_time: string;
  created_by: { object: string; id: string };
  last_edited_by: { object: string; id: string };
  cover?:
    | { type: 'external'; external: { url: string } }
    | { type: 'file'; file: { url: string; expiry_time: string } }
    | null;
  icon?: string | null;
  parent?: {
    type: 'database_id' | 'page_id' | 'block_id' | 'workspace';
    database_id: string;
    page_id: string;
    block_id: string;
    workspace: boolean;
  };
  archived?: boolean;
  in_trash?: boolean;
  properties: NotionPageProperties;
  url?: string;
  public_url?: null | string;
}
