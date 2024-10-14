import { salesforceConnection } from "./repositories/connections";
import { getNotionData } from "./services/notionService";
import { loginToSalesforce, updateSalesforce } from "./services/salesforceService";



(async function main() {
  try {
    await loginToSalesforce();
    const notionData = await getNotionData();
    await updateSalesforce(notionData);
  } catch (error: any) {
    console.error("Error in main process:", error.message);
  } finally {
    await salesforceConnection.logout();
    console.log("Logged out from Salesforce");
  }
}
)()
