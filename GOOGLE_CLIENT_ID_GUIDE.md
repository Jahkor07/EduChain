# How to Get Your Google Client ID

## Step-by-Step Guide

### Step 1: Go to Google Cloud Console
1. Open your browser and go to: https://console.cloud.google.com/
2. Sign in with your Google account

### Step 2: Create or Select a Project
1. If you don't have a project, click "Create Project"
2. Give it a name like "EduChain App"
3. Click "Create"
4. If you already have projects, select an existing one from the dropdown

### Step 3: Enable Google+ API
1. In the left sidebar, click "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity Services"
3. Click on it and press "Enable"

### Step 4: Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in app name: "EduChain"
   - Add your email as developer contact
   - Save and continue

### Step 5: Create OAuth 2.0 Client ID
1. Application type: Choose "Web application"
2. Name: "EduChain Web Client"
3. Authorized JavaScript origins:
   - Add: `http://localhost:3000` (for development)
   - Add: `http://localhost:3001` (if needed)
4. Authorized redirect URIs:
   - Add: `http://localhost:3000`
   - Add: `http://localhost:3000/signup`
5. Click "Create"

### Step 6: Copy Your Client ID
1. You'll see a popup with your Client ID
2. It looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
3. Copy this Client ID

### Step 7: Update Your Code
Replace the placeholder in `client/src/components/Signup.js`:

```javascript
// Find this line in the file:
client_id: '123456789-abcdefghijklmnop.apps.googleusercontent.com', // Replace with your actual Google Client ID

// Replace it with your actual Client ID:
client_id: 'YOUR_ACTUAL_CLIENT_ID_HERE',
```

## Quick Test
1. Start your backend: `cd backend && node index.js`
2. Start your frontend: `cd client && npm start`
3. Go to signup page
4. You should see a Google sign-up button
5. Click it to test the OAuth flow

## Troubleshooting
- If you get "Invalid Client ID" error, double-check the Client ID
- If you get "Unauthorized" error, make sure you added `http://localhost:3000` to authorized origins
- If the button doesn't appear, check browser console for errors

## Security Notes
- Never commit your Client ID to public repositories
- For production, add your domain to authorized origins
- Consider using environment variables for the Client ID

Your Client ID is unique to your Google Cloud project and should be kept secure!


