# Apple Sign-in Setup Guide

## To enable Apple Sign-in functionality:

### 1. Create Apple Developer Account
1. Go to [Apple Developer](https://developer.apple.com/)
2. Sign in with your Apple ID
3. Enroll in the Apple Developer Program ($99/year) or use a free account for testing

### 2. Create App ID
1. Go to "Certificates, Identifiers & Profiles"
2. Click "Identifiers" → "+" → "App IDs"
3. Choose "App" and click "Continue"
4. Fill in:
   - Description: "EduChain"
   - Bundle ID: "com.yourcompany.educhain"
   - Enable "Sign In with Apple" capability
5. Click "Continue" and "Register"

### 3. Create Services ID
1. Go to "Identifiers" → "+" → "Services IDs"
2. Fill in:
   - Description: "EduChain Web"
   - Identifier: "com.yourcompany.educhain.web"
3. Click "Continue" and "Register"
4. Click on your Services ID
5. Check "Sign In with Apple" and click "Configure"
6. Add your domain: `localhost:3000`
7. Add return URL: `http://localhost:3000/signup`

### 4. Create Private Key
1. Go to "Keys" → "+"
2. Name: "EduChain Sign In with Apple Key"
3. Check "Sign In with Apple" and click "Configure"
4. Select your App ID and click "Save"
5. Click "Continue" and "Register"
6. Download the key file (.p8)

### 5. Update Your Code
Replace the placeholder in `client/src/components/Signup.js`:

```javascript
clientId: 'YOUR_APPLE_CLIENT_ID_HERE', // Replace with your Services ID
```

### 6. Test the Implementation
1. Start your backend: `cd backend && node index.js`
2. Start your frontend: `cd client && npm start`
3. Go to signup page
4. Click "Sign up with Apple"
5. Complete Apple authentication

## Current Implementation Features:

✅ **Apple Sign-in Button** - Real Apple OAuth integration
✅ **Backend Support** - Handles Apple user creation/login
✅ **Role Selection** - Apple users can choose educator/student role
✅ **Error Handling** - Proper error messages for failed authentication
✅ **Google + Apple** - Both social login options available

## Important Notes:

- Apple Sign-in requires HTTPS in production
- For development, you can use localhost
- The Apple button will show an error until you add a real Client ID
- Apple Sign-in is more restrictive than Google OAuth

## Next Steps:

1. Get your Apple Developer account set up
2. Create your Services ID
3. Replace the placeholder Client ID
4. Test the Apple sign-in flow

The Apple button will appear on the signup page alongside the Google button!


