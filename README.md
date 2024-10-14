# Notion to Salesforce Integration

This project integrates Notion with Salesforce, synchronizing data.

## Setup

1. Clone the repository:

   ```
   git clone https://github.com/NSorokovaya/notion-salesforce-integration
   cd notion-salesforce-integration
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your credentials:

   ```
   cp .env.example .env
   ```

## Usage

Run the integration script:

```
npm start
```

The script will log its progress to the console and to a `migration.log` file.

## Testing

Run the tests with:

```
npm test
```
