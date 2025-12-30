# TradeXSports Landing Page

Production-ready landing page for TradeXSports, designed for Azure Static Web Apps.

## Project Structure

```
├── frontend/          # React + Tailwind CSS frontend
├── api/              # Azure Functions (Node.js)
└── staticwebapp.config.json
```

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Azure Functions (Node.js)
- **Storage**: Azure Table Storage

## Local Development Setup

### Prerequisites

1. **Install Azure Functions Core Tools** (required to run functions locally):
   ```bash
   npm install -g azure-functions-core-tools@4 --unsafe-perm true
   ```
   Or download from: https://github.com/Azure/azure-functions-core-tools

2. **Azure Storage Account** - You'll need a connection string for local development

### Running Locally

1. **Configure API environment variables:**
   - Open `api/local.settings.json`
   - Replace `YOUR_ACCOUNT` and `YOUR_KEY` with your Azure Storage Account connection string
   - Or use the full connection string format:
     ```
     DefaultEndpointsProtocol=https;AccountName=YOUR_ACCOUNT;AccountKey=YOUR_KEY;EndpointSuffix=core.windows.net
     ```

2. **Install API dependencies:**
   ```bash
   cd api
   npm install
   ```

3. **Start the Azure Functions (in one terminal):**
   ```bash
   cd api
   npm start
   # Or: func start
   ```
   The API will run on `http://localhost:7071`

4. **Install frontend dependencies (in another terminal):**
   ```bash
   cd frontend
   npm install
   ```

5. **Start the frontend dev server:**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or similar) and proxy API requests to the functions

### Production Deployment

Configure the following environment variable in your Azure Static Web App settings:

- `AZURE_STORAGE_CONNECTION_STRING`: Connection string for Azure Storage Account

## API Endpoints

- `POST /api/waitlist` - Add email to waitlist
- `GET /api/waitlist/export` - Export waitlist as CSV (requires function key)
