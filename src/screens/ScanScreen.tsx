import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppButton } from '../components/AppButton';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { scanFace } from '../utils/scanApi';
import { Colors, Spacing, Radius } from '../constants/theme';
import type { RootStackScreenProps } from '../navigation/types';
import type { ScanResult } from '../utils/types';

type Props = RootStackScreenProps<'Scan'>;
type Step = 'camera' | 'preview' | 'working' | 'error';

export default function ScanScreen({ navigation }: Props) {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('camera');
  const [statusText, setStatusText] = useState('');
  const [errorText, setErrorText] = useState('');

  const cameraRef = useRef<RNCamera>(null);
  const { detectFace } = useFaceDetection();

  // ----- Take the photo -----
  async function takePhoto() {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      if (photo) {
        setPhotoUri(photo.uri);
        setStep('preview');
      }
    } catch {
      Alert.alert('Oops', "Couldn't take the photo. Please try again.");
    }
  }

  function retake() {
    setPhotoUri(null);
    setStep('camera');
  }

  // ----- Run the full scan: on-device detection, then AI analysis -----
  async function runScan() {
    if (!photoUri) return;
    setStep('working');

    setStatusText('Looking for your face...');
    const geometry = await detectFace(photoUri);

    if (!geometry) {
      Alert.alert(
        'No face detected',
        "We couldn't find a face in that photo. Try again with better lighting, or continue anyway.",
        [
          { text: 'Retake', onPress: retake },
          { text: 'Continue Anyway', onPress: () => finishScan(null) },
        ]
      );
      return;
    }

    finishScan(geometry);
  }

  async function finishScan(geometry: Parameters<typeof scanFace>[1]) {
    setStatusText('Analyzing your features...');
    try {
      const result: ScanResult = await scanFace(photoUri as string, geometry);
      navigation.navigate('Results', {
        data: JSON.stringify(result),
        photoUri: photoUri as string,
      });
    } catch (e) {
      setErrorText(e instanceof Error ? e.message : 'Something went wrong.');
      setStep('error');
    }
  }

  // ----- Working / loading state -----
  if (step === 'working') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
    );
  }

  // ----- Error state -----
  if (step === 'error') {
    return (
      <SafeAreaView style={styles.centered}>
        <Icon name="alert-circle-outline" size={56} color={Colors.error} />
        <Text style={styles.title}>Scan failed</Text>
        <Text style={styles.subtitle}>{errorText}</Text>
        <AppButton label="Try Again" onPress={retake} style={{ marginTop: Spacing.lg }} />
      </SafeAreaView>
    );
  }

  // ----- Preview state: confirm the photo before scanning -----
  if (step === 'preview' && photoUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoUri }} style={styles.previewImage} />
        <SafeAreaView style={styles.previewActions}>
          <AppButton
            label="Retake"
            variant="secondary"
            icon="refresh"
            onPress={retake}
            style={{ flex: 1 }}
          />
          <AppButton label="Use This Photo" icon="checkmark" onPress={runScan} style={{ flex: 1 }} />
        </SafeAreaView>
      </View>
    );
  }

  // ----- Camera step (default) -----
  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        type={RNCamera.Constants.Type.front}
        flashMode={RNCamera.Constants.FlashMode.off}
        captureAudio={false}
      />

      {/* A simple oval guide so people know where to put their face */}
      <View style={styles.guideWrap} pointerEvents="none">
        <View style={styles.ovalGuide} />
        <Text style={styles.guideText}>Center your face in the oval</Text>
      </View>

      <SafeAreaView style={styles.shutterWrap}>
        <Text style={styles.tip}>Find good lighting and look straight ahead</Text>
        <TouchableOpacity style={styles.shutterButton} onPress={takePhoto}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  title: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  statusText: { color: Colors.textSecondary, fontSize: 15, marginTop: Spacing.md },

  guideWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  ovalGuide: {
    width: 220,
    height: 290,
    borderRadius: 130,
    borderWidth: 2,
    borderColor: 'rgba(124,92,255,0.7)',
    borderStyle: 'dashed',
  },
  guideText: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },

  shutterWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  tip: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  shutterButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff' },

  previewContainer: { flex: 1, backgroundColor: '#000' },
  previewImage: { flex: 1, resizeMode: 'cover' },
  previewActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.lg,
  },
});
