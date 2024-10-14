import { CONFIG } from '../config';
import { notion } from '../repositories/connections';

export async function getNotionData() {
  try {
    const response = await notion.databases.query({
      database_id: CONFIG.NOTION_DB_ID!,
    });
    return response.results;
  } catch (error) {
    console.error('Error fetching Notion data:', error);
    throw error;
  }
}
