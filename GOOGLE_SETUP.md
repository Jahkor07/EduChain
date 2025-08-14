# Google OAuth Setup Guide

## To enable Google Sign-up functionality:

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
7. Copy the Client ID

### 2. Update the Client ID

Replace the placeholder Client ID in `client/src/components/Signup.js`:

```javascript
client_id: 'YOUR_ACTUAL_GOOGLE_CLIENT_ID_HERE',
```

### 3. Test the Implementation

1. Start the backend server: `cd backend && node index.js`
2. Start the frontend: `cd client && npm start`
3. Go to signup page
4. Click "Sign up with Google"
5. Complete Google authentication

## Current Implementation Features:

✅ **Password Confirmation** - Users must confirm their password
✅ **Google Sign-up Button** - Real Google OAuth integration
✅ **Backend Support** - Handles Google user creation/login
✅ **Role Selection** - Google users can choose educator/student role
✅ **Error Handling** - Proper error messages for failed authentication

## Next Steps:

1. Get your actual Google Client ID
2. Replace the placeholder in the code
3. Test the Google sign-up flow
4. Implement Apple Sign-in (similar process)

The Google button will appear on the signup page and handle the entire OAuth flow automatically!


