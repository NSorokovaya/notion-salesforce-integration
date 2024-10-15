import { NotionPage } from '../../types';
import { getSalesforceConnection } from '../connections/salesforceConnection';
import logger from '../utils/logger';
import { formatData } from '../utils/utils';

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
    const connection = await getSalesforceConnection();

    if (!connection) {
      logger.error('No Salesforce connection available. Skipping data update.');
      throw new Error('No Salesforce connection available.');
    }

    await connection.login(
      SALESFORCE_USERNAME,
      `${SALESFORCE_PASSWORD}${SALESFORCE_SECURITY_TOKEN}`,
    );

    logger.info('Connected to Salesforce');
  } catch (error) {
    logger.error('Error connecting to Salesforce:', error);
    throw new Error('Error connecting to Salesforce.');
  }
}

export async function updateSalesforce(notionData: NotionPage[]) {
  const salesforceData = formatData(notionData);

  for (const data of salesforceData) {
    try {
      const connection = await getSalesforceConnection();

      if (!connection) {
        logger.error(
          'No Salesforce connection available. Skipping data update.',
        );
        throw new Error('No Salesforce connection available.');
      }

      const result = await connection
        .sobject('Account')
        .upsert(data, 'Notion_ID__c');

      logger.info('Data updated in Salesforce:', result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error('Error updating Salesforce:', error.message);
        throw new Error('Error updating Salesforce.');
      } else {
        logger.error('Unknown error updating Salesforce:', error);
        throw new Error('Unknown error updating Salesforce.');
      }
    }
  }
}
