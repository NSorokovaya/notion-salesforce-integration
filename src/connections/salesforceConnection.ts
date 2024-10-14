import jsforce from 'jsforce';
import logger from '../utils/logger';

const SALESFORCE_URL = process.env.SALESFORCE_URL;

if (!SALESFORCE_URL) {
  logger.error('SALESFORCE_URL is not set in the environment variables');
}

export const salesforceConnection = new jsforce.Connection({
  loginUrl: SALESFORCE_URL,
});
