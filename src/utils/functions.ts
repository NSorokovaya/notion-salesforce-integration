import { NotionPage } from '../../types';

export function formatData(notionData: NotionPage[]): object[] {
  return notionData.map((data) => ({
    Name: data.properties.Name.title[0]?.text.content ?? '',
    Website: data.properties.Website.email ?? '',
    Phone: data.properties.Phone.phone_number ?? '',
    Notion_ID__c: data.id,
  }));
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
