import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,Image,
  ActivityIndicator,
  Alert,
  Pressable,
  Modal,
  Animated,
  Easing,
} from 'react-native';

import { RNCamera } from 'react-native-camera';
import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from '@expo/vector-icons/Ionicons';

import { useFaceDetection } from '../hooks/useFaceDetection';
import { scanFace } from '../utils/scanApi';

import type { RootStackScreenProps } from '../navigation/types';
import type { ScanResult } from '../utils/types';

type Props = RootStackScreenProps<'Scan'>;

type Step =
  | 'camera'
  | 'preview'
  | 'working'
  | 'error';

/*
  Keep this false while testing UI in the iOS Simulator.

  When the team is ready to test the real camera
  on a physical iPhone, this can be changed back.
*/
const CAMERA_PREVIEW_ENABLED = false;

/*
  Temporary simulator data.

  This lets us preview the Results screen without
  needing the real camera or AI scan to run.
*/
const MOCK_SCAN_RESULT: ScanResult = {
  faceShape: {
    shape: 'Oval',
    confidence: 'High',
    notes:
      'Your face appears slightly longer than it is wide, with balanced proportions and a softly rounded jawline.',
  },

  skinTone: {
    tone: 'Medium',
    undertone: 'Warm',
    notes:
      'Your complexion appears to have warm undertones that pair well with rich, natural tones and versatile grooming styles.',
  },

  facialHair: {
    present: true,
    type: 'Short beard',
    notes:
      'Your current facial hair adds definition around the jaw and can work well with both clean fades and fuller hairstyles.',
  },

  summary:
    'Your balanced oval face shape gives you a wide range of hairstyle and facial hair options. Styles that preserve your natural proportions while adding texture or definition should work especially well.',
};

const COLORS = {
  background: '#070911',
  backgroundSoft: '#0B0E18',

  surface: '#111522',
  surfaceLight: '#171C2B',

  border: 'rgba(255,255,255,0.08)',
  borderBlue: 'rgba(98,132,255,0.28)',

  primary: '#7357FF',
  primaryBlue: '#6284FF',
  blueBright: '#7A9AFF',

  text: '#F7F8FC',
  secondary: '#A5ACBC',
  muted: '#6F7688',

  success: '#45D6A6',
  error: '#FF6B78',
};

export default function ScanScreen({
  navigation,
}: Props) {
  const [photoUri, setPhotoUri] =
    useState<string | null>(null);

  const [step, setStep] =
    useState<Step>('camera');

  const [statusText, setStatusText] =
    useState('');

  const [errorText, setErrorText] =
    useState('');

  const [helpVisible, setHelpVisible] =
    useState(false);

  const cameraRef =
    useRef<RNCamera>(null);

  const { detectFace } =
    useFaceDetection();

  /*
    Animated values
  */
  const scanBeam =
    useRef(new Animated.Value(0)).current;

  const pulse =
    useRef(new Animated.Value(1)).current;

  const glow =
    useRef(new Animated.Value(0.35)).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const scanAnimation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanBeam, {
            toValue: 1,
            duration: 2200,
            easing:
              Easing.inOut(
                Easing.ease,
              ),
            useNativeDriver: true,
          }),

          Animated.timing(scanBeam, {
            toValue: 0,
            duration: 2200,
            easing:
              Easing.inOut(
                Easing.ease,
              ),
            useNativeDriver: true,
          }),
        ]),
      );

    const pulseAnimation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.06,
            duration: 1200,
            useNativeDriver: true,
          }),

          Animated.timing(pulse, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      );

    const glowAnimation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 0.8,
            duration: 1100,
            useNativeDriver: true,
          }),

          Animated.timing(glow, {
            toValue: 0.3,
            duration: 1100,
            useNativeDriver: true,
          }),
        ]),
      );

    scanAnimation.start();
    pulseAnimation.start();
    glowAnimation.start();

    return () => {
      scanAnimation.stop();
      pulseAnimation.stop();
      glowAnimation.stop();
    };
  }, [glow, pulse, scanBeam]);

  // ------------------------------------------------------
  // Capture Photo
  // ------------------------------------------------------

  async function takePhoto() {
    /*
      SIMULATOR MODE

      Because RNCamera does not currently work properly
      in our simulator setup, pressing the capture button
      sends us directly to Results using fake data.
    */
    if (!CAMERA_PREVIEW_ENABLED) {
      navigation.navigate('Results', {
        data: JSON.stringify(
          MOCK_SCAN_RESULT,
        ),
        photoUri: '',
      });

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
  // Run Face Scan
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
  // Loading
  // ------------------------------------------------------

  if (step === 'working') {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
        <View style={styles.ambientLoading} />

        <Animated.View
          style={[
            styles.loadingScannerOuter,
            {
              transform: [
                { scale: pulse },
              ],
            },
          ]}
        >
          <View
            style={styles.loadingScannerInner}
          >
            <Ionicons
              name="scan-outline"
              size={40}
              color={COLORS.primaryBlue}
            />
          </View>
        </Animated.View>

        <View style={styles.loadingBadge}>
          <View
            style={styles.loadingBadgeDot}
          />

          <Text
            style={styles.loadingBadgeText}
          >
            AI ANALYSIS ACTIVE
          </Text>
        </View>

        <Text style={styles.loadingTitle}>
          Analyzing your look.
        </Text>

        <Text style={styles.loadingText}>
          {statusText}
        </Text>

        <ActivityIndicator
          size="small"
          color={COLORS.primaryBlue}
          style={styles.loadingSpinner}
        />

        <View
          style={styles.processingSteps}
        >
          <ProcessingStep
            icon="scan-outline"
            title="Face geometry"
          />

          <ProcessingStep
            icon="color-palette-outline"
            title="Feature analysis"
          />

          <ProcessingStep
            icon="sparkles-outline"
            title="Style profile"
          />
        </View>
      </SafeAreaView>
    );
  }

  // ------------------------------------------------------
  // Error
  // ------------------------------------------------------

  if (step === 'error') {
    return (
      <SafeAreaView
        style={styles.errorContainer}
      >
        <View style={styles.errorGlow} />

        <View style={styles.errorIcon}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={COLORS.error}
          />
        </View>

        <Text style={styles.errorEyebrow}>
          SCAN INTERRUPTED
        </Text>

        <Text style={styles.errorTitle}>
          We couldn't finish the scan.
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

  if (
    step === 'preview' &&
    photoUri
  ) {
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
                size={25}
                color="#FFFFFF"
              />
            </Pressable>

            <View
              style={
                styles.previewHeaderCenter
              }
            >
              <Text
                style={
                  styles.previewHeaderTitle
                }
              >
                REVIEW CAPTURE
              </Text>

              <Text
                style={
                  styles.previewHeaderSubtitle
                }
              >
                StyleScan AI
              </Text>
            </View>

            <View
              style={styles.headerSpacer}
            />
          </View>

          <View
            style={styles.previewBottom}
          >
            <View
              style={styles.previewBadge}
            >
              <View
                style={styles.successDot}
              />

              <Text
                style={styles.previewBadgeText}
              >
                PHOTO READY
              </Text>
            </View>

            <Text
              style={styles.previewTitle}
            >
              Ready to analyze?
            </Text>

            <Text
              style={styles.previewSubtitle}
            >
              Make sure your face is clear,
              centered, and evenly lit.
            </Text>

            <View
              style={styles.previewQuality}
            >
              <QualityItem
                icon="person-outline"
                label="Face visible"
              />

              <QualityItem
                icon="sunny-outline"
                label="Good lighting"
              />

              <QualityItem
                icon="scan-outline"
                label="Centered"
              />
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
                  Analyze
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color="#FFFFFF"
                />
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

  const beamTranslate =
    scanBeam.interpolate({
      inputRange: [0, 1],
      outputRange: [-112, 112],
    });

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

          <View
            style={styles.placeholderGlowTwo}
          />
        </View>
      )}

      <View style={styles.cameraShade} />

      <View
        pointerEvents="none"
        style={styles.topAmbient}
      />

      <SafeAreaView
        style={styles.cameraContent}
      >
        {/* Header */}

        <View style={styles.cameraHeader}>
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
              STYLESCAN
            </Text>

            <View
              style={styles.cameraStatus}
            >
              <Animated.View
                style={[
                  styles.cameraStatusGlow,
                  {
                    opacity: glow,
                  },
                ]}
              />

              <View
                style={
                  styles.cameraStatusDot
                }
              />

              <Text
                style={
                  styles.cameraStatusText
                }
              >
                LIVE ANALYSIS
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.circleButton}
            onPress={() =>
              setHelpVisible(true)
            }
          >
            <Ionicons
              name="help-circle-outline"
              size={24}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* Camera HUD */}

        <View style={styles.hudArea}>
          <View style={styles.scanLabel}>
            <Ionicons
              name="scan-outline"
              size={15}
              color={COLORS.primaryBlue}
            />

            <Text
              style={styles.scanLabelText}
            >
              FACE DETECTION
            </Text>
          </View>

          <Animated.View
            style={[
              styles.faceFrameOuter,
              {
                transform: [
                  { scale: pulse },
                ],
              },
            ]}
          >
            {/* Corner Guides */}

            <View
              style={[
                styles.scanCorner,
                styles.topLeft,
              ]}
            />

            <View
              style={[
                styles.scanCorner,
                styles.topRight,
              ]}
            />

            <View
              style={[
                styles.scanCorner,
                styles.bottomLeft,
              ]}
            />

            <View
              style={[
                styles.scanCorner,
                styles.bottomRight,
              ]}
            />

            {/* Face Oval */}

            <View style={styles.faceOval}>
              <View
                style={styles.faceOvalInner}
              >
                <Ionicons
                  name="person-outline"
                  size={82}
                  color="rgba(255,255,255,0.15)"
                />
              </View>

              {/* Moving Scan Beam */}

              <Animated.View
                style={[
                  styles.scanBeamGlow,
                  {
                    transform: [
                      {
                        translateY:
                          beamTranslate,
                      },
                    ],
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.scanBeam,
                  {
                    transform: [
                      {
                        translateY:
                          beamTranslate,
                      },
                    ],
                  },
                ]}
              />
            </View>

            {/* Side Tracking Markers */}

            <View
              style={styles.leftMarker}
            />

            <View
              style={styles.rightMarker}
            />
          </Animated.View>

          {/* Status */}

          <View
            style={styles.positionStatus}
          >
            <View
              style={
                styles.positionStatusIcon
              }
            >
              <Ionicons
                name="person-outline"
                size={18}
                color={COLORS.primaryBlue}
              />
            </View>

            <View
              style={
                styles.positionStatusText
              }
            >
              <Text
                style={
                  styles.positionTitle
                }
              >
                Center your face
              </Text>

              <Text
                style={
                  styles.positionSubtitle
                }
              >
                Look directly at the camera
              </Text>
            </View>

            <View
              style={styles.readyIndicator}
            >
              <View
                style={styles.readyDot}
              />

              <Text
                style={styles.readyText}
              >
                READY
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Controls */}

        <View
          style={styles.cameraBottom}
        >
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons
                name="sunny-outline"
                size={18}
                color={COLORS.primaryBlue}
              />
            </View>

            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>
                Lighting check
              </Text>

              <Text style={styles.tipText}>
                Use soft, even lighting and
                keep your entire face visible.
              </Text>
            </View>

            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={COLORS.success}
            />
          </View>

          <View style={styles.captureRow}>
            <View style={styles.captureSide}>
              <View
                style={styles.utilityBubble}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.secondary}
                />
              </View>

              <Text
                style={styles.utilityText}
              >
                FRONT
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.shutterOuter,
                pressed &&
                  styles.shutterPressed,
              ]}
              onPress={takePhoto}
            >
              <View
                style={styles.shutterMiddle}
              >
                <View
                  style={styles.shutterInner}
                />
              </View>
            </Pressable>

            <View style={styles.captureSide}>
              <View
                style={styles.utilityBubble}
              >
                <Ionicons
                  name="sparkles-outline"
                  size={20}
                  color={COLORS.primaryBlue}
                />
              </View>

              <Text
                style={styles.utilityText}
              >
                AI ON
              </Text>
            </View>
          </View>

          <Text style={styles.captureText}>
            TAP TO CAPTURE
          </Text>

          <Text
            style={styles.captureSubtext}
          >
            Keep your head still for the best
            analysis
          </Text>
        </View>
      </SafeAreaView>

      {/* Scan Help Modal */}

      <Modal
        visible={helpVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setHelpVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={
              StyleSheet.absoluteFill
            }
            onPress={() =>
              setHelpVisible(false)
            }
          />

          <View style={styles.helpModal}>
            <View style={styles.helpHandle} />

            <View style={styles.helpHeader}>
              <View
                style={styles.helpHeaderIcon}
              >
                <Ionicons
                  name="scan-outline"
                  size={24}
                  color={
                    COLORS.primaryBlue
                  }
                />
              </View>

              <View
                style={styles.helpHeading}
              >
                <Text
                  style={styles.helpEyebrow}
                >
                  SCAN GUIDE
                </Text>

                <Text
                  style={styles.helpTitle}
                >
                  Get the best results
                </Text>
              </View>

              <Pressable
                style={
                  styles.helpCloseButton
                }
                onPress={() =>
                  setHelpVisible(false)
                }
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={COLORS.text}
                />
              </Pressable>
            </View>

            <Text style={styles.helpIntro}>
              A clear photo helps StyleScan
              analyze your features more
              accurately.
            </Text>

            <HelpTip
              icon="sunny-outline"
              title="Use good lighting"
              description="Face a light source and avoid harsh shadows across your face."
            />

            <HelpTip
              icon="person-outline"
              title="Center your face"
              description="Keep your full face inside the guide and look directly at the camera."
            />

            <HelpTip
              icon="glasses-outline"
              title="Keep features visible"
              description="Remove anything that heavily covers your forehead, cheeks, jaw, or eyes."
            />

            <HelpTip
              icon="phone-portrait-outline"
              title="Hold still"
              description="Keep the phone steady and avoid turning or tilting your head during capture."
            />

            <Pressable
              style={styles.helpDoneButton}
              onPress={() =>
                setHelpVisible(false)
              }
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#FFFFFF"
              />

              <Text
                style={styles.helpDoneText}
              >
                Got It
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ------------------------------------------------------
// Help Tip
// ------------------------------------------------------

type HelpTipProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

function HelpTip({
  icon,
  title,
  description,
}: HelpTipProps) {
  return (
    <View style={styles.helpTip}>
      <View style={styles.helpTipIcon}>
        <Ionicons
          name={icon}
          size={21}
          color={COLORS.primaryBlue}
        />
      </View>

      <View style={styles.helpTipContent}>
        <Text style={styles.helpTipTitle}>
          {title}
        </Text>

        <Text
          style={styles.helpTipDescription}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

// ------------------------------------------------------
// Processing Step
// ------------------------------------------------------

function ProcessingStep({
  icon,
  title,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}) {
  return (
    <View style={styles.processingStep}>
      <Ionicons
        name={icon}
        size={17}
        color={COLORS.primaryBlue}
      />

      <Text
        style={styles.processingStepText}
      >
        {title}
      </Text>
    </View>
  );
}

// ------------------------------------------------------
// Preview Quality Item
// ------------------------------------------------------

function QualityItem({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.qualityItem}>
      <Ionicons
        name={icon}
        size={18}
        color={COLORS.primaryBlue}
      />

      <Text
        style={styles.qualityItemText}
      >
        {label}
      </Text>
    </View>
  );
}

// ------------------------------------------------------
// Styles
// ------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Camera Background

  cameraPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#05070D',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  placeholderGlow: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor:
      'rgba(52,64,155,0.10)',
    top: 190,
  },

  placeholderGlowTwo: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor:
      'rgba(115,87,255,0.055)',
    bottom: -60,
    right: -100,
  },

  cameraShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(3,5,10,0.30)',
  },

  topAmbient: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor:
      'rgba(98,132,255,0.04)',
    top: -170,
    right: -80,
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
    borderRadius: 15,
    backgroundColor:
      'rgba(14,18,30,0.88)',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCenter: {
    alignItems: 'center',
  },

  cameraTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3.1,
  },

  cameraStatus: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },

  cameraStatusGlow: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
    left: 0,
  },

  cameraStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 7,
    marginLeft: 2,
  },

  cameraStatusText: {
    color: COLORS.success,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.1,
  },

  headerSpacer: {
    width: 44,
  },

  // HUD

  hudArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  scanLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor:
      'rgba(98,132,255,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.18)',
    marginBottom: 17,
  },

  scanLabelText: {
    color: COLORS.primaryBlue,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginLeft: 7,
  },

  faceFrameOuter: {
    width: 290,
    height: 350,
    alignItems: 'center',
    justifyContent: 'center',
  },

  faceOval: {
    width: 215,
    height: 285,
    borderRadius: 110,
    borderWidth: 1,
    borderColor:
      'rgba(122,154,255,0.38)',
    backgroundColor:
      'rgba(8,11,20,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  faceOvalInner: {
    width: 190,
    height: 255,
    borderRadius: 100,
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanBeamGlow: {
    position: 'absolute',
    width: 195,
    height: 15,
    backgroundColor:
      'rgba(98,132,255,0.12)',
  },

  scanBeam: {
    position: 'absolute',
    width: 190,
    height: 2,
    backgroundColor:
      COLORS.blueBright,

    shadowColor:
      COLORS.primaryBlue,

    shadowOpacity: 1,
    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  scanCorner: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderColor:
      COLORS.primaryBlue,
  },

  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 13,
  },

  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 13,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 13,
  },

  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 13,
  },

  leftMarker: {
    position: 'absolute',
    left: -5,
    width: 16,
    height: 1,
    backgroundColor:
      'rgba(98,132,255,0.35)',
  },

  rightMarker: {
    position: 'absolute',
    right: -5,
    width: 16,
    height: 1,
    backgroundColor:
      'rgba(98,132,255,0.35)',
  },

  // Face Position Status

  positionStatus: {
    width: '100%',
    maxWidth: 350,
    minHeight: 65,
    borderRadius: 18,
    backgroundColor:
      'rgba(14,18,29,0.88)',
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginTop: 17,
  },

  positionStatusIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor:
      'rgba(98,132,255,0.09)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  positionStatusText: {
    flex: 1,
  },

  positionTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },

  positionSubtitle: {
    color: COLORS.secondary,
    fontSize: 10,
    marginTop: 2,
  },

  readyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  readyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor:
      COLORS.success,
    marginRight: 5,
  },

  readyText: {
    color: COLORS.success,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Bottom Camera Controls

  cameraBottom: {
    paddingHorizontal: 18,
    paddingBottom: 15,
  },

  tipCard: {
    minHeight: 62,
    borderRadius: 17,
    backgroundColor:
      'rgba(14,18,29,0.92)',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  tipIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor:
      'rgba(98,132,255,0.09)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },

  tipText: {
    color: COLORS.secondary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 2,
  },

  captureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  captureSide: {
    width: 76,
    alignItems: 'center',
  },

  utilityBubble: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor:
      'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  utilityText: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 5,
  },

  shutterOuter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    borderColor:
      'rgba(255,255,255,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,

    shadowColor:
      COLORS.primaryBlue,

    shadowOpacity: 0.25,
    shadowRadius: 15,
  },

  shutterPressed: {
    transform: [
      { scale: 0.94 },
    ],
    opacity: 0.8,
  },

  shutterMiddle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor:
      'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  shutterInner: {
    width: 57,
    height: 57,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
  },

  captureText: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: 9,
  },

  captureSubtext: {
    color: COLORS.muted,
    fontSize: 9,
    textAlign: 'center',
    marginTop: 3,
  },

  // Photo Preview

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
      'rgba(3,5,10,0.22)',
  },

  previewContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  previewHeader: {
    height: 72,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  previewHeaderCenter: {
    alignItems: 'center',
  },

  previewHeaderTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.2,
  },

  previewHeaderSubtitle: {
    color: COLORS.secondary,
    fontSize: 10,
    marginTop: 2,
  },

  previewBottom: {
    backgroundColor:
      COLORS.backgroundSoft,

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    borderWidth: 1,
    borderColor: COLORS.border,

    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 25,
  },

  previewBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor:
      'rgba(69,214,166,0.08)',

    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },

  successDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor:
      COLORS.success,
    marginRight: 6,
  },

  previewBadgeText: {
    color: COLORS.success,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  previewTitle: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: '700',
    marginTop: 15,
  },

  previewSubtitle: {
    color: COLORS.secondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },

  previewQuality: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 20,
  },

  qualityItem: {
    flex: 1,
    minHeight: 57,
    borderRadius: 14,
    backgroundColor:
      COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.border,

    alignItems: 'center',
    justifyContent: 'center',

    marginHorizontal: 3,
  },

  qualityItemText: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '600',
    marginTop: 4,
  },

  previewButtons: {
    flexDirection: 'row',
    gap: 11,
  },

  secondaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,

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
    fontSize: 13,
    fontWeight: '600',
  },

  usePhotoButton: {
    flex: 1.45,
    height: 56,
    borderRadius: 16,

    backgroundColor:
      COLORS.primary,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    shadowColor:
      COLORS.primary,

    shadowOpacity: 0.24,
    shadowRadius: 15,
  },

  usePhotoButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Loading

  loadingContainer: {
    flex: 1,
    backgroundColor:
      COLORS.background,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 28,
    overflow: 'hidden',
  },

  ambientLoading: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,

    backgroundColor:
      'rgba(98,132,255,0.055)',
  },

  loadingScannerOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,

    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.22)',

    backgroundColor:
      'rgba(98,132,255,0.035)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingScannerInner: {
    width: 82,
    height: 82,
    borderRadius: 25,

    backgroundColor:
      COLORS.surface,

    borderWidth: 1,
    borderColor:
      COLORS.borderBlue,

    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingBadge: {
    marginTop: 28,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor:
      'rgba(69,214,166,0.08)',

    borderRadius: 15,

    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  loadingBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,

    backgroundColor:
      COLORS.success,

    marginRight: 7,
  },

  loadingBadgeText: {
    color: COLORS.success,

    fontSize: 8,
    fontWeight: '800',

    letterSpacing: 1.2,
  },

  loadingTitle: {
    color: COLORS.text,
    fontSize: 27,
    fontWeight: '700',
    marginTop: 18,
  },

  loadingText: {
    color: COLORS.secondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },

  loadingSpinner: {
    marginTop: 19,
  },

  processingSteps: {
    flexDirection: 'row',
    marginTop: 24,
    width: '100%',
  },

  processingStep: {
    flex: 1,
    minHeight: 65,

    borderRadius: 15,

    backgroundColor:
      COLORS.surface,

    borderWidth: 1,
    borderColor:
      COLORS.border,

    alignItems: 'center',
    justifyContent: 'center',

    marginHorizontal: 4,
  },

  processingStepText: {
    color: COLORS.secondary,
    fontSize: 9,
    marginTop: 5,
  },

  // Error

  errorContainer: {
    flex: 1,
    backgroundColor:
      COLORS.background,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 30,
    overflow: 'hidden',
  },

  errorGlow: {
    position: 'absolute',

    width: 300,
    height: 300,
    borderRadius: 150,

    backgroundColor:
      'rgba(255,107,120,0.04)',
  },

  errorIcon: {
    width: 90,
    height: 90,
    borderRadius: 28,

    backgroundColor:
      'rgba(255,107,120,0.08)',

    borderWidth: 1,
    borderColor:
      'rgba(255,107,120,0.15)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  errorEyebrow: {
    color: COLORS.error,

    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,

    marginTop: 22,
  },

  errorTitle: {
    color: COLORS.text,

    fontSize: 24,
    fontWeight: '700',

    textAlign: 'center',

    marginTop: 7,
  },

  errorText: {
    color: COLORS.secondary,

    fontSize: 13,
    lineHeight: 20,

    textAlign: 'center',

    marginTop: 9,
  },

  errorButton: {
    marginTop: 26,

    width: '100%',
    height: 56,

    borderRadius: 16,

    backgroundColor:
      COLORS.primary,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 9,
  },

  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  cancelButton: {
    marginTop: 14,
    paddingVertical: 10,
  },

  cancelButtonText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '600',
  },

  // Help Modal

  modalOverlay: {
    flex: 1,

    backgroundColor:
      'rgba(0,0,0,0.72)',

    justifyContent: 'flex-end',
  },

  helpModal: {
    backgroundColor:
      COLORS.backgroundSoft,

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    borderWidth: 1,
    borderColor: COLORS.border,

    paddingHorizontal: 20,
    paddingTop: 11,
    paddingBottom: 30,
  },

  helpHandle: {
    width: 42,
    height: 4,

    borderRadius: 2,

    backgroundColor:
      'rgba(255,255,255,0.12)',

    alignSelf: 'center',

    marginBottom: 20,
  },

  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 13,
  },

  helpHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,

    backgroundColor:
      'rgba(98,132,255,0.10)',

    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.14)',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  helpHeading: {
    flex: 1,
  },

  helpEyebrow: {
    color: COLORS.primaryBlue,

    fontSize: 9,
    fontWeight: '800',

    letterSpacing: 1.5,
  },

  helpTitle: {
    color: COLORS.text,

    fontSize: 19,
    fontWeight: '700',

    marginTop: 3,
  },

  helpCloseButton: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor:
      COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.border,

    alignItems: 'center',
    justifyContent: 'center',
  },

  helpIntro: {
    color: COLORS.secondary,

    fontSize: 13,
    lineHeight: 20,

    marginBottom: 17,
  },

  helpTip: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor:
      COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 17,

    padding: 13,
    marginBottom: 10,
  },

  helpTipIcon: {
    width: 42,
    height: 42,

    borderRadius: 12,

    backgroundColor:
      'rgba(98,132,255,0.08)',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  helpTipContent: {
    flex: 1,
  },

  helpTipTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },

  helpTipDescription: {
    color: COLORS.secondary,

    fontSize: 11,
    lineHeight: 17,

    marginTop: 3,
  },

  helpDoneButton: {
    height: 54,

    borderRadius: 16,

    backgroundColor:
      COLORS.primary,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    marginTop: 8,
  },

  helpDoneText: {
    color: '#FFFFFF',

    fontSize: 15,
    fontWeight: '700',
  },
});