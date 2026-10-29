import React, {
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { scanFace } from '../utils/scanApi';
import { saveScan } from '../utils/profileApi';

import type { RootStackScreenProps } from '../navigation/types';
import type { FaceReading } from '../utils/types';

type Props = RootStackScreenProps<'FaceReading'>;

const COLORS = {
  background: '#070911',

  surface: '#111522',

  border: 'rgba(255,255,255,0.08)',
  borderBlue: 'rgba(98,132,255,0.28)',

  primary: '#7357FF',
  primaryBlue: '#6284FF',

  text: '#F7F8FC',
  secondary: '#A5ACBC',
  muted: '#6F7688',

  success: '#45D6A6',
  warning: '#FFB454',
  error: '#FF6B78',
};

type Check = {
  label: string;
  detail: string;
  status: 'pass' | 'warn' | 'fail';
};

// Thresholds for a photo that measures well. Turning or tilting the head
// changes the outline's proportions, which skews the face shape estimate.
const MAX_YAW = 12;
const MAX_PITCH = 12;
const MAX_ROLL = 8;
const MIN_COVERAGE = 0.3;

function buildChecks(
  reading: FaceReading | null,
): Check[] {
  if (!reading) {
    return [
      {
        label: 'Face detected',
        detail:
          'No face was found in this photo.',
        status: 'fail',
      },
    ];
  }

  const { geometry } = reading;
  const yaw = Math.abs(geometry.yawAngle);
  const pitch = Math.abs(reading.pitchAngle);
  const roll = Math.abs(geometry.rollAngle);

  const eyes = [
    reading.leftEyeOpenProbability,
    reading.rightEyeOpenProbability,
  ].filter(
    (p): p is number => p !== undefined,
  );

  const checks: Check[] = [
    {
      label: 'Face detected',
      detail: 'Face outline found.',
      status: reading.faceShape
        ? 'pass'
        : 'warn',
    },
    {
      label: 'Facing the camera',
      detail: `Turned ${yaw.toFixed(0)}°, tilted up/down ${pitch.toFixed(0)}°`,
      status:
        yaw <= MAX_YAW && pitch <= MAX_PITCH
          ? 'pass'
          : 'fail',
    },
    {
      label: 'Head level',
      detail: `Tilted ${roll.toFixed(0)}° sideways`,
      status:
        roll <= MAX_ROLL ? 'pass' : 'warn',
    },
  ];

  if (reading.frameCoverage !== null) {
    checks.push({
      label: 'Close enough',
      detail: `Face fills ${Math.round(reading.frameCoverage * 100)}% of the photo width`,
      status:
        reading.frameCoverage >= MIN_COVERAGE
          ? 'pass'
          : 'warn',
    });
  }

  if (eyes.length > 0) {
    checks.push({
      label: 'Eyes open',
      detail:
        Math.min(...eyes) > 0.5
          ? 'Both eyes look open.'
          : 'One or both eyes may be closed.',
      status:
        Math.min(...eyes) > 0.5
          ? 'pass'
          : 'warn',
    });
  }

  if (
    geometry.smilingProbability !==
    undefined
  ) {
    checks.push({
      label: 'Neutral expression',
      detail:
        geometry.smilingProbability > 0.7
          ? 'A big smile widens the jaw and can change the result.'
          : 'Relaxed expression.',
      status:
        geometry.smilingProbability > 0.7
          ? 'warn'
          : 'pass',
    });
  }

  return checks;
}

export default function FaceReadingScreen({
  route,
  navigation,
}: Props) {
  const { photoUri, reading: readingJson } =
    route.params;

  const [analyzing, setAnalyzing] =
    useState(false);

  const [errorText, setErrorText] =
    useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const reading: FaceReading | null =
    useMemo(() => {
      if (!readingJson) {
        return null;
      }

      try {
        return JSON.parse(
          readingJson,
        ) as FaceReading;
      } catch {
        return null;
      }
    }, [readingJson]);

  const checks = useMemo(
    () => buildChecks(reading),
    [reading],
  );

  const hasProblems = checks.some(
    (c) => c.status !== 'pass',
  );

  const estimate = reading?.faceShape;

  async function analyzeWithAI() {
    setAnalyzing(true);
    setErrorText('');

    try {
      const result = await scanFace(
        photoUri,
        reading,
      );

      // Best-effort: don't block the results screen on the backend save,
      // and don't fail the scan if Supabase isn't configured yet.
      saveScan(result).catch((e) => {
        console.warn('Could not save scan to profile:', e instanceof Error ? e.message : e);
      });

      navigation.navigate('Results', {
        data: JSON.stringify(result),
        photoUri,
        onDeviceShape: estimate?.shape,
      });
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? error.message
          : 'Something went wrong while analyzing your photo.',
      );
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        pointerEvents="none"
        style={styles.ambientTop}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <Pressable
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back"
              size={25}
              color={COLORS.text}
            />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              FACE READING
            </Text>

            <Text
              style={styles.headerSubtitle}
            >
              On-device analysis
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.localBadge}>
          <Ionicons
            name="phone-portrait-outline"
            size={12}
            color={COLORS.success}
          />

          <Text style={styles.localBadgeText}>
            ON YOUR PHONE · NOTHING SENT YET
          </Text>
        </View>

        <Text style={styles.pageTitle}>
          Here's what your phone sees.
        </Text>

        <Text style={styles.pageSubtitle}>
          These results were measured from
          your face outline on this device.
          Review them before sending your
          photo for a full AI analysis.
        </Text>

        {/* Face Shape Hero */}

        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <Image
              source={{ uri: photoUri }}
              style={styles.photo}
            />

            <View style={styles.heroInfo}>
              <Text style={styles.heroEyebrow}>
                ESTIMATED FACE SHAPE
              </Text>

              <Text style={styles.faceShape}>
                {estimate
                  ? estimate.shape
                  : reading
                    ? 'Unclear'
                    : 'No face'}
              </Text>

              {estimate ? (
                <>
                  <ConfidenceBadge
                    confidence={
                      estimate.confidence
                    }
                  />

                  <Text
                    style={styles.runnerUp}
                  >
                    Next closest:{' '}
                    {estimate.runnerUp}
                  </Text>
                </>
              ) : (
                <Text style={styles.runnerUp}>
                  {reading
                    ? 'The face outline could not be measured.'
                    : 'Try a well-lit, straight-on photo.'}
                </Text>
              )}
            </View>
          </View>

          {estimate ? (
            <>
              <View
                style={styles.cardDivider}
              />

              <Text style={styles.insightText}>
                {estimate.notes}
              </Text>
            </>
          ) : null}
        </View>

        {/* Proportions */}

        {estimate ? (
          <>
            <View style={styles.sectionHeader}>
              <Text
                style={styles.sectionEyebrow}
              >
                MEASUREMENTS
              </Text>

              <Text
                style={styles.sectionTitle}
              >
                Face proportions.
              </Text>
            </View>

            <View style={styles.card}>
              <ProportionRow
                label="Length ÷ cheekbone width"
                value={
                  estimate.measurements
                    .lengthToWidth
                }
                hint="Higher means a longer face"
                max={1.8}
              />

              <ProportionRow
                label="Forehead ÷ cheekbones"
                value={
                  estimate.measurements
                    .foreheadToCheek
                }
                hint="Width of the upper face"
                max={1.1}
              />

              <ProportionRow
                label="Jaw ÷ cheekbones"
                value={
                  estimate.measurements
                    .jawToCheek
                }
                hint="Width of the lower face"
                max={1.1}
                last
              />
            </View>
          </>
        ) : null}

        {/* Photo Quality */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>
            PHOTO QUALITY
          </Text>

          <Text style={styles.sectionTitle}>
            {hasProblems
              ? 'A few things to check.'
              : 'Looks good.'}
          </Text>
        </View>

        <View style={styles.card}>
          {checks.map((check, index) => (
            <CheckRow
              key={check.label}
              check={check}
              last={
                index === checks.length - 1
              }
            />
          ))}
        </View>

        {hasProblems ? (
          <Text style={styles.qualityHint}>
            For the most accurate result, face
            the camera straight on in even
            light and retake the photo.
          </Text>
        ) : null}

        {/* Send to AI */}

        <View style={styles.ctaCard}>
          <View style={styles.ctaTop}>
            <View style={styles.ctaIcon}>
              <Ionicons
                name="sparkles"
                size={24}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.ctaHeading}>
              <Text style={styles.ctaTitle}>
                Get the full analysis.
              </Text>

              <Text style={styles.ctaSubtitle}>
                Sends your photo to OpenAI to
                confirm your face shape and read
                your hair length, skin tone, and
                facial hair.
              </Text>
            </View>
          </View>

          {errorText ? (
            <Text style={styles.errorText}>
              {errorText}
            </Text>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              (pressed || analyzing) &&
                styles.buttonPressed,
            ]}
            onPress={analyzeWithAI}
            disabled={analyzing}
          >
            {analyzing ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Ionicons
                name="cloud-upload-outline"
                size={20}
                color="#FFFFFF"
              />
            )}

            <Text
              style={styles.primaryButtonText}
            >
              {analyzing
                ? 'Analyzing...'
                : reading
                  ? 'Analyze with AI'
                  : 'Analyze with AI anyway'}
            </Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
          disabled={analyzing}
        >
          <Ionicons
            name="camera-outline"
            size={20}
            color={COLORS.text}
          />

          <Text
            style={styles.secondaryButtonText}
          >
            Retake Photo
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// ------------------------------------------------------
// Confidence Badge
// ------------------------------------------------------

function ConfidenceBadge({
  confidence,
}: {
  confidence:
    | 'High'
    | 'Medium'
    | 'Low';
}) {
  const color =
    confidence === 'High'
      ? COLORS.success
      : confidence === 'Medium'
        ? COLORS.warning
        : COLORS.error;

  return (
    <View
      style={[
        styles.confidenceBadge,
        {
          backgroundColor:
            `${color}14`,
          borderColor:
            `${color}2A`,
        },
      ]}
    >
      <View
        style={[
          styles.confidenceDot,
          {
            backgroundColor: color,
          },
        ]}
      />

      <Text
        style={[
          styles.confidenceText,
          { color },
        ]}
      >
        {confidence.toUpperCase()} CONFIDENCE
      </Text>
    </View>
  );
}

// ------------------------------------------------------
// Proportion Row
// ------------------------------------------------------

function ProportionRow({
  label,
  value,
  hint,
  max,
  last,
}: {
  label: string;
  value: number;
  hint: string;
  max: number;
  last?: boolean;
}) {
  const fill = Math.min(value / max, 1);

  return (
    <View
      style={[
        styles.proportionRow,
        last && styles.rowLast,
      ]}
    >
      <View style={styles.rowTop}>
        <Text style={styles.rowLabel}>
          {label}
        </Text>

        <Text style={styles.rowValue}>
          {value.toFixed(2)}
        </Text>
      </View>

      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { width: `${fill * 100}%` },
          ]}
        />
      </View>

      <Text style={styles.rowHint}>
        {hint}
      </Text>
    </View>
  );
}

// ------------------------------------------------------
// Check Row
// ------------------------------------------------------

function CheckRow({
  check,
  last,
}: {
  check: Check;
  last: boolean;
}) {
  const icon =
    check.status === 'pass'
      ? 'checkmark-circle'
      : check.status === 'warn'
        ? 'alert-circle'
        : 'close-circle';

  const color =
    check.status === 'pass'
      ? COLORS.success
      : check.status === 'warn'
        ? COLORS.warning
        : COLORS.error;

  return (
    <View
      style={[
        styles.checkRow,
        last && styles.rowLast,
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={color}
      />

      <View style={styles.checkText}>
        <Text style={styles.rowLabel}>
          {check.label}
        </Text>

        <Text style={styles.rowHint}>
          {check.detail}
        </Text>
      </View>
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

  ambientTop: {
    position: 'absolute',
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor:
      'rgba(69,214,166,0.045)',
    top: -165,
    right: -100,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 42,
  },

  // Header

  header: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor:
      'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCenter: {
    alignItems: 'center',
  },

  headerTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
  },

  headerSubtitle: {
    color: COLORS.secondary,
    fontSize: 10,
    marginTop: 2,
  },

  headerSpacer: {
    width: 44,
  },

  // Intro

  localBadge: {
    alignSelf: 'flex-start',
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor:
      'rgba(69,214,166,0.07)',
    borderWidth: 1,
    borderColor:
      'rgba(69,214,166,0.13)',
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  localBadgeText: {
    color: COLORS.success,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  pageTitle: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.8,
    marginTop: 17,
  },

  pageSubtitle: {
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 23,
    maxWidth: 345,
  },

  // Hero

  heroCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.borderBlue,
    borderRadius: 25,
    padding: 18,
  },

  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  photo: {
    width: 118,
    height: 138,
    borderRadius: 20,
    resizeMode: 'cover',
  },

  heroInfo: {
    flex: 1,
    marginLeft: 18,
  },

  heroEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  faceShape: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '700',
    marginTop: 5,
  },

  runnerUp: {
    color: COLORS.secondary,
    fontSize: 12,
    marginTop: 9,
  },

  confidenceBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginTop: 11,
  },

  confidenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  confidenceText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  cardDivider: {
    height: 1,
    backgroundColor:
      COLORS.border,
    marginVertical: 14,
  },

  insightText: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 19,
  },

  // Sections

  sectionHeader: {
    marginTop: 30,
    marginBottom: 14,
  },

  sectionEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },

  card: {
    backgroundColor:
      COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 15,
  },

  // Rows

  proportionRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  rowLast: {
    borderBottomWidth: 0,
  },

  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },

  rowValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },

  rowHint: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },

  barTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor:
      'rgba(255,255,255,0.06)',
    marginTop: 9,
    overflow: 'hidden',
  },

  barFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor:
      COLORS.primaryBlue,
  },

  checkText: {
    flex: 1,
    marginLeft: 12,
  },

  qualityHint: {
    color: COLORS.warning,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 11,
    paddingHorizontal: 4,
  },

  // CTA

  ctaCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 17,
    marginTop: 28,
  },

  ctaTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  ctaIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor:
      COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  ctaHeading: {
    flex: 1,
  },

  ctaTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },

  ctaSubtitle: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 14,
  },

  primaryButton: {
    height: 58,
    borderRadius: 17,
    backgroundColor:
      COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 18,

    shadowColor:
      COLORS.primary,

    shadowOpacity: 0.22,
    shadowRadius: 16,
  },

  buttonPressed: {
    opacity: 0.84,
    transform: [
      { scale: 0.99 },
    ],
  },

  primaryButtonText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  secondaryButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 13,
  },

  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
});
