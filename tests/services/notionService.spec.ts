import { getNotionConnection } from '../../src/connections/notionConnection';
import { getNotionData } from '../../src/services/notionService';

jest.mock('../../src/connections/notionConnection');
jest.mock('../../src/utils/logger');

const mockNotionClient = {
  databases: {
    query: jest.fn(),
  },
};

(getNotionConnection as jest.Mock).mockReturnValue(mockNotionClient);

describe('Notion Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data from Notion', async () => {
    const mockResults = [
      { id: expect.any(String), properties: expect.any(Object) },
    ];

    (mockNotionClient.databases.query as jest.Mock).mockResolvedValue({
      results: mockResults,
    });

    const result = await getNotionData();

    expect(mockNotionClient.databases.query).toHaveBeenCalledWith({
      database_id: process.env.NOTION_DB_ID,
    });
    expect(result).toEqual(mockResults);
  });

  it('should throw an error when Notion query fails', async () => {
    const mockError = new Error('Error fetching Notion data.');
    (mockNotionClient.databases.query as jest.Mock).mockRejectedValue(
      mockError,
    );

    await expect(getNotionData()).rejects.toThrow(
      'Error fetching Notion data.',
    );
  });
});
