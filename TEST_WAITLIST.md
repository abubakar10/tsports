# Test Waitlist Function Locally

## Quick Test Commands

### 1. Start the API (Terminal 1)
```powershell
cd api
npm start
```

Wait until you see:
```
Functions:
    waitlist: [POST] http://localhost:7071/api/waitlist
```

### 2. Test the Waitlist Endpoint (Terminal 2)

**Test with valid email:**
```powershell
Invoke-RestMethod -Uri "http://localhost:7071/api/waitlist" -Method POST -Body '{"email":"test@example.com"}' -ContentType "application/json"
```

**Expected response:**
```json
{
  "message": "Successfully added to waitlist",
  "email": "test@example.com"
}
```

**Test with duplicate email (should fail):**
```powershell
Invoke-RestMethod -Uri "http://localhost:7071/api/waitlist" -Method POST -Body '{"email":"test@example.com"}' -ContentType "application/json"
```

**Expected response:**
```json
{
  "error": "Email already registered"
}
```

**Test with invalid email:**
```powershell
Invoke-RestMethod -Uri "http://localhost:7071/api/waitlist" -Method POST -Body '{"email":"invalid"}' -ContentType "application/json"
```

**Expected response:**
```json
{
  "error": "Invalid email format"
}
```

### 3. Test from Frontend

1. **Start Frontend (Terminal 3):**
   ```powershell
   cd frontend
   npm run dev
   ```

2. **Open browser:** http://localhost:5173

3. **Scroll to waitlist form and submit an email**

4. **Check for success/error message**

## Troubleshooting

**If you get "entry point not found" error:**
- Make sure you're using Node.js 20 (not 22)
- Restart the functions after any changes
- Check that `api/waitlist/index.js` exists

**If you get connection errors:**
- Make sure the API is running on port 7071
- Check that `api/local.settings.json` has the Azure Storage connection string configured

**If you get 500 errors:**
- Check the function logs in Terminal 1
- Verify the Azure Storage connection string is correct
- Make sure `@azure/data-tables` package is installed

