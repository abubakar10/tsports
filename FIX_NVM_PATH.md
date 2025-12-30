# Fix: nvm says it switched but node version doesn't change

## Problem
When you run `nvm use 20.11.0`, it says it worked, but `node --version` still shows the old version. This happens because a direct Node.js installation in `C:\Program Files\nodejs` is taking precedence over nvm.

## Solution: Remove Node.js from System PATH

### Step 1: Open Environment Variables
1. Press `Win + R`
2. Type: `sysdm.cpl` and press Enter
3. Click the **"Advanced"** tab
4. Click **"Environment Variables"** button

### Step 2: Remove Node.js from PATH
1. In **"System variables"** section, find and select **"Path"**
2. Click **"Edit"**
3. Look for this entry: `C:\Program Files\nodejs`
4. Select it and click **"Delete"**
5. Click **"OK"** on all windows

### Step 3: Restart PowerShell
1. **Close ALL PowerShell/terminal windows**
2. Open a **new PowerShell window**
3. Verify nvm works:
   ```powershell
   nvm list
   nvm use 20.11.0
   node --version  # Should now show v20.11.0
   ```

## Alternative: Uninstall Direct Node.js Installation

If you don't need the direct Node.js installation:

1. Open **Settings** → **Apps** → **Installed apps**
2. Search for "Node.js"
3. Uninstall the Node.js application
4. Restart PowerShell
5. Use nvm to manage Node.js versions

## Verify It's Working

After fixing, test:
```powershell
nvm use 20.11.0
node --version  # Should show v20.11.0
npm --version   # Should work with Node.js 20
```

Then navigate to your api folder and start Azure Functions:
```powershell
cd api
npm start
```


