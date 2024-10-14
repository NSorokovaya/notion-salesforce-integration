import { salesforceConnection } from './src/connections/salesforceConnection';
import { getNotionData } from './src/services/notionService';
import {
  loginToSalesforce,
  updateSalesforce,
} from './src/services/salesforceService';
import logger from './src/utils/logger';
import { retryWithDelay } from './src/utils/retries';
import { NotionPage } from './types';

const teardown = async () => {
  try {
    await salesforceConnection.logout();
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
  } finally {
    await teardown();
  }
})();
