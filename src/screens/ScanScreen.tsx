import React, {
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';

import { RNCamera } from 'react-native-camera';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useFaceDetection } from '../hooks/useFaceDetection';
import { scanFace } from '../utils/scanApi';

import type { RootStackScreenProps } from '../navigation/types';
import type { ScanResult } from '../utils/types';

type Props = RootStackScreenProps<'Scan'>;

type Step = 'camera' | 'preview' | 'working' | 'error';

/*
  TEMPORARY:
  The iOS simulator cannot properly render the project's
  current RNCamera implementation.

  Keep this false while designing/testing in the simulator.

  When testing the real camera on an iPhone later,
  we can switch this back to true.
*/
const CAMERA_PREVIEW_ENABLED = false;

const COLORS = {
  background: '#090B12',
  surface: '#131722',
  surfaceLight: '#191E2B',
  border: '#292F3F',

  primary: '#7357FF',
  primaryBlue: '#6284FF',

  text: '#F7F7FA',
  secondary: '#A7ADBD',
  muted: '#72798B',

  success: '#45D6A6',
  error: '#FF6B78',
};

export default function ScanScreen({ navigation }: Props) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const [step, setStep] = useState<Step>('camera');

  const [statusText, setStatusText] = useState('');

  const [errorText, setErrorText] = useState('');

  const cameraRef = useRef<RNCamera>(null);

  const { detectFace } = useFaceDetection();

  /*
    Hide React Navigation's default header.

    This prevents:
    "StyleScan     Scan Your Face"

    from appearing above our custom UI.
  */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // ------------------------------------------------------
  // Capture Photo
  // ------------------------------------------------------

  async function takePhoto() {
    if (!CAMERA_PREVIEW_ENABLED) {
      Alert.alert(
        'Simulator Camera Preview',
        'The StyleScan camera UI is being previewed in the simulator. We will test the real camera on a physical iPhone.',
      );

      return;
    }

    if (!cameraRef.current) {
      return;
    }

    try {
      const photo =
        await cameraRef.current.takePictureAsync({
          quality: 0.9,
        });

      if (photo) {
        setPhotoUri(photo.uri);
        setStep('preview');
      }
    } catch {
      Alert.alert(
        'Unable to take photo',
        'We could not capture your photo. Please try again.',
      );
    }
  }

  function retake() {
    setPhotoUri(null);
    setErrorText('');
    setStep('camera');
  }

  // ------------------------------------------------------
  // Face Scan
  // ------------------------------------------------------

  async function runScan() {
    if (!photoUri) {
      return;
    }

    setStep('working');

    setStatusText(
      'Detecting your facial features...',
    );

    try {
      const geometry =
        await detectFace(photoUri);

      if (!geometry) {
        Alert.alert(
          'No face detected',
          'We could not clearly detect a face in the photo.',
          [
            {
              text: 'Retake',
              onPress: retake,
            },
            {
              text: 'Continue Anyway',
              onPress: () =>
                finishScan(null),
            },
          ],
        );

        return;
      }

      await finishScan(geometry);
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? error.message
          : 'Something went wrong while scanning your face.',
      );

      setStep('error');
    }
  }

  async function finishScan(
    geometry: Parameters<
      typeof scanFace
    >[1],
  ) {
    setStatusText(
      'Creating your StyleScan profile...',
    );

    try {
      const result: ScanResult =
        await scanFace(
          photoUri as string,
          geometry,
        );

      navigation.navigate('Results', {
        data: JSON.stringify(result),
        photoUri: photoUri as string,
      });
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? error.message
          : 'Something went wrong while analyzing your photo.',
      );

      setStep('error');
    }
  }

  // ------------------------------------------------------
  // Loading Screen
  // ------------------------------------------------------

  if (step === 'working') {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
        <View style={styles.loadingLogo}>
          <Ionicons
            name="scan-outline"
            size={34}
            color={COLORS.primaryBlue}
          />
        </View>

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.loadingSpinner}
        />

        <Text style={styles.loadingTitle}>
          Analyzing your look
        </Text>

        <Text style={styles.loadingText}>
          {statusText}
        </Text>

        <View
          style={styles.processingBadge}
        >
          <Ionicons
            name="sparkles"
            size={15}
            color={COLORS.primaryBlue}
          />

          <Text
            style={styles.processingText}
          >
            AI-powered analysis
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ------------------------------------------------------
  // Error Screen
  // ------------------------------------------------------

  if (step === 'error') {
    return (
      <SafeAreaView
        style={styles.errorContainer}
      >
        <View style={styles.errorIcon}>
          <Ionicons
            name="alert-circle-outline"
            size={46}
            color={COLORS.error}
          />
        </View>

        <Text style={styles.errorTitle}>
          Scan failed
        </Text>

        <Text style={styles.errorText}>
          {errorText}
        </Text>

        <Pressable
          style={styles.errorButton}
          onPress={retake}
        >
          <Ionicons
            name="refresh-outline"
            size={20}
            color="#FFFFFF"
          />

          <Text
            style={styles.errorButtonText}
          >
            Try Again
          </Text>
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text
            style={styles.cancelButtonText}
          >
            Return Home
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // ------------------------------------------------------
  // Photo Preview
  // ------------------------------------------------------

  if (step === 'preview' && photoUri) {
    return (
      <View
        style={styles.previewContainer}
      >
        <Image
          source={{ uri: photoUri }}
          style={styles.previewImage}
        />

        <View
          style={styles.previewOverlay}
        />

        <SafeAreaView
          style={styles.previewContent}
        >
          <View
            style={styles.previewHeader}
          >
            <Pressable
              style={styles.circleButton}
              onPress={retake}
            >
              <Ionicons
                name="close"
                size={26}
                color="#FFFFFF"
              />
            </Pressable>

            <Text
              style={
                styles.previewHeaderTitle
              }
            >
              Review Photo
            </Text>

            <View
              style={styles.headerSpacer}
            />
          </View>

          <View
            style={styles.previewBottom}
          >
            <View
              style={styles.previewMessage}
            >
              <View
                style={styles.successIcon}
              >
                <Ionicons
                  name="checkmark"
                  size={19}
                  color={COLORS.success}
                />
              </View>

              <View
                style={
                  styles.previewMessageText
                }
              >
                <Text
                  style={
                    styles.previewTitle
                  }
                >
                  Looking good
                </Text>

                <Text
                  style={
                    styles.previewSubtitle
                  }
                >
                  Make sure your face is
                  clear and well lit.
                </Text>
              </View>
            </View>

            <View
              style={styles.previewButtons}
            >
              <Pressable
                style={
                  styles.secondaryButton
                }
                onPress={retake}
              >
                <Ionicons
                  name="refresh-outline"
                  size={20}
                  color={COLORS.text}
                />

                <Text
                  style={
                    styles.secondaryButtonText
                  }
                >
                  Retake
                </Text>
              </Pressable>

              <Pressable
                style={
                  styles.usePhotoButton
                }
                onPress={runScan}
              >
                <Ionicons
                  name="sparkles"
                  size={19}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.usePhotoButtonText
                  }
                >
                  Analyze Photo
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ------------------------------------------------------
  // Camera Screen
  // ------------------------------------------------------

  return (
    <View style={styles.container}>
      {CAMERA_PREVIEW_ENABLED ? (
        <RNCamera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          type={
            RNCamera.Constants.Type.front
          }
          flashMode={
            RNCamera.Constants.FlashMode
              .off
          }
          captureAudio={false}
        />
      ) : (
        <View
          style={styles.cameraPlaceholder}
        >
          <View
            style={styles.placeholderGlow}
          />

          <Ionicons
            name="camera-outline"
            size={44}
            color="rgba(255,255,255,0.08)"
          />

          <Text
            style={styles.placeholderText}
          >
            CAMERA PREVIEW
          </Text>
        </View>
      )}

      <View style={styles.cameraShade} />

      <SafeAreaView
        style={styles.cameraContent}
      >
        {/* Header */}

        <View
          style={styles.cameraHeader}
        >
          <Pressable
            style={styles.circleButton}
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="chevron-back"
              size={25}
              color="#FFFFFF"
            />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.cameraTitle}>
              FACE SCAN
            </Text>

            <Text
              style={styles.cameraSubtitle}
            >
              StyleScan AI
            </Text>
          </View>

          <Pressable
            style={styles.circleButton}
          >
            <Ionicons
              name="help-circle-outline"
              size={24}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* Face Guide */}

        <View
          style={styles.faceGuideArea}
        >
          <View style={styles.scanStatus}>
            <View
              style={styles.statusDot}
            />

            <Text
              style={styles.statusText}
            >
              Position your face
            </Text>
          </View>

          <View style={styles.faceFrame}>
            <View
              style={[
                styles.guideCorner,
                styles.guideTopLeft,
              ]}
            />

            <View
              style={[
                styles.guideCorner,
                styles.guideTopRight,
              ]}
            />

            <View
              style={[
                styles.guideCorner,
                styles.guideBottomLeft,
              ]}
            />

            <View
              style={[
                styles.guideCorner,
                styles.guideBottomRight,
              ]}
            />

            <View style={styles.faceOval}>
              <Ionicons
                name="person-outline"
                size={78}
                color="rgba(255,255,255,0.15)"
              />
            </View>
          </View>

          <Text style={styles.guideTitle}>
            Center your face
          </Text>

          <Text
            style={styles.guideDescription}
          >
            Look straight ahead and make
            sure your entire face is
            visible.
          </Text>
        </View>

        {/* Camera Controls */}

        <View
          style={styles.cameraBottom}
        >
          <View style={styles.tipCard}>
            <Ionicons
              name="sunny-outline"
              size={19}
              color={COLORS.primaryBlue}
            />

            <Text style={styles.tipText}>
              Use even lighting and remove
              anything covering your face.
            </Text>
          </View>

          <View style={styles.shutterRow}>
            <View
              style={styles.shutterSide}
            />

            <Pressable
              style={styles.shutterOuter}
              onPress={takePhoto}
            >
              <View
                style={styles.shutterInner}
              />
            </Pressable>

            <View
              style={styles.shutterSide}
            >
              <Ionicons
                name="camera-outline"
                size={23}
                color="rgba(255,255,255,0.55)"
              />
            </View>
          </View>

          <Text
            style={styles.captureText}
          >
            Tap to capture
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  cameraPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#070910',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderGlow: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor:
      'rgba(98,132,255,0.035)',
  },

  placeholderText: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.10)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.5,
  },

  cameraShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(5,7,12,0.22)',
  },

  cameraContent: {
    flex: 1,
  },

  // Header

  cameraHeader: {
    height: 72,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor:
      'rgba(12,14,22,0.82)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCenter: {
    alignItems: 'center',
  },

  cameraTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2.7,
  },

  cameraSubtitle: {
    marginTop: 2,
    color: COLORS.secondary,
    fontSize: 11,
  },

  headerSpacer: {
    width: 44,
  },

  // Face Guide

  faceGuideArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  scanStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(9,11,18,0.86)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor:
      COLORS.primaryBlue,
    marginRight: 8,
  },

  statusText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },

  faceFrame: {
    width: 270,
    height: 330,
    alignItems: 'center',
    justifyContent: 'center',
  },

  faceOval: {
    width: 205,
    height: 270,
    borderRadius: 110,
    borderWidth: 1.5,
    borderColor:
      'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  guideCorner: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderColor: COLORS.primaryBlue,
  },

  guideTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 13,
  },

  guideTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 13,
  },

  guideBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 13,
  },

  guideBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 13,
  },

  guideTitle: {
    marginTop: 18,
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },

  guideDescription: {
    marginTop: 7,
    color: COLORS.secondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 300,
  },

  // Camera Controls

  cameraBottom: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },

  tipCard: {
    backgroundColor:
      'rgba(11,14,21,0.92)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.11)',
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  tipText: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 17,
  },

  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  shutterSide: {
    width: 74,
    alignItems: 'center',
  },

  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },

  captureText: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },

  // Preview

  previewContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },

  previewImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },

  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(5,7,12,0.18)',
  },

  previewContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  previewHeader: {
    height: 74,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  previewHeaderTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },

  previewBottom: {
    backgroundColor:
      COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 24,
  },

  previewMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  successIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor:
      'rgba(69,214,166,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  previewMessageText: {
    flex: 1,
  },

  previewTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
  },

  previewSubtitle: {
    color: COLORS.secondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },

  previewButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  secondaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor:
      COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },

  usePhotoButton: {
    flex: 1.4,
    height: 56,
    borderRadius: 14,
    backgroundColor:
      COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  usePhotoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Loading

  loadingContainer: {
    flex: 1,
    backgroundColor:
      COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  loadingLogo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingSpinner: {
    marginTop: 30,
  },

  loadingTitle: {
    marginTop: 24,
    color: COLORS.text,
    fontSize: 23,
    fontWeight: '700',
  },

  loadingText: {
    marginTop: 8,
    color: COLORS.secondary,
    fontSize: 14,
    textAlign: 'center',
  },

  processingBadge: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  processingText: {
    color: COLORS.secondary,
    fontSize: 12,
    marginLeft: 7,
  },

  // Error

  errorContainer: {
    flex: 1,
    backgroundColor:
      COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  errorIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor:
      'rgba(255,107,120,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorTitle: {
    marginTop: 22,
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
  },

  errorText: {
    marginTop: 9,
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },

  errorButton: {
    marginTop: 26,
    width: '100%',
    height: 56,
    borderRadius: 14,
    backgroundColor:
      COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  cancelButton: {
    marginTop: 15,
    paddingVertical: 10,
  },

  cancelButtonText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
});