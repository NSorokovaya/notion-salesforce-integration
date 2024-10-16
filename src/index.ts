import { getSalesforceConnection } from './connections/salesforceConnection';
import { getNotionData } from './services/notionService';
import {
  loginToSalesforce,
  updateSalesforce,
} from './services/salesforceService';
import { NotionPage } from './types';
import logger from './utils/logger';
import { retryWithDelay } from './utils/retries';

const teardown = async () => {
  try {
    const connection = await getSalesforceConnection();

    if (!connection) {
      logger.error('No Salesforce connection available. Skipping data update.');
      throw new Error('No Salesforce connection available.');
    }

    await connection.logout();
    logger.info('Logged out from Salesforce');
  } catch (logoutError: unknown) {
    if (logoutError instanceof Error) {
      logger.error('Error logging out from Salesforce:', logoutError.message);
    } else {
      logger.error('Error:', logoutError);
    }
  }
};

(async function integration() {
  try {
    await retryWithDelay(loginToSalesforce);
    logger.info('Successfully logged in to Salesforce');

    const notionData = await retryWithDelay(getNotionData);
    logger.info(`Fetched ${notionData.length} records from Notion.`);

    await retryWithDelay(() => updateSalesforce(notionData as NotionPage[]));
    logger.info('Successfully updated Salesforce with Notion data');
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Integration error:', error.message);
    } else {
      logger.error('Integration error:', error);
    }
    process.exit(1);
  } finally {
    await teardown();
  }
})();

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error.message);
  logger.error(error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise);
  logger.error('Reason:', reason);
  process.exit(1);
});
