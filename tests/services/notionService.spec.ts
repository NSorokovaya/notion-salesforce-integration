import { notion } from '../../src/connections/notionConnection';
import { getNotionData } from '../../src/services/notionService';

jest.mock('../../src/connections/notionConnection');
jest.mock('../../src/utils/logger');

describe('Notion Service', () => {
  it('should fetch data from Notion', async () => {
    const mockResults = [
      { id: expect.any(String), properties: expect.any(Object) },
    ];

    (notion.databases.query as jest.Mock).mockResolvedValue({
      results: mockResults,
    });

    const result = await getNotionData();

    expect(notion.databases.query).toHaveBeenCalledWith({
      database_id: process.env.NOTION_DB_ID,
    });
    expect(result).toEqual(mockResults);
  });

  it('should throw an error when Notion query fails', async () => {
    const mockError = new Error('Notion API error');
    (notion.databases.query as jest.Mock).mockRejectedValue(mockError);

    await expect(getNotionData()).rejects.toThrow('Notion API error');
  });
});
