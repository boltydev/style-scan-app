# Migration from Expo to Bare React Native

This document explains what changed when converting StyleScan from Expo to bare React Native.

## What Changed

### 1. Project Structure
**Before (Expo):**
```
app/
  _layout.tsx (Expo Router)
  index.tsx
  scan.tsx
  results.tsx
```

**After (Bare RN):**
```
src/
  App.tsx (React Navigation setup)
  screens/
    HomeScreen.tsx
    ScanScreen.tsx
    ResultsScreen.tsx
  navigation/
    RootNavigator.tsx
    types.ts
  components/
  hooks/
  utils/
  constants/
index.js (Entry point)
```

### 2. Dependencies Removed
- `expo` - The entire Expo framework
- `expo-camera` - Expo's camera module
- `expo-file-system` - Expo's file system
- `expo-router` - Expo's file-based routing
- `expo-status-bar` - Expo's status bar
- `@expo/vector-icons` - Replaced with react-native-vector-icons

### 3. Dependencies Added
- `@react-navigation/native` - Navigation library
- `@react-navigation/native-stack` - Stack navigator
- `react-native-camera` - Native camera access
- `react-native-vector-icons` - Icon library
- `react-native-file-access` - File system access
- `react-native-gesture-handler` - Touch handling
- `react-native-reanimated` - Animations

### 4. Navigation Changes

**Expo Router (File-based routing):**
```tsx
// app/index.tsx - automatically creates "/" route
export default function HomeScreen() { ... }

// Navigation via router object
const router = useRouter();
router.push("/scan");
```

**React Navigation (Code-based routing):**
```tsx
// src/navigation/RootNavigator.tsx
<Stack.Screen name="Home" component={HomeScreen} />

// Navigation via navigation prop
navigation.navigate('Scan');
```

### 5. Camera Changes

**Expo:**
```tsx
import { CameraView } from 'expo-camera';
<CameraView ref={cameraRef} facing="front" />
```

**Bare RN:**
```tsx
import { RNCamera } from 'react-native-camera';
<RNCamera
  ref={cameraRef}
  type={RNCamera.Constants.Type.front}
/>
```

### 6. File System Changes

**Expo:**
```tsx
import * as FileSystem from 'expo-file-system';
const base64 = await FileSystem.readAsStringAsync(photoUri, {
  encoding: FileSystem.EncodingType.Base64,
});
```

**Bare RN:**
```tsx
import { FileAccess } from 'react-native-file-access';
const base64 = await FileAccess.readFile(photoUri, 'base64');
```

### 7. Icons Changes

**Expo:**
```tsx
import { Ionicons } from '@expo/vector-icons';
<Ionicons name="camera" size={24} color="white" />
```

**Bare RN:**
```tsx
import Icon from 'react-native-vector-icons/Ionicons';
<Icon name="camera" size={24} color="white" />
```

### 8. Entry Point

**Expo:**
```json
// package.json
"main": "expo-router/entry"
```

**Bare RN:**
```javascript
// index.js - New entry point
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

### 9. App Configuration

**Expo (app.json):**
```json
{
  "expo": {
    "name": "StyleScan",
    "slug": "style-scan-app",
    "plugins": ["expo-router", ["expo-camera", { ... }]],
    ...
  }
}
```

**Bare RN (app.json):**
```json
{
  "name": "StyleScan",
  "displayName": "StyleScan",
  "version": "1.0.0"
}
```

Camera permissions are now handled in native iOS/Android projects:
- iOS: `ios/StyleScan/Info.plist` → `NSCameraUsageDescription`
- Android: `android/app/src/main/AndroidManifest.xml` → `<uses-permission>`

### 10. Build Process

**Expo:**
```bash
npx expo prebuild --clean  # Generate native projects
npx expo run:ios           # Build and run
```

**Bare RN:**
```bash
npm run ios                # Equivalent to: react-native run-ios
# Or use Xcode directly
open ios/StyleScan.xcworkspace
```

## Benefits of Bare React Native

1. **More Control** — Full access to native iOS and Android code
2. **Better Performance** — No Expo overhead
3. **More Native Features** — Can use any native module
4. **Smaller Bundle Size** — Only dependencies you need
5. **Easier Deployment** — Direct App Store submission
6. **Zero Limitations** — No Expo SDK version constraints

## Trade-offs

1. **More Setup** — No automatic native project generation
2. **Manual Linking** — Must manually link some native modules
3. **Build Complexity** — Need to understand Xcode, CocoaPods, Gradle
4. **Platform Maintenance** — Must keep iOS and Android projects in sync

## Migration Path

If you were already on Expo, this project already has:
1. ✅ Native iOS project generated (`ios/` folder)
2. ✅ All Expo dependencies removed
3. ✅ React Navigation set up
4. ✅ Native camera integration
5. ✅ All screens converted
6. ✅ All utilities updated

Everything is ready to go!

## References

- [React Native Docs](https://reactnative.dev)
- [React Navigation Docs](https://reactnavigation.org)
- [Bare Workflow Guide](https://reactnative.dev/docs/environment-setup)
- [Comparing Expo vs Bare RN](https://docs.expo.dev/faq/)
