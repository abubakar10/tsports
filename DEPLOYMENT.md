# Azure Deployment Guide - Step by Step

This guide covers deploying your TradeXSports landing page to Azure. You have two deployment options:

## Option 1: Azure Static Web Apps (Recommended - Hosts Both Frontend & API)

Azure Static Web Apps can host both your React frontend AND your Azure Functions API in one service. This is the recommended approach.

## Option 2: Separate Deployments

- Frontend → Azure Static Web Apps
- API → Azure Functions (separate Function App)

---

# OPTION 1: Azure Static Web Apps (Recommended)

## Prerequisites

1. **Azure Account** with active subscription
2. **GitHub Account** (for CI/CD)
3. **Azure CLI** installed (optional but helpful)
   ```powershell
   winget install -e --id Microsoft.AzureCLI
   ```

## Step 1: Prepare Your Code

### 1.1 Ensure your project structure is correct:
```
tsports/
├── frontend/          # React app
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── api/              # Azure Functions
│   ├── waitlist/
│   ├── host.json
│   └── package.json
├── staticwebapp.config.json
└── .gitignore
```

### 1.2 Update vite.config.js for production build:
Your `frontend/vite.config.js` should have the build output configured. Verify it builds correctly:

```powershell
cd frontend
npm run build
```

The build should create a `dist` folder (or check your vite.config.js for `outDir`).

### 1.3 Update .gitignore (if needed):
Make sure `api/local.settings.json` is in `.gitignore` (it contains secrets).

## Step 2: Push Code to GitHub

### 2.1 Initialize Git (if not already done):
```powershell
git init
git add .
git commit -m "Initial commit - ready for Azure deployment"
```

### 2.2 Create GitHub Repository:
1. Go to https://github.com/new
2. Create a new repository (e.g., `tsports-landing`)
3. **Don't** initialize with README (you already have code)

### 2.3 Push to GitHub:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/tsports-landing.git
git branch -M main
git push -u origin main
```

## Step 3: Create Azure Static Web App

### 3.1 Via Azure Portal:

1. **Go to Azure Portal**: https://portal.azure.com

2. **Create Resource**:
   - Click "Create a resource"
   - Search for "Static Web App"
   - Click "Create"

3. **Basics Tab**:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or use existing (e.g., `tsports-rg`)
   - **Name**: `tsports-landing` (must be globally unique)
   - **Plan type**: Free (or Standard for production)
   - **Region**: Choose closest to you
   - **Source**: GitHub
   - **Sign in with GitHub**: Click and authorize Azure

4. **Build Details Tab**:
   - **Organization**: Your GitHub username
   - **Repository**: `tsports-landing` (your repo name)
   - **Branch**: `main`
   - **Build Presets**: Custom
   - **App location**: `frontend` (where your React app is)
   - **Api location**: `api` (where your Azure Functions are)
   - **Output location**: `dist` (your vite.config.js outputs to `../dist` which is the root `dist` folder)

5. **Review + Create**:
   - Review settings
   - Click "Create"

### 3.2 Wait for Deployment:
- Azure will automatically:
  1. Create the Static Web App
  2. Set up GitHub Actions workflow
  3. Trigger first deployment
  4. Build and deploy your app

This takes 5-10 minutes. You can watch progress in:
- Azure Portal → Your Static Web App → Deployment history
- GitHub → Your repo → Actions tab

## Step 4: Configure Environment Variables

### 4.1 Add Azure Storage Connection String:

1. **Go to Azure Portal** → Your Static Web App
2. **Settings** → **Configuration**
3. **Application settings** → **+ Add**
4. Add:
   - **Name**: `AZURE_STORAGE_CONNECTION_STRING`
   - **Value**: Your Azure Storage connection string
     ```
     DefaultEndpointsProtocol=https;AccountName=tsportswaitlist;AccountKey=YOUR_KEY;EndpointSuffix=core.windows.net
     ```
5. Click **OK** → **Save**

### 4.2 Verify Storage Account:
- Make sure your Storage Account (`tsportswaitlist`) exists and is accessible
- The connection string should match the one you used locally

## Step 5: Test Your Deployment

### 5.1 Get Your App URL:
- Azure Portal → Your Static Web App → **Overview**
- Find **URL**: `https://tsports-landing.azurestaticapps.net` (or similar)

### 5.2 Test the Landing Page:
1. Open the URL in browser
2. Test the waitlist form
3. Submit an email
4. Verify it's stored in Azure Table Storage

### 5.3 Test API Endpoints:
- Waitlist: `https://your-app.azurestaticapps.net/api/waitlist`
- Export: `https://your-app.azurestaticapps.net/api/waitlist/export`

## Step 6: Custom Domain (Optional)

1. Azure Portal → Your Static Web App → **Custom domains**
2. Click **Add**
3. Follow instructions to add your domain

---

# OPTION 2: Separate Deployments

If you prefer to deploy frontend and API separately:

## Part A: Deploy Frontend to Azure Static Web Apps

Follow Steps 1-3 from Option 1, but:
- **Api location**: Leave empty (you're deploying API separately)
- **Output location**: `dist`

## Part B: Deploy API to Azure Functions

### B.1 Install Azure Functions Core Tools (if not installed):
```powershell
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

### B.2 Login to Azure:
```powershell
az login
```

### B.3 Create Function App:
```powershell
# Set variables
$resourceGroup = "tsports-rg"
$location = "eastus"
$functionAppName = "tsports-api-$(Get-Random)"
$storageAccount = "tsportswaitlist"  # Your existing storage account

# Create Function App
az functionapp create `
  --resource-group $resourceGroup `
  --consumption-plan-location $location `
  --runtime node `
  --runtime-version 20 `
  --functions-version 4 `
  --name $functionAppName `
  --storage-account $storageAccount
```

### B.4 Deploy Functions:
```powershell
cd api
func azure functionapp publish $functionAppName
```

### B.5 Configure Environment Variables:
```powershell
az functionapp config appsettings set `
  --name $functionAppName `
  --resource-group $resourceGroup `
  --settings "AZURE_STORAGE_CONNECTION_STRING=YOUR_CONNECTION_STRING"
```

### B.6 Update Frontend to Use Function App URL:
Update `frontend/vite.config.js` proxy target to your Function App URL, or update the API calls in your React components.

---

# Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Waitlist form submits successfully
- [ ] Emails are stored in Azure Table Storage
- [ ] Export endpoint works (if needed)
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS is enabled (automatic with Static Web Apps)
- [ ] Environment variables are set correctly

---

# Troubleshooting

## Frontend Not Loading:
- Check build output location in Static Web App settings
- Verify `staticwebapp.config.json` is in root
- Check GitHub Actions logs for build errors

## API Not Working:
- Verify `AZURE_STORAGE_CONNECTION_STRING` is set in Application Settings
- Check Function App logs: Portal → Your App → Functions → Monitor
- Verify API location path matches your folder structure

## 404 Errors:
- Check `staticwebapp.config.json` routing rules
- Verify `navigationFallback` is configured correctly

## Build Failures:
- Check Node.js version (should be 20.x)
- Verify all dependencies are in `package.json`
- Check GitHub Actions workflow file for errors

---

# Useful Commands

## View Deployment Status:
```powershell
az staticwebapp show --name tsports-landing --resource-group tsports-rg
```

## View Function App Logs:
```powershell
az functionapp log tail --name tsports-api --resource-group tsports-rg
```

## Update Environment Variable:
```powershell
az staticwebapp appsettings set `
  --name tsports-landing `
  --resource-group tsports-rg `
  --setting-names AZURE_STORAGE_CONNECTION_STRING `
  --setting-values "YOUR_NEW_CONNECTION_STRING"
```

---

# Cost Estimate

**Azure Static Web Apps (Free Tier)**:
- 100 GB bandwidth/month
- 2 GB storage
- Perfect for landing pages

**Azure Functions (Consumption Plan)**:
- 1 million free requests/month
- 400,000 GB-seconds compute time/month

**Azure Table Storage**:
- First 10 GB free
- ~$0.07 per GB after

**Total Estimated Cost**: $0-5/month for typical landing page traffic

---

# Next Steps After Deployment

1. **Set up monitoring**: Azure Application Insights (optional)
2. **Configure custom domain**: Add your domain name
3. **Set up email notifications**: For new waitlist signups (optional)
4. **Analytics**: Add Google Analytics or Azure Application Insights
5. **Backup strategy**: Export waitlist data regularly

---

# Support Resources

- [Azure Static Web Apps Docs](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Functions Docs](https://docs.microsoft.com/azure/azure-functions/)
- [GitHub Actions for Azure](https://github.com/Azure/actions)

