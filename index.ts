// add eslint, prettier, .eeditorconfig
// change everything to imports
//tests

import { NotionPage } from "./types";

const dotenv = require("dotenv");
const { Client } = require("@notionhq/client");
const jsforce = require("jsforce");
const fs = require("fs").promises;

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const connection = new jsforce.Connection({
  loginUrl: process.env.SALESFORCE_URL,
});

async function login() {
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
    throw new Error("Missing Salesforce credentials in environment variables");
  }

  try {
    await connection.login(
      SALESFORCE_USERNAME,
      SALESFORCE_PASSWORD + SALESFORCE_SECURITY_TOKEN
    );
    console.log("Connected to Salesforce");
  } catch (error: any) {
    console.error("Error connecting to Salesforce:", error.message);
    throw error;
  }
}

async function getNotionData() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DB_ID,
    });
    console.log(response.results[0].id);
    return response.results;
  } catch (error: any) {
    console.error("Error fetching Notion data:", error.message);
    throw error;
  }
}
async function updateSalesforce(notionData: NotionPage[]) {
  for (const data of notionData) {
    try {
      const salesforceData = {
        Name: data.properties.Name.title[0]?.text.content,
        Website: data.properties.Website.email,
        Phone: data.properties.Phone.phone_number,
        Notion_ID__c: data.id,
      };

      const result = await connection
        .sobject("Account")
        .upsert(salesforceData, "Notion_ID__c");

      console.log("Created record in Salesforce:", result);
    } catch (error: any) {
      console.error("Error updating Salesforce:", error.message);
    }
  }
}

async function main() {
  try {
    await login();
    const notionData = await getNotionData();
    await updateSalesforce(notionData);
  } catch (error: any) {
    console.error("Error in main process:", error.message);
  } finally {
    await connection.logout();
    console.log("Logged out from Salesforce");
  }
}

main();
