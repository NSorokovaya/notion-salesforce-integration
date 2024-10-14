import { NotionPage } from '../../types';
import { salesforceConnection } from '../connections/salesforceConnection';
import { formatData } from '../utils/functions';
import logger from '../utils/logger';

export async function loginToSalesforce() {
  const {
    SALESFORCE_USERNAME,
    SALESFORCE_PASSWORD,
    SALESFORCE_SECURITY_TOKEN,
  } = process.env;

  if (
    !SALESFORCE_USERNAME ||
    !SALESFORCE_PASSWORD ||
    !SALESFORCE_SECURITY_TOKEN
  ) {
    logger.error('Missing Salesforce credentials');
    throw new Error('Missing Salesforce credentials');
  }

  try {
    await salesforceConnection.login(
      SALESFORCE_USERNAME,
      `${SALESFORCE_PASSWORD}${SALESFORCE_SECURITY_TOKEN}`,
    );
    logger.info('Connected to Salesforce');
  } catch (error) {
    logger.error('Error connecting to Salesforce:', error);
    throw error;
  }
}

export async function updateSalesforce(notionData: NotionPage[]) {
  const salesforceData = formatData(notionData);

  for (const data of salesforceData) {
    try {
      const result = await salesforceConnection
        .sobject('Account')
        .upsert(data, 'Notion_ID__c');
      logger.info('Data updated in Salesforce:', result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error('Error updating Salesforce:', error.message);
      } else {
        logger.error('Unknown error updating Salesforce:', error);
      }
    }
  }
}
