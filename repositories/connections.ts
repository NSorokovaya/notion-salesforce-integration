import { Client } from '@notionhq/client';
import jsforce from 'jsforce';
import { CONFIG } from '../config';

export const salesforceConnection = new jsforce.Connection({
  loginUrl: CONFIG.SALESFORCE_URL,
});

export const notion = new Client({ auth: CONFIG.NOTION_TOKEN });
