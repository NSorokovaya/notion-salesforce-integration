import { Connection } from 'jsforce';
import logger from '../utils/logger';
import { retryWithDelay } from '../utils/retries';

let connection: Connection | null = null;

export const getSalesforceConnection = async () => {
  const SALESFORCE_URL = process.env.SALESFORCE_URL;

  if (!SALESFORCE_URL) {
    logger.error('SALESFORCE_URL is not set in the environment variables');
    return null;
  }
  if (!connection) {
    try {
      connection = await retryWithDelay(
        async () =>
          new Connection({
            loginUrl: SALESFORCE_URL,
          }),
      );
      logger.info('Connected to Salesforce');
    } catch (error) {
      logger.error('Failed to  connect:', error);
      connection = null;
    }
  }
  return connection;
};
