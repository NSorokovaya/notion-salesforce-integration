import { salesforceConnection } from './repositories/connections';
import { getNotionData } from './services/notionService';
import {
  loginToSalesforce,
  updateSalesforce,
} from './services/salesforceService';
import { NotionPage } from './types';

(async function integration() {
  try {
    await loginToSalesforce();
    const notionData = await getNotionData();
    console.log(notionData);
    await updateSalesforce(notionData as NotionPage[]);
  } catch (error: any) {
    console.error('Error in integration process:', error.message);
  } finally {
    await salesforceConnection.logout();
    console.log('Logged out from Salesforce');
  }
})();
