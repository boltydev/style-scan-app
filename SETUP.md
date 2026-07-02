# Bare React Native StyleScan Setup Guide

Complete step-by-step guide to get StyleScan running on your iOS device with bare React Native (no Expo).

## Overview

StyleScan is a React Native app that:
1. Uses your iPhone's front camera to take a photo of your face
2. Runs ML Kit face detection on-device (fast and private)
3. Sends the photo to OpenAI's GPT-4 Vision to analyze your face shape, skin tone, and facial hair
4. Gets AI-powered hairstyle and beard style recommendations tailored to you
5. Displays everything in a beautiful, dark-themed app

## Prerequisites

Before you start, you'll need:

1. **macOS** — This setup is for Mac only (iOS development requires macOS)
2. **Xcode 15+** — [Download from App Store](https://apps.apple.com/us/app/xcode/id497799835?mt=12)
3. **Node.js 18+** — [Download here](https://nodejs.org/)
4. **An iPhone** to test on (physical device required)
5. **Apple Developer account** (free) for code signing
6. **OpenAI account with API access** — [Sign up here](https://platform.openai.com/)

## Step-by-Step Setup

### Step 1: Install Node.js

Download from https://nodejs.org/ and install the LTS version.

Verify installation:
```bash
node --version
npm --version
```

### Step 2: Install Xcode Command-Line Tools

```bash
xcode-select --install
```

### Step 3: Install CocoaPods

CocoaPods manages iOS native dependencies.

```bash
sudo gem install cocoapods
```

If prompted for password, enter your Mac password.

### Step 4: Clone and Install Dependencies

Navigate to your project:

```bash
cd /Users/ryanbolt/Desktop/style-scan-app
npm install
```

This installs all JavaScript/React Native packages.

### Step 5: Get Your OpenAI API Key

1. Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Copy the key and store it somewhere safe (you can only view it once!)
4. **DO NOT** share this key or commit it to git

### Step 6: Set Your API Key

In the terminal, set the environment variable:

```bash
export REACT_APP_OPENAI_API_KEY="sk-your-actual-key-here"
```

Replace `sk-your-actual-key-here` with your actual key from Step 5.

**Alternative**: If you prefer, you can edit the files directly:
- `src/utils/scanApi.ts` — Replace `"YOUR_OPENAI_API_KEY"`
- `src/utils/recommendApi.ts` — Replace `"YOUR_OPENAI_API_KEY"`

But using the environment variable is cleaner and safer.

### Step 7: Install iOS Native Dependencies

This downloads native libraries for camera access, face detection, etc.

```bash
cd ios
pod install
cd ..
```

This may take 5-10 minutes on first run. Be patient and let it complete.

### Step 8: Connect Your iPhone

1. Plug your iPhone into your Mac with a USB cable
2. On your phone, tap **"Trust"** when prompted
3. On your Mac, in Xcode, go **Window → Devices and Simulators** to verify your device shows up

### Step 9: Build and Run

Using React Native CLI:
```bash
npm run ios
```

Or using Xcode:
```bash
open ios/StyleScan.xcworkspace
```

Then in Xcode:
1. At the top left, make sure your iPhone is selected (not a simulator)
2. Press **Cmd+R** to build and run
3. Wait for the build to complete (first build takes 2-3 minutes)
4. The app should launch on your phone

> **Important**: Always open the `.xcworkspace` file, never `.xcodeproj`

### Step 10: Grant Camera Permission

When the app launches, it will ask for camera permission. Tap **Allow**.

### Step 11: Test the App

1. Tap **"Start Face Scan"** on the home screen
2. Center your face in the oval guide
3. Make sure you have good lighting
4. Tap the white shutter button to capture
5. Review the photo and tap **"Use This Photo"**
6. Wait while the app analyzes your face (10-15 seconds)
7. See your scan results
8. Tap **"Get Style Recommendations"** to see AI suggestions

## Architecture

### Directory Structure

```
src/
  App.tsx                   Main app entry, navigation setup
  screens/                  Screen components
  navigation/              Navigation configuration
  components/              Reusable UI components
  hooks/                   Custom React hooks
  utils/                   API calls & utilities
  constants/               Theme colors, spacing
```

### How It Works

1. **Home Screen** → User taps "Start Face Scan"
2. **Scan Screen** → User takes a photo
3. **ML Kit Detection** → On-device face detection extracts geometry
4. **OpenAI Analysis** → Photo + geometry sent to GPT-4 Vision API
5. **Results Screen** → Face shape, skin tone, facial hair displayed
6. **Recommendations Screen** → Scan data sent to GPT-4 Turbo for suggestions
7. **Display** → Hairstyle and beard recommendations shown to user

## Troubleshooting

### "command not found: xcode-select"
Install Xcode from App Store first, then run:
```bash
xcode-select --install
```

### "Pod install failed"
Clear CocoaPods cache and try again:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### "Build failed" or "Cannot connect to device"
1. Unplug phone and plug back in
2. In Xcode: **Product → Clean Build Folder** (Cmd+Shift+K)
3. Try building again
4. If still failing:
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData/StyleScan*
   npm run ios
   ```

### "No face detected" when scanning
- Make sure you have good lighting (preferably not backlit)
- Try scanning from different angles
- Make sure your entire face is visible in the oval guide
- Avoid extreme angles or shadows

### "API key not set" error
- Verify you ran: `export REACT_APP_OPENAI_API_KEY="sk-..."`
- Or directly edit `src/utils/scanApi.ts` and add your key there
- Make sure your key starts with `sk-`

### App crashes on startup
1. Check the Xcode console for error messages (**Cmd+Shift+C**)
2. Ensure camera permission was granted
3. Verify your API key is correct
4. Rebuild from scratch:
   ```bash
   rm -rf node_modules ios/Pods
   npm install
   cd ios && pod install && cd ..
   npm run ios
   ```

### "NSCameraUsageDescription" or permission errors
The app's Info.plist already has the camera permission. If you still get errors:
1. In Xcode, select **StyleScan** project → **StyleScan** target → **Info**
2. Verify "Privacy - Camera Usage Description" exists
3. If not, add it with value: "StyleScan uses your camera to scan your face."

### Phone not showing up in Xcode
1. Disconnect and reconnect your iPhone
2. Trust the Mac again on your phone
3. Go to Xcode: **Window → Devices and Simulators**
4. Your phone should appear in the list

## Environment Variables

The app looks for `REACT_APP_OPENAI_API_KEY` environment variable.

To set it persistently (so it works every time you open the terminal):

**macOS (add to ~/.zprofile or ~/.bash_profile):**
```bash
export REACT_APP_OPENAI_API_KEY="sk-your-actual-key-here"
```

Then reload your terminal:
```bash
source ~/.zprofile
```

## Before Production

**NEVER release the app with API keys exposed.**

Before shipping to App Store:
1. Create a backend server (Node.js, Python, etc.) that you control
2. Move all OpenAI API calls to your backend
3. Have the app call your backend instead of OpenAI directly
4. Store the API key securely on your backend only

This prevents:
- Key theft and unauthorized API usage
- Malicious users reverse-engineering your app
- Accidental key commits to git

## Common Tasks

### Update AI Prompts
Edit `src/utils/scanApi.ts` and `src/utils/recommendApi.ts` to change how the AI analyzes faces.

### Change Colors
Edit `src/constants/theme.ts` — all colors, spacing, and corner radius values are there.

### Add a New Screen
1. Create `src/screens/MyNewScreen.tsx`
2. Add import to `src/navigation/RootNavigator.tsx`
3. Add `<Stack.Screen name="MyNewScreen" ... />` to the Stack
4. Add type to `src/navigation/types.ts`

### Debug Native Issues
If you need to debug Objective-C/Swift code:
1. Open `ios/StyleScan.xcworkspace` in Xcode
2. Set breakpoints in Swift files
3. Run with **Cmd+R** and breakpoints will pause execution

## Still Having Issues?

1. Check the full [README.md](./README.md)
2. Review Xcode console output for error messages
3. Ensure all prerequisites are installed and up to date
4. Try the nuclear option: `rm -rf node_modules ios/Pods && npm install && cd ios && pod install && cd ..`
5. Rebuild from Xcode: **Product → Clean Build Folder**, then **Cmd+R**

## Next Steps

1. Customize the app look by editing colors in `src/constants/theme.ts`
2. Tweak AI prompts in `src/utils/scanApi.ts` and `recommendApi.ts`
3. Add more screens and navigation as needed
4. Set up your backend before releasing to App Store
5. Deploy to TestFlight for beta testing

## Useful Links

- React Native docs: https://reactnative.dev
- React Navigation docs: https://reactnavigation.org
- OpenAI API docs: https://platform.openai.com/docs
- ML Kit docs: https://developers.google.com/ml-kit/vision/face-detection


## Need Help?

- Check the main [README.md](./README.md)
- Review the Expo documentation: [https://docs.expo.dev](https://docs.expo.dev)
- OpenAI API docs: [https://platform.openai.com/docs](https://platform.openai.com/docs)
