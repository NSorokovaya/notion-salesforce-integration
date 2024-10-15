import { notion } from '../connections/notionConnection';
import logger from '../utils/logger';

export async function getNotionData() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DB_ID!,
    });
    logger.info('Successfully fetched Notion data.');
    return response.results;
  } catch (error) {
    logger.error('Error fetching Notion data:', error);
    throw new Error('Error fetching Notion data.');
  }
}
