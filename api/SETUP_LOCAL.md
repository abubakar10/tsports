# Local Development Setup - Step by Step

## ⚠️ Important: Node.js Version

Azure Functions v4 requires **Node.js 18 or 20**. Node.js 22 is not fully supported and may cause the "entry point not found" error.

### Check Your Node.js Version
```powershell
node --version
```

### If You Have Node.js 22

**Option 1: Use nvm-windows (Recommended)**
1. Install [nvm-windows](https://github.com/coreybutler/nvm-windows)
2. Install Node.js 20:
   ```powershell
   nvm install 20.11.0
   nvm use 20.11.0
   ```
3. Verify: `node --version` should show v20.x.x

**Option 2: Install Node.js 20 directly**
Download from: https://nodejs.org/ (LTS version 20.x)

## Setup Steps

### 1. Navigate to API Folder
```powershell
cd api
```

### 2. Clean Install (if having issues)
```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
```

### 3. Configure Azure Storage Connection String
Edit `local.settings.json` and replace the connection string:
```json
{
  "Values": {
    "AZURE_STORAGE_CONNECTION_STRING": "Your-Actual-Connection-String-Here"
  }
}
```

### 4. Start Functions
```powershell
npm start
# Or: func start
```

You should see:
```
Functions:
    waitlist: [POST] http://localhost:7071/api/waitlist
    waitlist/export: [GET] http://localhost:7071/api/waitlist/export
```

### 5. Test the Function
In another terminal, test with curl or PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:7071/api/waitlist" -Method POST -Body '{"email":"test@example.com"}' -ContentType "application/json"
```

## Troubleshooting

### Still Getting "entry point not found" Error?

1. **Verify file structure:**
   ```
   api/
   ├── waitlist/
   │   ├── function.json
   │   └── index.js
   ```

2. **Check function.json** - Should NOT have `scriptFile` property (defaults to index.js)

3. **Verify index.js exists:**
   ```powershell
   Test-Path .\waitlist\index.js
   ```

4. **Try verbose mode:**
   ```powershell
   func start --verbose
   ```

5. **Reinstall Azure Functions Core Tools:**
   ```powershell
   npm uninstall -g azure-functions-core-tools
   npm install -g azure-functions-core-tools@4 --unsafe-perm true
   ```


