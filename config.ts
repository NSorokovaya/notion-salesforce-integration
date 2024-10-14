import dotenv from "dotenv";

dotenv.config();

export const CONFIG = {
  NOTION_TOKEN: process.env.NOTION_TOKEN,
  NOTION_DB_ID: process.env.NOTION_DB_ID,
  SALESFORCE_URL: process.env.SALESFORCE_URL,
  SALESFORCE_USERNAME: process.env.SALESFORCE_USERNAME,
  SALESFORCE_PASSWORD: process.env.SALESFORCE_PASSWORD,
  SALESFORCE_SECURITY_TOKEN: process.env.SALESFORCE_SECURITY_TOKEN,
};
