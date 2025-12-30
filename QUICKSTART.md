# Quick Start Guide

## Step 0: Check Node.js Version

Azure Functions v4 requires **Node.js 18 or 20**. Node.js 22 may cause issues.

Check your version:
```powershell
node --version
```

If you have Node.js 22, you need to install Node.js 20. See **INSTALL_NODE20.md** for detailed instructions.

**Quick options:**
- **Option 1:** Install [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage multiple Node.js versions
- **Option 2:** Download Node.js 20 LTS directly from [nodejs.org](https://nodejs.org/)

## Step 1: Install Azure Functions Core Tools

**Windows (PowerShell as Administrator):**
```powershell
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

**Or download installer:**
https://github.com/Azure/azure-functions-core-tools/releases

## Step 2: Configure Azure Storage Connection String

1. Open `api/local.settings.json`
2. Replace the `AZURE_STORAGE_CONNECTION_STRING` value with your actual Azure Storage connection string
   - You can find this in Azure Portal → Your Storage Account → Access Keys → Connection string

## Step 3: Install Dependencies

**Terminal 1 - API:**
```bash
cd api
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

## Step 4: Run the Application

**Terminal 1 - Start API (keep this running):**
```bash
cd api
npm start
```
You should see: `Functions: http://localhost:7071`

**Terminal 2 - Start Frontend (keep this running):**
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:5173`

## Step 5: Test

1. Open `http://localhost:5173` in your browser
2. Scroll to the waitlist form
3. Enter an email and submit
4. You should see a success message!

## Troubleshooting

**"Network error" when submitting form:**
- Make sure the API is running on port 7071
- Check that `api/local.settings.json` has the correct connection string
- Verify both terminals are running (API and Frontend)

**"func: command not found":**
- Azure Functions Core Tools is not installed
- Install it using the command in Step 1

**"AZURE_STORAGE_CONNECTION_STRING is not configured":**
- Check `api/local.settings.json` has the connection string set
- Make sure you're using the correct format

