import { getSalesforceConnection } from '../../src/connections/salesforceConnection';
import {
  loginToSalesforce,
  updateSalesforce,
} from '../../src/services/salesforceService';
import logger from '../../src/utils/logger';

jest.mock('../../src/utils/logger');
jest.mock('../../src/connections/salesforceConnection');
jest.mock('../../src/utils/logger');

const mockSalesforceConnection = {
  login: jest.fn(),
  sobject: jest.fn(),
};

(getSalesforceConnection as jest.Mock).mockResolvedValue(
  mockSalesforceConnection,
);

const mockNotionData = [
  {
    id: expect.any(String),
    properties: {
      Name: { title: [{ text: { content: expect.any(String) } }] },
      Website: { email: expect.any(String) },
      Phone: { phone_number: expect.any(String) },
    },
    object: expect.any(String),
    created_time: expect.any(String),
    last_edited_time: expect.any(String),
    created_by: { object: expect.any(String), id: expect.any(String) },
    last_edited_by: {
      object: expect.any(String),
      id: expect.any(String),
    },
    cover: expect.any(Object),
    parent: expect.any(Object),
    archived: expect.any(Boolean),
    in_trash: expect.any(String),
    url: expect.any(String),
    public_url: expect.any(String),
  },
];

describe('Salesforce Service', () => {
  describe('loginToSalesforce', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      process.env.SALESFORCE_USERNAME = expect.any(String);
      process.env.SALESFORCE_PASSWORD = expect.any(String);
      process.env.SALESFORCE_SECURITY_TOKEN = expect.any(String);
    });

    it('should login to Salesforce successfully', async () => {
      await loginToSalesforce();

      expect(mockSalesforceConnection.login).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );
    });

    it('should throw an error when Salesforce credentials are missing', async () => {
      const originalEnv = { ...process.env };

      delete process.env.SALESFORCE_USERNAME;
      delete process.env.SALESFORCE_PASSWORD;
      delete process.env.SALESFORCE_SECURITY_TOKEN;

      await expect(loginToSalesforce()).rejects.toThrow(
        'Missing Salesforce credentials',
      );
      process.env = originalEnv;
    });

    it('should throw an error when Salesforce login fails', async () => {
      (mockSalesforceConnection.login as jest.Mock).mockRejectedValue(
        new Error(),
      );

      await expect(loginToSalesforce()).rejects.toThrow();
    });
  });

  describe('updateSalesforce', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      process.env.SALESFORCE_USERNAME = expect.any(String);
      process.env.SALESFORCE_PASSWORD = expect.any(String);
      process.env.SALESFORCE_SECURITY_TOKEN = expect.any(String);
    });

    it('should update Salesforce with Notion data', async () => {
      const mockUpsertResult = { success: true, id: expect.any(String) };

      const mockSobject = {
        upsert: jest.fn().mockResolvedValue(mockUpsertResult),
      };

      mockSalesforceConnection.sobject.mockReturnValue(mockSobject);

      await updateSalesforce(mockNotionData);

      expect(mockSalesforceConnection.sobject).toHaveBeenCalledWith('Account');

      expect(mockSobject.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          Name: expect.any(String),
          Website: expect.any(String),
          Phone: expect.any(String),
          Notion_ID__c: expect.any(String),
        }),
        'Notion_ID__c',
      );
    });

    it('should handle errors when updating Salesforce', async () => {
      const mockSobject = {
        upsert: jest.fn().mockRejectedValue(new Error('Upsert failed')),
      };
      (mockSalesforceConnection.sobject as jest.Mock).mockReturnValue(
        mockSobject,
      );

      await expect(updateSalesforce(mockNotionData)).rejects.toThrow(
        'Error updating Salesforce.',
      );

      expect(logger.error).toHaveBeenCalledWith(
        'Error updating Salesforce:',
        expect.any(String),
      );
    });
  });
});
