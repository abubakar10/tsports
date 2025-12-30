# Troubleshooting Azure Functions Local Development

## Error: "Worker was unable to load entry point index.js"

If you're seeing this error, try these steps:

### Step 1: Verify File Structure
Ensure your function structure looks like this:
```
api/
├── host.json
├── package.json
├── local.settings.json
└── waitlist/
    ├── function.json
    └── index.js
```

### Step 2: Clean and Reinstall
```powershell
cd api
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Step 3: Verify function.json
The `function.json` should have:
- No `scriptFile` property (defaults to `index.js`)
- OR `"scriptFile": "index.js"` (relative to function folder)

### Step 4: Check File Encoding
Ensure `index.js` is saved as UTF-8 without BOM.

### Step 5: Restart Functions
```powershell
# Stop current process (Ctrl+C)
# Then restart:
npm start
```

### Step 6: Run with Verbose Logging
```powershell
func start --verbose
```

### Step 7: Verify Node.js Version
Azure Functions v4 requires Node.js 18 or 20:
```powershell
node --version
```

### Alternative: Use Programming Model v2
If the issue persists, you might need to use the newer programming model. However, for Azure Static Web Apps, the v1 model (current setup) should work.


