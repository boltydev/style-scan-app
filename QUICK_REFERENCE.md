# Bare React Native StyleScan - Quick Reference

Fast reference guide for common commands and tasks.

## Quick Setup (First Time)

```bash
# 1. Install Node packages
npm install

# 2. Set API key
export REACT_APP_OPENAI_API_KEY="sk-your-actual-key-here"

# 3. Install iOS dependencies
cd ios && pod install && cd ..

# 4. Run on iPhone
npm run ios
```

## Common Commands

```bash
# Start dev server
npm start

# Build and run on iPhone
npm run ios

# Build and run on Android
npm run android

# Open Xcode workspace
open ios/StyleScan.xcworkspace

# Type check
npm run type-check

# Lint code
npm run lint
```

## Xcode Shortcuts

| Action | Shortcut |
|--------|----------|
| Build | Cmd+B |
| Run | Cmd+R |
| Stop | Cmd+. |
| Clean Build | Cmd+Shift+K |
| Console | Cmd+Shift+C |
| Build Settings | Cmd+, |

## File Locations

| Component | Location |
|-----------|----------|
| Screens | `src/screens/` |
| Components | `src/components/` |
| Navigation | `src/navigation/` |
| API Calls | `src/utils/` |
| Colors & Theme | `src/constants/theme.ts` |
| Face Detection | `src/hooks/useFaceDetection.ts` |
| Types | `src/utils/types.ts` |

## Customization

### Change Colors
Edit `src/constants/theme.ts`:
```typescript
export const Colors = {
  primary: "#7C5CFF",      // Main purple
  background: "#0F0F14",   // Dark background
};
```

### Edit AI Analysis Prompt
File: `src/utils/scanApi.ts`
Look for `const systemPrompt` and `const userPrompt`

### Edit Recommendation Prompt
File: `src/utils/recommendApi.ts`
Look for `const systemPrompt` and `const userPrompt`

### Add New Screen
1. Create `src/screens/MyScreen.tsx`
2. Add to `src/navigation/RootNavigator.tsx`:
   ```tsx
   <Stack.Screen name="MyScreen" component={MyScreen} options={{ title: "My Screen" }} />
   ```
3. Add type to `src/navigation/types.ts`:
   ```tsx
   MyScreen: undefined;
   ```
4. Navigate to it:
   ```tsx
   navigation.navigate('MyScreen')
   ```

## API Models

- **Face Analysis**: `gpt-4-vision-preview`
- **Recommendations**: `gpt-4-turbo`
- **Est. Cost**: $0.01-0.05 per scan

## Cache Clearing

```bash
# Clear all caches
rm -rf node_modules ios/Pods ~/Library/Developer/Xcode/DerivedData/StyleScan*
npm install
cd ios && pod install && cd ..
```

## Environment Setup

### Set API Key (Session)
```bash
export REACT_APP_OPENAI_API_KEY="sk-..."
```

### Set API Key (Permanent - macOS)
Add to `~/.zprofile`:
```bash
export REACT_APP_OPENAI_API_KEY="sk-..."
```

Then reload:
```bash
source ~/.zprofile
```

## Debugging

### View Device Logs
In Xcode: **View → Debug Area → Activate Console** (Cmd+Shift+C)

### View App Network Calls
Use Charles Proxy or similar network sniffer to inspect API calls to OpenAI.

### Device Not Showing Up
```bash
# Unplug and replug
# Or restart Xcode
# Check: Xcode > Window > Devices and Simulators
```

## Troubleshooting Commands

```bash
# Rebuild from scratch
npm run ios -- --clean

# Clear derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Reinstall pods
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

# Force React Native cache clear
npm start -- --reset-cache
```

## File Structure

```
project/
  src/
    App.tsx              Main app
    screens/             Screen components
      HomeScreen.tsx
      ScanScreen.tsx
      ResultsScreen.tsx
      RecommendationsScreen.tsx
      AboutScreen.tsx
    navigation/
      RootNavigator.tsx
      types.ts
    components/
      AppButton.tsx
      Card.tsx
    hooks/
      useFaceDetection.ts
    utils/
      scanApi.ts
      recommendApi.ts
      types.ts
    constants/
      theme.ts
  ios/                   Native iOS project
  android/               Native Android project
  index.js               Entry point
  app.json               App config
  package.json
  tsconfig.json
```

## API Usage

### Call Face Scan API
```typescript
import { scanFace } from '../utils/scanApi';

const result = await scanFace(photoUri, faceGeometry);
// Returns: ScanResult
```

### Call Recommendations API
```typescript
import { getRecommendations } from '../utils/recommendApi';

const recs = await getRecommendations(scanResult);
// Returns: RecommendationResult
```

## Testing

### Test Without Camera
Temporarily modify `ScanScreen.tsx` to use a pre-existing photo URI for testing.

### Test Without API Key
App will throw error if `REACT_APP_OPENAI_API_KEY` is not set. Set it to test.

## Before Production

1. **Never hardcode API keys** in the app
2. **Move API calls to backend** server you control
3. **Store keys on server only** (use backend to proxy requests)
4. **Add rate limiting** to prevent abuse
5. **Monitor API costs** on OpenAI dashboard

## Useful Links

- React Native: https://reactnative.dev
- React Navigation: https://reactnavigation.org
- OpenAI: https://platform.openai.com/docs
- ML Kit: https://developers.google.com/ml-kit

