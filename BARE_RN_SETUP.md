# StyleScan - Bare React Native Setup Complete

You've successfully converted StyleScan from Expo to a bare React Native app. This guide walks you through getting it running.

## What You Have

✅ **Bare React Native setup** (no Expo)
✅ **React Navigation** for screen navigation  
✅ **react-native-camera** for camera access
✅ **ML Kit** for face detection
✅ **OpenAI integration** for AI analysis
✅ **Dark-themed UI** with Material Design icons
✅ **TypeScript** for type safety

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd /Users/ryanbolt/Desktop/style-scan-app
npm install
```

### 2. Set Your OpenAI API Key
```bash
export REACT_APP_OPENAI_API_KEY="sk-your-actual-key-here"
```

Get your key from: https://platform.openai.com/api-keys

### 3. Install iOS Pods
```bash
cd ios && pod install && cd ..
```

### 4. Run on Your iPhone
```bash
npm run ios
```

> Make sure your iPhone is connected via USB cable and plugged into your Mac.

## Available Commands

```bash
npm start          # Start dev server (manual reset)
npm run ios        # Build and run on iPhone
npm run android    # Build and run on Android
npm run lint       # Check code style
npm run type-check # Type check TypeScript
```

## What's New

### New Directory Structure
- **`src/`** — All source code organized by feature
- **`src/screens/`** — Screen components
- **`src/navigation/`** — Navigation setup
- **`src/components/`** — Reusable UI
- **`src/utils/`** — API calls
- **`index.js`** — Entry point (new)

### New Navigation System
React Navigation replaces Expo Router:
- Stack-based navigation
- Type-safe route props
- More explicit navigation flow

### New Camera Library
react-native-camera replaces expo-camera:
- Same functionality
- More control over camera settings
- Better for bare RN

### New File Access
react-native-file-access replaces expo-file-system:
- Handles file operations
- Converts photos to base64 for API

## Documentation

- **[README.md](./README.md)** — Project overview and architecture
- **[SETUP.md](./SETUP.md)** — Detailed step-by-step setup (troubleshooting included)
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** — Common commands and shortcuts
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** — What changed from Expo to bare RN

## File Structure

```
StyleScan/
├── src/
│   ├── App.tsx                 Main app with navigation
│   ├── screens/                Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── ScanScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   ├── RecommendationsScreen.tsx
│   │   └── AboutScreen.tsx
│   ├── navigation/             Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   └── types.ts
│   ├── components/             Reusable components
│   │   ├── AppButton.tsx
│   │   └── Card.tsx
│   ├── hooks/                  Custom hooks
│   │   └── useFaceDetection.ts
│   ├── utils/                  Utilities & API
│   │   ├── scanApi.ts
│   │   ├── recommendApi.ts
│   │   └── types.ts
│   └── constants/              Theme & constants
│       └── theme.ts
├── ios/                        Native iOS project
├── android/                    Native Android project
├── index.js                    Entry point
├── app.json                    App config
├── babel.config.js            Babel configuration
├── metro.config.js            React Native bundler config
├── tsconfig.json              TypeScript configuration
├── package.json               Dependencies
└── README.md                  Project documentation
```

## Troubleshooting

### "Module not found" error
```bash
rm -rf node_modules ios/Pods
npm install
cd ios && pod install && cd ..
```

### Device not showing up
1. Unplug and replug your iPhone
2. Trust the computer when prompted
3. Try: `open ios/StyleScan.xcworkspace`

### "API key not set" error
Make sure you ran:
```bash
export REACT_APP_OPENAI_API_KEY="sk-..."
```

Or directly edit `src/utils/scanApi.ts` and add your key.

### Build fails
1. In Xcode: **Product → Clean Build Folder** (Cmd+Shift+K)
2. Try again: `npm run ios`
3. If still fails:
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData/StyleScan*
   npm run ios
   ```

## API Configuration

The app uses OpenAI GPT-4 Vision for face analysis and recommendations.

**Models:**
- Face analysis: `gpt-4-vision-preview`
- Recommendations: `gpt-4-turbo`

**Cost:** ~$0.01-0.05 per scan

**Environment Variable:**
```bash
export REACT_APP_OPENAI_API_KEY="sk-..."
```

## Development Workflow

### Running on Device
```bash
npm run ios
```

Wait for the build to complete. Xcode will show build progress.

### Making Changes
1. Edit files in `src/`
2. React Native will hot-reload automatically
3. For native code changes, rebuild: `npm run ios`

### Debugging
In Xcode: **View → Debug Area → Activate Console** (Cmd+Shift+C)

## Customization

### Change Colors
Edit `src/constants/theme.ts`

### Edit AI Prompts
- Face analysis: `src/utils/scanApi.ts`
- Recommendations: `src/utils/recommendApi.ts`

### Add New Screens
1. Create `src/screens/MyScreen.tsx`
2. Add to `src/navigation/RootNavigator.tsx`
3. Add type to `src/navigation/types.ts`

See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for detailed examples.

## Before Production

⚠️ **IMPORTANT**: Never ship the app with API keys hardcoded or exposed.

Before releasing to App Store:
1. Create a backend server you control
2. Move OpenAI API calls to your backend
3. Have the app call your backend instead
4. Store the API key securely on the server only

This prevents key theft, unauthorized API usage, and allows you to add rate limiting.

## Getting Help

- Check [SETUP.md](./SETUP.md) for detailed troubleshooting
- See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for common commands
- Review [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for what changed
- Read [README.md](./README.md) for project overview

## Next Steps

1. ✅ Complete the quick start above
2. 🔧 Customize colors and prompts to your liking
3. 📱 Test the full scan flow on your device
4. 🚀 Set up backend server before production release
5. 📦 Deploy to App Store when ready

## Useful Links

- React Native: https://reactnative.dev
- React Navigation: https://reactnavigation.org
- OpenAI: https://platform.openai.com/docs
- ML Kit Face Detection: https://developers.google.com/ml-kit/vision/face-detection

---

**Ready to go!** Run `npm run ios` and test the app on your iPhone. 🎉
