# How to Install Node.js 20 for Azure Functions

## Option 1: Install nvm-windows (Recommended for Managing Multiple Versions)

### Step 1: Download nvm-windows
1. Go to: https://github.com/coreybutler/nvm-windows/releases
2. Download the latest `nvm-setup.exe` file
3. Run the installer and follow the prompts

### Step 2: Install Node.js 20
Open a **new PowerShell window** (as Administrator recommended) and run:
```powershell
nvm install 20.11.0
nvm use 20.11.0
```

### Step 3: Verify
```powershell
node --version
# Should show: v20.11.0
```

### Step 4: Switch Between Versions (if needed)
```powershell
# Use Node.js 20
nvm use 20.11.0

# Use Node.js 22 (if you need it for other projects)
nvm use 22.20.0
```

---

## Option 2: Direct Installation (Simpler, but replaces current Node.js)

### Step 1: Download Node.js 20 LTS
1. Go to: https://nodejs.org/
2. Download the **LTS version (20.x.x)** - Windows Installer (.msi)
3. Run the installer

### Step 2: Verify
Open a **new PowerShell window** and run:
```powershell
node --version
# Should show: v20.x.x
```

**Note:** This will replace your current Node.js 22 installation. If you need both versions, use Option 1 (nvm-windows).

---

## After Installing Node.js 20

1. **Navigate to API folder:**
   ```powershell
   cd api
   ```

2. **Clean and reinstall:**
   ```powershell
   Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
   Remove-Item package-lock.json -ErrorAction SilentlyContinue
   npm install
   ```

3. **Start Azure Functions:**
   ```powershell
   npm start
   ```

4. **Test the function:**
   ```powershell
   # In another terminal
   Invoke-RestMethod -Uri "http://localhost:7071/api/waitlist" -Method POST -Body '{"email":"test@example.com"}' -ContentType "application/json"
   ```

---

## Quick Reference: nvm-windows Commands

```powershell
nvm list              # List installed Node.js versions
nvm install 20.11.0   # Install Node.js 20.11.0
nvm use 20.11.0       # Switch to Node.js 20.11.0
nvm current           # Show current Node.js version
```


