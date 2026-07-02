# StyleScan

A bare React Native iOS app that scans your face and gets AI-powered hairstyle and beard style recommendations.

## What it does

1. **Home screen** — explains the app, button to start a scan, link to About
2. **Scan screen** — opens the front camera, lets you take and confirm a photo
3. **On-device detection** — ML Kit finds your face and basic geometry, fast and private
4. **AI scan** — OpenAI GPT-4 Vision analyzes the photo and returns face shape, skin tone,
   and facial hair type as structured data
5. **Results screen** — shows that data in simple cards
6. **Recommendations screen** — sends the scan data to GPT-4 Turbo to get hairstyle and beard style suggestions
7. **About screen** — simple info page

## Tech Stack

- **React Native 0.83** — Native iOS/Android app
- **React Navigation** — Screen navigation
- **react-native-camera** — Camera access
- **ML Kit Face Detection** — On-device face analysis
- **OpenAI GPT-4** — Cloud-based AI analysis
- **TypeScript** — Type-safe development

## Project Structure

```
src/
  App.tsx                   Main app with navigation setup
  screens/
    HomeScreen.tsx          Welcome screen
    ScanScreen.tsx          Camera & capture
    ResultsScreen.tsx       Display scan results
    RecommendationsScreen.tsx
                            Display AI recommendations
    AboutScreen.tsx         Info page
  navigation/
    RootNavigator.tsx       Navigation stack
    types.ts                Navigation types
  components/
    AppButton.tsx           Reusable button
    Card.tsx                Reusable card
  hooks/
    useFaceDetection.ts     ML Kit wrapper
  utils/
    types.ts                TypeScript interfaces
    scanApi.ts              OpenAI API for analysis
    recommendApi.ts         OpenAI API for recommendations
  constants/
    theme.ts                Colors, spacing, typography
index.js                    Entry point
app.json                    App config
package.json
tsconfig.json
```

## Setup

### 1. Install Node dependencies

```bash
npm install
```

### 2. Get an OpenAI API key

1. Visit https://platform.openai.com/api-keys
2. Create a new secret key
3. Keep it safe (you can only view it once)

### 3. Set your API key

```bash
# Using environment variable (recommended)
export REACT_APP_OPENAI_API_KEY="sk-your-actual-key-here"

# Or edit the files directly (for local testing only):
# src/utils/scanApi.ts
# src/utils/recommendApi.ts
# Replace "YOUR_OPENAI_API_KEY" with your actual key
```

### 4. Install Xcode command-line tools (if needed)

```bash
xcode-select --install
```

### 5. Install CocoaPods

```bash
sudo gem install cocoapods
```

### 6. Install iOS native dependencies

```bash
cd ios
pod install
cd ..
```

### 7. Run on your device

**Using React Native CLI:**
```bash
npm run ios
```

**Or using Xcode:**
```bash
open ios/StyleScan.xcworkspace
# Then press Cmd+R to run on connected device
```

> **Note**: App requires a physical iOS device or simulator. Make sure you select your device in Xcode before running.

## Configuration

### Grant Camera Permission

When the app first launches, it will ask for camera permission. Tap **Allow**.

The permission is configured in the native iOS project (`Info.plist`).

### Customize AI Prompts

Edit these files to change how the AI analyzes faces:
- `src/utils/scanApi.ts` — Face analysis prompt
- `src/utils/recommendApi.ts` — Recommendation prompt

### Change Colors & Styling

All colors, spacing, and corner radius values are in `src/constants/theme.ts`. Edit there and changes apply everywhere.

## API Models

- **GPT-4 Vision** (`gpt-4-vision-preview`) — Analyzes face photos
- **GPT-4 Turbo** (`gpt-4-turbo`) — Generates recommendations

Estimated cost: ~$0.01-0.05 per scan

## Troubleshooting

### "Pod install failed"
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### "No camera access"
- Check that the app has camera permission (Settings → StyleScan → Camera)
- Rebuild the app

### "API key not set" error
- Verify `REACT_APP_OPENAI_API_KEY` is set
- Or directly edit `src/utils/scanApi.ts` and `src/utils/recommendApi.ts`

### Build failures
```bash
# Clear all caches
rm -rf node_modules ios/Pods
npm install
cd ios && pod install && cd ..

# Try building again
npm run ios
```

## Before Production

**IMPORTANT**: Never ship an app with API keys hardcoded or in environment files visible to users.

Before releasing to the App Store:
1. Move API calls to a backend server you control
2. Have your app communicate with your backend instead of OpenAI directly
3. Your backend securely stores the API key

Example backend (Node.js + Express):
```javascript
app.post('/api/scan', async (req, res) => {
  const { photoBase64 } = req.body;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Server-side only!
    },
    body: JSON.stringify({ /* ... */ }),
  });
  
  return res.json(await response.json());
});
```

## Development

### Available Scripts

- `npm start` — Start development server
- `npm run ios` — Build and run on iOS
- `npm run android` — Build and run on Android
- `npm run lint` — Check code style
- `npm run type-check` — Run TypeScript compiler

### Editing Native Code

If you need to modify native iOS code:
1. Open `ios/StyleScan.xcworkspace` in Xcode
2. Navigate to `StyleScan` project → `StyleScan` target
3. Edit Swift/Objective-C files as needed
4. Rebuild from Xcode or run `npm run ios`

## License

MIT

- **Swap the AI provider**: both API files use a plain `fetch()` call — swap the
  URL/headers/body to use OpenAI or another provider if you prefer

## Data flow (for reference)

```
Camera photo
   ↓
ML Kit (on-device) → rough face geometry
   ↓
OpenAI (scanApi.ts) → { faceShape, skinTone, facialHair, summary }
   ↓
Results screen displays this
   ↓
OpenAI (recommendApi.ts) → { hairstyles[], beardStyles[], summary }
   ↓
Recommendations screen displays this
```
