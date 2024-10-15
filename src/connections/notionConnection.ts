import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

let notionClient: Client | null = null;

export function getNotionConnection(): Client {
  if (!notionClient) {
    const token = process.env.NOTION_TOKEN;

    if (!token) {
      logger.error('Notion token is missing');
      throw new Error('Notion token is missing');
    }

    try {
      notionClient = new Client({ auth: token });
      logger.info('Connected to Notion');
    } catch (error) {
      logger.error('Error connecting to Notion:', error);
      throw new Error('Error connecting to Notion');
    }
  }

  return notionClient;
}
