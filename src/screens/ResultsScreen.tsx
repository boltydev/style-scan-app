import React, {
  useLayoutEffect,
  useMemo,
} from 'react';

import {
  View,
  Text,
  StyleSheet,ScrollView,
  Image,
  Pressable,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from 'react-native-vector-icons/Ionicons';

import type { RootStackScreenProps } from '../navigation/types';
import type { ScanResult } from '../utils/types';

type Props = RootStackScreenProps<'Results'>;

const COLORS = {
  background: '#070911',
  backgroundSoft: '#0B0E18',

  surface: '#111522',
  surfaceLight: '#171C2B',

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

export default function ResultsScreen({
  route,
  navigation,
}: Props) {
  const { data, photoUri } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const result: ScanResult | null =
    useMemo(() => {
      if (!data) {
        return null;
      }

      try {
        return JSON.parse(
          data,
        ) as ScanResult;
      } catch {
        return null;
      }
    }, [data]);

  if (!result) {
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
          ANALYSIS UNAVAILABLE
        </Text>

        <Text style={styles.errorTitle}>
          We couldn't load your results.
        </Text>

        <Text style={styles.errorText}>
          Try returning home and completing
          another StyleScan.
        </Text>

        <Pressable
          style={styles.errorButton}
          onPress={() =>
            navigation.navigate('Home')
          }
        >
          <Ionicons
            name="home-outline"
            size={20}
            color="#FFFFFF"
          />

          <Text
            style={styles.errorButtonText}
          >
            Back to Home
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Ambient Background */}

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
            onPress={() =>
              navigation.navigate('Home')
            }
          >
            <Ionicons
              name="chevron-back"
              size={25}
              color={COLORS.text}
            />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              STYLESCAN
            </Text>

            <Text
              style={styles.headerSubtitle}
            >
              Analysis Report
            </Text>
          </View>

          <Pressable
            style={styles.headerButton}
            onPress={() =>
              navigation.replace('Scan')
            }
          >
            <Ionicons
              name="refresh-outline"
              size={22}
              color={COLORS.text}
            />
          </Pressable>
        </View>

        {/* Analysis Status */}

        <View style={styles.completeBadge}>
          <View style={styles.completeDot} />

          <Text
            style={styles.completeBadgeText}
          >
            ANALYSIS COMPLETE
          </Text>

          <Ionicons
            name="checkmark-circle"
            size={14}
            color={COLORS.success}
          />
        </View>

        <Text style={styles.pageTitle}>
          Your facial profile.
        </Text>

        <Text style={styles.pageSubtitle}>
          StyleScan analyzed your key features
          to build a personalized grooming
          profile.
        </Text>

        {/* Main Profile Hero */}

        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />

          <View style={styles.heroTop}>
            {photoUri ? (
              <View style={styles.photoFrame}>
                <Image
                  source={{ uri: photoUri }}
                  style={styles.photo}
                />

                <View
                  style={[
                    styles.photoCorner,
                    styles.photoTopLeft,
                  ]}
                />

                <View
                  style={[
                    styles.photoCorner,
                    styles.photoTopRight,
                  ]}
                />

                <View
                  style={[
                    styles.photoCorner,
                    styles.photoBottomLeft,
                  ]}
                />

                <View
                  style={[
                    styles.photoCorner,
                    styles.photoBottomRight,
                  ]}
                />
              </View>
            ) : (
              <View
                style={styles.faceGraphic}
              >
                <View
                  style={styles.faceGraphicInner}
                >
                  <Ionicons
                    name="person-outline"
                    size={58}
                    color={COLORS.muted}
                  />

                  <View
                    style={styles.faceScanLine}
                  />
                </View>
              </View>
            )}

            <View style={styles.heroInfo}>
              <Text style={styles.heroEyebrow}>
                PRIMARY RESULT
              </Text>

              <Text style={styles.faceShape}>
                {result.faceShape.shape}
              </Text>

              <Text
                style={styles.faceShapeLabel}
              >
                Face Shape
              </Text>

              <ConfidenceBadge
                confidence={
                  result.faceShape.confidence
                }
              />
            </View>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroMetrics}>
            <HeroMetric
              icon="scan-outline"
              label="Shape"
              value={result.faceShape.shape}
            />

            <View
              style={styles.metricDivider}
            />

            <HeroMetric
              icon="color-palette-outline"
              label="Undertone"
              value={
                result.skinTone.undertone
              }
            />

            <View
              style={styles.metricDivider}
            />

            <HeroMetric
              icon="person-outline"
              label="Facial Hair"
              value={
                result.facialHair.present
                  ? 'Detected'
                  : 'None'
              }
            />
          </View>
        </View>

        {/* Insight Header */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>
            FEATURE ANALYSIS
          </Text>

          <Text style={styles.sectionTitle}>
            What StyleScan detected.
          </Text>
        </View>

        {/* Face Shape */}

        <InsightCard
          icon="scan-outline"
          eyebrow="FACE STRUCTURE"
          title="Face Shape"
        >
          <ResultRow
            label="Detected shape"
            value={result.faceShape.shape}
          />

          <ResultRow
            label="Confidence"
            value={
              result.faceShape.confidence
            }
          />

          <ConfidenceMeter
            confidence={
              result.faceShape.confidence
            }
          />

          <View style={styles.cardDivider} />

          <Text style={styles.insightText}>
            {result.faceShape.notes}
          </Text>
        </InsightCard>

        {/* Skin Tone */}

        <InsightCard
          icon="color-palette-outline"
          eyebrow="COMPLEXION"
          title="Skin Tone"
        >
          <View style={styles.toneSummary}>
            <View style={styles.toneOrb}>
              <Ionicons
                name="color-palette-outline"
                size={24}
                color={COLORS.primaryBlue}
              />
            </View>

            <View style={styles.toneInfo}>
              <Text style={styles.toneValue}>
                {result.skinTone.tone}
              </Text>

              <Text style={styles.toneLabel}>
                {result.skinTone.undertone}{' '}
                undertone
              </Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <Text style={styles.insightText}>
            {result.skinTone.notes}
          </Text>
        </InsightCard>

        {/* Facial Hair */}

        <InsightCard
          icon="person-outline"
          eyebrow="GROOMING PROFILE"
          title="Facial Hair"
        >
          <ResultRow
            label="Facial hair"
            value={
              result.facialHair.present
                ? 'Detected'
                : 'Not detected'
            }
          />

          <ResultRow
            label="Current style"
            value={result.facialHair.type}
          />

          <View style={styles.cardDivider} />

          <Text style={styles.insightText}>
            {result.facialHair.notes}
          </Text>
        </InsightCard>

        {/* AI Summary */}

        <View style={styles.aiSummary}>
          <View style={styles.aiSummaryGlow} />

          <View style={styles.aiSummaryHeader}>
            <View
              style={styles.aiSummaryIcon}
            >
              <Ionicons
                name="sparkles"
                size={22}
                color={COLORS.primaryBlue}
              />
            </View>

            <View
              style={styles.aiSummaryHeading}
            >
              <Text
                style={styles.aiSummaryEyebrow}
              >
                STYLESCAN INTELLIGENCE
              </Text>

              <Text
                style={styles.aiSummaryTitle}
              >
                AI Profile Summary
              </Text>
            </View>
          </View>

          <Text style={styles.aiSummaryText}>
            {result.summary}
          </Text>

          <View style={styles.summaryTags}>
            <SummaryTag
              icon="scan-outline"
              label={result.faceShape.shape}
            />

            <SummaryTag
              icon="color-palette-outline"
              label={
                result.skinTone.undertone
              }
            />

            <SummaryTag
              icon="person-outline"
              label={
                result.facialHair.type
              }
            />
          </View>
        </View>

        {/* Recommendations CTA */}

        <View style={styles.ctaCard}>
          <View style={styles.ctaTop}>
            <View style={styles.ctaIcon}>
              <Ionicons
                name="sparkles"
                size={26}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.ctaHeading}>
              <Text style={styles.ctaEyebrow}>
                NEXT STEP
              </Text>

              <Text style={styles.ctaTitle}>
                Discover your best styles.
              </Text>

              <Text style={styles.ctaSubtitle}>
                Turn your analysis into
                personalized hairstyle and
                facial-hair recommendations.
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.recommendButton,
              pressed &&
                styles.buttonPressed,
            ]}
            onPress={() =>
              navigation.navigate(
                'Recommendations',
                {
                  data: JSON.stringify(
                    result,
                  ),
                },
              )
            }
          >
            <Ionicons
              name="sparkles-outline"
              size={20}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.recommendButtonText
              }
            >
              View Recommendations
            </Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* Secondary Actions */}

        <View
          style={styles.secondaryActions}
        >
          <Pressable
            style={styles.secondaryAction}
            onPress={() =>
              navigation.replace('Scan')
            }
          >
            <Ionicons
              name="camera-outline"
              size={20}
              color={COLORS.text}
            />

            <Text
              style={
                styles.secondaryActionText
              }
            >
              Scan Again
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryAction}
            onPress={() =>
              navigation.navigate('Home')
            }
          >
            <Ionicons
              name="home-outline"
              size={20}
              color={COLORS.text}
            />

            <Text
              style={
                styles.secondaryActionText
              }
            >
              Home
            </Text>
          </Pressable>
        </View>

        {/* Privacy */}

        <View style={styles.privacyRow}>
          <Ionicons
            name="shield-checkmark-outline"
            size={15}
            color={COLORS.muted}
          />

          <Text style={styles.privacyText}>
            Your scan is used to create your
            StyleScan analysis and personalized
            recommendations.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ------------------------------------------------------
// Insight Card
// ------------------------------------------------------

type InsightCardProps = {
  icon: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
};

function InsightCard({
  icon,
  eyebrow,
  title,
  children,
}: InsightCardProps) {
  return (
    <View style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <View style={styles.insightIcon}>
          <Ionicons
            name={icon}
            size={22}
            color={COLORS.primaryBlue}
          />
        </View>

        <View style={styles.insightHeading}>
          <Text
            style={styles.insightEyebrow}
          >
            {eyebrow}
          </Text>

          <Text style={styles.insightTitle}>
            {title}
          </Text>
        </View>

        <View style={styles.detectedBadge}>
          <View
            style={styles.detectedDot}
          />

          <Text
            style={styles.detectedText}
          >
            DETECTED
          </Text>
        </View>
      </View>

      <View style={styles.insightBody}>
        {children}
      </View>
    </View>
  );
}

// ------------------------------------------------------
// Result Row
// ------------------------------------------------------

function ResultRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>
        {label}
      </Text>

      <Text
        style={styles.resultValue}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
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
// Confidence Meter
// ------------------------------------------------------

function ConfidenceMeter({
  confidence,
}: {
  confidence:
    | 'High'
    | 'Medium'
    | 'Low';
}) {
  const activeCount =
    confidence === 'High'
      ? 3
      : confidence === 'Medium'
        ? 2
        : 1;

  return (
    <View style={styles.confidenceMeter}>
      {[0, 1, 2].map((index) => (
        <View
          key={index}
          style={[
            styles.confidenceSegment,
            index < activeCount &&
              styles.confidenceSegmentActive,
          ]}
        />
      ))}
    </View>
  );
}

// ------------------------------------------------------
// Hero Metric
// ------------------------------------------------------

function HeroMetric({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.heroMetric}>
      <Ionicons
        name={icon}
        size={18}
        color={COLORS.primaryBlue}
      />

      <Text style={styles.metricLabel}>
        {label}
      </Text>

      <Text
        style={styles.metricValue}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

// ------------------------------------------------------
// Summary Tag
// ------------------------------------------------------

function SummaryTag({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <View style={styles.summaryTag}>
      <Ionicons
        name={icon}
        size={14}
        color={COLORS.primaryBlue}
      />

      <Text
        style={styles.summaryTagText}
        numberOfLines={1}
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

  ambientTop: {
    position: 'absolute',
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor:
      'rgba(98,132,255,0.055)',
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

  // Intro

  completeBadge: {
    alignSelf: 'flex-start',
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(69,214,166,0.07)',
    borderWidth: 1,
    borderColor:
      'rgba(69,214,166,0.13)',
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  completeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor:
      COLORS.success,
    marginRight: 7,
  },

  completeBadgeText: {
    color: COLORS.success,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginRight: 7,
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
    overflow: 'hidden',
  },

  heroGlow: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor:
      'rgba(98,132,255,0.055)',
    left: -65,
    top: -50,
  },

  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  photoFrame: {
    width: 118,
    height: 138,
    position: 'relative',
  },

  photo: {
    width: 118,
    height: 138,
    borderRadius: 20,
    resizeMode: 'cover',
  },

  photoCorner: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderColor:
      COLORS.primaryBlue,
  },

  photoTopLeft: {
    top: 7,
    left: 7,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },

  photoTopRight: {
    top: 7,
    right: 7,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },

  photoBottomLeft: {
    bottom: 7,
    left: 7,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },

  photoBottomRight: {
    bottom: 7,
    right: 7,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },

  faceGraphic: {
    width: 118,
    height: 138,
    borderRadius: 20,
    backgroundColor:
      'rgba(98,132,255,0.045)',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  faceGraphicInner: {
    width: 88,
    height: 108,
    borderRadius: 44,
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  faceScanLine: {
    position: 'absolute',
    width: 72,
    height: 1.5,
    backgroundColor:
      COLORS.primaryBlue,
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

  faceShapeLabel: {
    color: COLORS.secondary,
    fontSize: 12,
    marginTop: 1,
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

  heroDivider: {
    height: 1,
    backgroundColor:
      COLORS.border,
    marginVertical: 17,
  },

  heroMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heroMetric: {
    flex: 1,
    alignItems: 'center',
  },

  metricLabel: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: '700',
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },

  metricValue: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
    maxWidth: 90,
  },

  metricDivider: {
    width: 1,
    height: 34,
    backgroundColor:
      COLORS.border,
  },

  // Section

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

  // Insight Cards

  insightCard: {
    backgroundColor:
      COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 13,
    overflow: 'hidden',
  },

  insightHeader: {
    minHeight: 69,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor:
      'rgba(98,132,255,0.09)',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  insightHeading: {
    flex: 1,
  },

  insightEyebrow: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  insightTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },

  detectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor:
      COLORS.success,
    marginRight: 5,
  },

  detectedText: {
    color: COLORS.success,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  insightBody: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 15,
  },

  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 11,
  },

  resultLabel: {
    color: COLORS.secondary,
    fontSize: 12,
  },

  resultValue: {
    flex: 1,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
    marginLeft: 20,
  },

  confidenceMeter: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 2,
  },

  confidenceSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor:
      'rgba(255,255,255,0.06)',
  },

  confidenceSegmentActive: {
    backgroundColor:
      COLORS.success,
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

  // Tone

  toneSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  toneOrb: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor:
      'rgba(98,132,255,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  toneInfo: {
    flex: 1,
  },

  toneValue: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '700',
  },

  toneLabel: {
    color: COLORS.secondary,
    fontSize: 11,
    marginTop: 3,
  },

  // AI Summary

  aiSummary: {
    backgroundColor:
      '#0E1426',
    borderWidth: 1,
    borderColor:
      COLORS.borderBlue,
    borderRadius: 22,
    padding: 17,
    marginTop: 4,
    overflow: 'hidden',
  },

  aiSummaryGlow: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor:
      'rgba(98,132,255,0.045)',
    top: -80,
    right: -70,
  },

  aiSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  aiSummaryIcon: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor:
      'rgba(98,132,255,0.11)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  aiSummaryHeading: {
    flex: 1,
  },

  aiSummaryEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  aiSummaryTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 3,
  },

  aiSummaryText: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 20,
    marginTop: 16,
  },

  summaryTags: {
    flexDirection: 'row',
    marginTop: 16,
  },

  summaryTag: {
    flex: 1,
    height: 35,
    borderRadius: 11,
    backgroundColor:
      'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
    paddingHorizontal: 6,
  },

  summaryTagText: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '600',
    marginLeft: 5,
    maxWidth: 70,
  },

  // CTA

  ctaCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 17,
    marginTop: 15,
  },

  ctaTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ctaIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor:
      COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  ctaHeading: {
    flex: 1,
  },

  ctaEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  ctaTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 3,
  },

  ctaSubtitle: {
    color: COLORS.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  recommendButton: {
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

  recommendButtonText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Secondary Actions

  secondaryActions: {
    flexDirection: 'row',
    gap: 11,
    marginTop: 13,
  },

  secondaryAction: {
    flex: 1,
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
  },

  secondaryActionText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },

  // Privacy

  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 12,
  },

  privacyText: {
    flex: 1,
    color: COLORS.muted,
    fontSize: 9,
    lineHeight: 14,
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
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor:
      COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 26,
  },

  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});