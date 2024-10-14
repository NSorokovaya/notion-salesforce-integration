import { CONFIG } from '../config';
import { salesforceConnection } from '../repositories/connections';
import { NotionPage } from '../types';

export async function loginToSalesforce() {
  const {
    SALESFORCE_USERNAME,
    SALESFORCE_PASSWORD,
    SALESFORCE_SECURITY_TOKEN,
  } = CONFIG;

  if (
    !SALESFORCE_USERNAME ||
    !SALESFORCE_PASSWORD ||
    !SALESFORCE_SECURITY_TOKEN
  ) {
    throw new Error('Missing Salesforce credentials');
  }

  try {
    await salesforceConnection.login(
      SALESFORCE_USERNAME,
      SALESFORCE_PASSWORD + SALESFORCE_SECURITY_TOKEN,
    );
    console.log('Connected to Salesforce');
  } catch (error) {
    console.error('Error connecting to Salesforce:', error);
    throw error;
  }
}

export async function updateSalesforce(notionData: NotionPage[]) {
  for (const data of notionData) {
    try {
      const salesforceData = {
        Name: data.properties.Name.title[0]?.text.content,
        Website: data.properties.Website.email,
        Phone: data.properties.Phone.phone_number,
        Notion_ID__c: data.id,
      };

      const result = await salesforceConnection
        .sobject('Account')
        .upsert(salesforceData, 'Notion_ID__c');

      console.log('Created record in Salesforce:', result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating Salesforce:', error.message);
      } else {
        console.error('Unknown error updating Salesforce:', error);
      }
    }
  }
}
