# Firebase Deployment Guide

## Prerequisites

Before deploying, ensure you have:

- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase account and project set up
- Local changes tested and working

## A) Deploying Landing Page Changes

### 1. Update Version Info of Landing Page

- Update version in `src/environments/environment.ts` and `environment.prod.ts`
- Update `assets/logs/change-logs/CHANGELOG.md` with new changes of Landing Page
  - z-control QR Code Generator app and other future apps have their own landing page.

### 2. Build the Landing Page

```powershell
cd " path\to\your\landing-page"
ionic build --prod
```

### 3. Deploy to Firebase

```powershell
# Login to Firebase (if not already logged in)
firebase login

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### 4. Verify Deployment

- Check the Firebase console for deployment status
- Visit your landing page URL to verify changes
- Test privacy policy links: `/privacy/basic/en` and `/privacy/basic/de`

---

## B) Deploying z-control QR Code Generator App Changes

### Initial Step: Update Privacy Policy Links in QR Code App

First, update the privacy policy links in your z-control QR Code Generator app to point to the landing page:

```typescript
// In z-control QR Code Generator app, update privacy policy links to:
const privacyPolicyUrl = "https://z-control-4070.web.app/privacy/basic/en";
const privacyPolicyUrlDe = "https://z-control-4070.web.app/privacy/basic/de";
```

### 1. Update change log of z-control QR Code Generator app

- Update `assets/logs/change-logs/CHANGELOG_QR-CODE.md` with new changes

### 2. Build the z-control QR Code Generator App

```powershell
cd "C:\SOURCE-ACTIVE\ionic\qr-code"
npm run build
```

### 3. Deploy z-control QR Code Generator App

**Option A: If z-control QR Code Generator App is in a SEPARATE Firebase project**

```powershell
# Switch to the QR Code app project
firebase use your-qr-code-project-id

# Deploy (same command as landing page)
firebase deploy --only hosting
```

**Option B: If z-control QR Code Generator App is in the SAME Firebase project but different hosting target**

```powershell
# Deploy to specific hosting target
firebase deploy --only hosting:qr-code-target-name
```

**Option C: If z-control QR Code Generator App is a mobile app (Capacitor/Cordova)**

```powershell
# Build for mobile platforms
ionic capacitor build ios
ionic capacitor build android

# Then deploy through App Store/Play Store (not Firebase Hosting)
```

**To check your current setup:**

```powershell
# See which Firebase project you're using
firebase projects:list
firebase use

# See hosting targets in current project
firebase target
```

---

## C) Adding New App to Landing Page

### 1. Update Privacy Service (if needed)

Add new policy types in `privacy.service.ts`:

```typescript
private availablePolicies: PrivacyPolicyMeta[] = [
  {
    type: 'qr-code-generator',
    languages: ['en', 'de'],
    description: 'Standard privacy policy for z-control QR Code App',
  },
  {
    type: 'premium',
    languages: ['en', 'de'],
    description: 'Privacy policy for premium features',
  },
  {
    type: 'new-app',  // Add new app type
    languages: ['en', 'de'],
    description: 'Privacy policy for New App Name',
  },
];
```

### 2. Create New Policy Templates

Create HTML files in assets:

```
src/assets/privacy/policies/
└── new-app/
    ├── new-app-en.html
    └── new-app-de.html
```

### 3. Update Routes (if needed)

The existing route structure already supports new apps:

```typescript
// This route will automatically work for new apps:
{
  path: 'privacy/:type/:language',
  // Will handle /privacy/new-app/en automatically
}
```

### 4. Update Landing Page Content

Add links/buttons for the new app in your landing page components.

### 5. Update Version and Date

```powershell
cd " path\to\your\landing-page"
update values in .env.local
npm run generate-env
check values with ionic serve
```


### 6. Build and Deploy

```powershell
cd " path\to\your\landing-page"
npm run build --prod
firebase deploy --only hosting
```

---

## Firebase Configuration Files

### firebase.json Structure

Your `firebase.json` should look like this:

```json
{
  "hosting": [
    {
      "target": "landing-page",
      "public": "www",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ]
}
```

---

## Deployment Checklist

### Before Each Deployment:

1. **Test Locally**

   ```powershell
   npm start
   # Test all privacy policy links
   # Test language switching
   # Test responsive design
   ```

2. **Build Successfully**

   ```powershell
   npm run build
   # Check for any build errors
   ```

3. **Check File Sizes**
   ```powershell
   # Ensure www/ folder is created and contains built files
   ls www/
   ```

### After Deployment:

1. **Verify URLs Work**
- z-control QR Code App (English): `https://z-control-4070.web.app/privacy/basic/en`
- z-control QR Code App (German): `https://z-control-4070.web.app/privacy/basic/de`
- Landing Page App (English): `https://z-control-4070.web.app/privacy/landing-page/en`
- Landing Page App (German): `https://z-control-4070.web.app/privacy/landing-page/de`
- Future Premium Features (English): `https://z-control-4070.web.app/privacy/premium/en`
- Future Premium Features (German): `https://z-control-4070.web.app/privacy/premium/de`

1. **Test From z-control QR Code Generator App**

   - Ensure privacy links from z-control QR Code Generator app point to correct URLs
   - Test both English and German versions

2. **Check Analytics** (if enabled)
   - Monitor Firebase Analytics for any 404 errors
   - Check page load times

---

## Quick Commands Reference

```powershell
#update environment files - insert secrete firebase values and version infos
update values in .env.local
npm run generate-env
check values with ionic serve

# Build and deploy landing page
cd " path\to\your\landing-page"
npm run build --prod && firebase deploy --only hosting

# Build and deploy specific target
firebase deploy --only hosting:target-name

# Preview before deploying
firebase hosting:channel:deploy preview

# Check deployment status
firebase projects:list
firebase hosting:sites:list
```

---

## Quick Decision Guide: Which Deployment Command?

### Step 1: Determine z-control QR Code Generator App Type

**Answer these questions:**

1. **Is z-control QR Code Generator app a web app or mobile app?**

   - Web app → Continue to Step 2
   - Mobile app (iOS/Android) → Use Option C (App Store/Play Store)

2. **If web app: Do you have separate Firebase projects for Landing Page and z-control QR Code Generator app?**
   - Yes, separate projects → Use Option A
   - No, same project → Use Option B

### Step 2: Check Your Current Setup

Run these commands to see your current configuration:

```powershell
# Check which Firebase project you're currently using
firebase use

# See all your Firebase projects
firebase projects:list

# Check hosting targets (if using same project)
firebase target
```

### Most Common Scenarios

**Scenario 1: Both apps in same Firebase project**

- Landing page deploys to main hosting
- z-control QR Code Generator app deploys to different hosting target
- Command: `firebase deploy --only hosting:qr-code-target-name`

**Scenario 2: Separate Firebase projects**

- Each app has its own Firebase project
- Need to switch projects before deploying
- Commands: `firebase use qr-code-project-id` then `firebase deploy --only hosting`

---

## Troubleshooting

### Common Issues

1. **404 Errors on Privacy Pages**

   - Check that `www/assets/privacy/policies/` folder exists after build
   - Verify HTML files are included in build output

2. **Build Failures**

   - Run `npm install` to ensure dependencies are up to date
   - Check for TypeScript errors: `ng build --prod`

3. **Firebase Auth Issues**
   - Run `firebase login` again
   - Check project permissions in Firebase console

### Testing URLs

- Local: `http://localhost:4200/privacy/basic/en`
- Production: `https://z-control-4070.web.app/privacy/basic/en`

## **Concrete Implementation of Landing Page with z-control QR Code Generator App**

### File Structure

```powershell
z-control/
|
├── landing/           #  all objects of www folder from landing-page app
|
├── qr-code/           #  all objects of www folder from qr-code app
|
|-- firebase.json
```

### firebase.json  

In z-control folder is the the following firebase.json file.  

```json
{
  "hosting": [
    {
      "target": "z-control-4070",
      "public": "landing",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    },
    {
      "target": "z-control-qr-code",
      "public": "qr-code",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ]
}
```  

### Firebase commands for deploying  

These commands are used from within folder z-control:  

abstract deploy command:

```powershell
firebase deploy --only hosting:qr-code-target-name
```

deploy landingPage:  

```powershell
firebase deploy --only hosting:z-control-4070
```

deploy qr-code:  

```powershell
firebase deploy --only hosting:z-control-qr-code
```

deploy both:  

```powershell
firebase deploy --only hosting
```

## Deploying Cloud Functions with GitHub Token

Important: use Landing Page folder structure
Before deploying your cloud functions, set the GitHub token from your `.env.local`:

```powershell
firebase functions:config:set github.token="YOUR_GITHUB_TOKEN"
```

You only need to run this when the token changes or on first setup.  
After setting, deploy your functions:

```powershell
firebase deploy --only functions
```

---

## What To Do When You Change Cloud Function Code

If you make changes to your cloud function code (for example, updating `functions/src/githubAnalytics.ts`):

1. **Test Locally (optional):**
   - Run unit tests or use the Firebase emulator to verify your changes.

2. **Update GitHub Token (if changed):**
   - If you updated the token in `.env.local`, run:
     ```powershell
     firebase functions:config:set github.token="YOUR_GITHUB_TOKEN"
     ```
   - If the token did not change, you can skip this step.

3. **Deploy Cloud Functions:**
   - Deploy only the functions (no need to redeploy hosting unless frontend changed):
     ```powershell
     firebase deploy --only functions
     ```

4. **Verify Deployment:**
   - Check the Firebase console for function logs and status.
   - Confirm that analytics data is being updated in Firestore as expected.

**Note:**  
You do not need to rebuild or redeploy your frontend unless you also changed frontend code.

---