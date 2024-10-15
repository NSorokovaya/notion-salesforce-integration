import { delay, formatData } from '../../src/utils/utils';
import { NotionPage } from '../../types';

describe('Utility Functions', () => {
  describe('formatData', () => {
    it('should format NotionPage data  ', () => {
      const mockNotionData: NotionPage[] = [
        {
          id: '12345',
          properties: {
            Name: { title: [{ text: { content: 'Test Company' } }] },
            Website: { email: 'test@example.com' },
            Phone: { phone_number: '123-456-7890' },
          },
          object: 'page',
          created_time: '2024-01-01T00:00:00Z',
          last_edited_time: '2024-01-01T00:00:00Z',
          created_by: { object: 'user', id: 'user-id' },
          last_edited_by: { object: 'user', id: 'user-id' },
        },
      ];

      const result = formatData(mockNotionData);

      expect(result).toEqual([
        {
          Name: 'Test Company',
          Website: 'test@example.com',
          Phone: '123-456-7890',
          Notion_ID__c: '12345',
        },
      ]);
    });

    it('should handle missing properties ', () => {
      const mockNotionData: NotionPage[] = [
        {
          id: '67890',
          properties: {
            Name: { title: [] },
            Website: { email: '' },
            Phone: { phone_number: '' },
          },
          object: 'page',
          created_time: '2024-01-01T00:00:00Z',
          last_edited_time: '2024-01-01T00:00:00Z',
          created_by: { object: 'user', id: 'user-id' },
          last_edited_by: { object: 'user', id: 'user-id' },
        },
      ];

      const result = formatData(mockNotionData);

      expect(result).toEqual([
        {
          Name: '',
          Website: '',
          Phone: '',
          Notion_ID__c: '67890',
        },
      ]);
    });
  });

  describe('delay', () => {
    it('should resolve delay', async () => {
      const start = Date.now();
      await delay(1000);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(1000);
    });
  });
});
