import React, {
  useLayoutEffect,
  useMemo,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import type { RootStackScreenProps } from '../navigation/types';
import type { ScanResult } from '../utils/types';

type Props = RootStackScreenProps<'Results'>;

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

  // ------------------------------------------------------
  // Invalid / Missing Results
  // ------------------------------------------------------

  if (!result) {
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
          Results unavailable
        </Text>

        <Text style={styles.errorText}>
          We couldn't load your scan
          results. Try scanning your face
          again.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate('Home')
          }
        >
          <Text
            style={styles.primaryButtonText}
          >
            Back to Home
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // ------------------------------------------------------
  // Results
  // ------------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
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
            YOUR RESULTS
          </Text>

          <Text style={styles.headerSubtitle}>
            StyleScan AI
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
            size={23}
            color={COLORS.text}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* Success Status */}

        <View style={styles.successBadge}>
          <View
            style={styles.successDot}
          />

          <Text
            style={styles.successBadgeText}
          >
            ANALYSIS COMPLETE
          </Text>
        </View>

        <Text style={styles.pageTitle}>
          Your StyleScan Profile
        </Text>

        <Text style={styles.pageSubtitle}>
          Here's what our AI detected from
          your facial features.
        </Text>

        {/* Profile Hero */}

        <View style={styles.profileCard}>
          {photoUri ? (
            <View style={styles.photoWrapper}>
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
              style={
                styles.photoPlaceholder
              }
            >
              <Ionicons
                name="person-outline"
                size={54}
                color={COLORS.muted}
              />
            </View>
          )}

          <View style={styles.profileInfo}>
            <Text style={styles.profileLabel}>
              FACE SHAPE
            </Text>

            <Text style={styles.faceShape}>
              {result.faceShape.shape}
            </Text>

            <ConfidenceBadge
              confidence={
                result.faceShape.confidence
              }
            />
          </View>
        </View>

        {/* Face Shape Analysis */}

        <AnalysisCard
          icon="scan-outline"
          title="Face Shape"
        >
          <DataRow
            label="Detected Shape"
            value={result.faceShape.shape}
          />

          <DataRow
            label="Confidence"
            value={
              result.faceShape.confidence
            }
          />

          <Divider />

          <Text style={styles.notes}>
            {result.faceShape.notes}
          </Text>
        </AnalysisCard>

        {/* Skin Tone Analysis */}

        <AnalysisCard
          icon="color-palette-outline"
          title="Skin Tone"
        >
          <DataRow
            label="Tone"
            value={result.skinTone.tone}
          />

          <DataRow
            label="Undertone"
            value={
              result.skinTone.undertone
            }
          />

          <Divider />

          <Text style={styles.notes}>
            {result.skinTone.notes}
          </Text>
        </AnalysisCard>

        {/* Facial Hair Analysis */}

        <AnalysisCard
          icon="person-outline"
          title="Facial Hair"
        >
          <DataRow
            label="Detected"
            value={
              result.facialHair.present
                ? 'Yes'
                : 'No'
            }
          />

          <DataRow
            label="Current Style"
            value={result.facialHair.type}
          />

          <Divider />

          <Text style={styles.notes}>
            {result.facialHair.notes}
          </Text>
        </AnalysisCard>

        {/* AI Summary */}

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIcon}>
              <Ionicons
                name="sparkles"
                size={21}
                color={COLORS.primaryBlue}
              />
            </View>

            <View>
              <Text
                style={styles.summaryEyebrow}
              >
                STYLESCAN AI
              </Text>

              <Text
                style={styles.summaryTitle}
              >
                Your Analysis
              </Text>
            </View>
          </View>

          <Text style={styles.summaryText}>
            {result.summary}
          </Text>
        </View>

        {/* Recommendation CTA */}

        <View
          style={styles.recommendationCard}
        >
          <View style={styles.recommendationTop}>
            <View
              style={
                styles.recommendationIcon
              }
            >
              <Ionicons
                name="sparkles"
                size={26}
                color="#FFFFFF"
              />
            </View>

            <View
              style={
                styles.recommendationText
              }
            >
              <Text
                style={
                  styles.recommendationTitle
                }
              >
                Ready for your styles?
              </Text>

              <Text
                style={
                  styles.recommendationSubtitle
                }
              >
                Get hairstyle and beard
                recommendations built around
                your results.
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.recommendButton}
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
              name="sparkles"
              size={20}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.recommendButtonText
              }
            >
              View My Recommendations
            </Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* Scan Again */}

        <Pressable
          style={styles.scanAgainButton}
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
            style={styles.scanAgainText}
          >
            Scan Again
          </Text>
        </Pressable>

        {/* Privacy Note */}

        <View style={styles.privacyRow}>
          <Ionicons
            name="shield-checkmark-outline"
            size={16}
            color={COLORS.muted}
          />

          <Text style={styles.privacyText}>
            Your scan is used only to
            generate your personalized
            results.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ------------------------------------------------------
// Analysis Card
// ------------------------------------------------------

type AnalysisCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
};

function AnalysisCard({
  icon,
  title,
  children,
}: AnalysisCardProps) {
  return (
    <View style={styles.analysisCard}>
      <View
        style={styles.analysisHeader}
      >
        <View style={styles.analysisIcon}>
          <Ionicons
            name={icon}
            size={22}
            color={COLORS.primaryBlue}
          />
        </View>

        <Text
          style={styles.analysisTitle}
        >
          {title}
        </Text>

        <View
          style={styles.completeIcon}
        >
          <Ionicons
            name="checkmark"
            size={14}
            color={COLORS.success}
          />
        </View>
      </View>

      <View
        style={styles.analysisContent}
      >
        {children}
      </View>
    </View>
  );
}

// ------------------------------------------------------
// Data Row
// ------------------------------------------------------

type DataRowProps = {
  label: string;
  value: string;
};

function DataRow({
  label,
  value,
}: DataRowProps) {
  return (
    <View style={styles.dataRow}>
      <Text style={styles.dataLabel}>
        {label}
      </Text>

      <Text
        style={styles.dataValue}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

// ------------------------------------------------------
// Divider
// ------------------------------------------------------

function Divider() {
  return <View style={styles.divider} />;
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
  let iconColor = COLORS.success;
  let backgroundColor =
    'rgba(69,214,166,0.12)';

  if (confidence === 'Medium') {
    iconColor = COLORS.warning;
    backgroundColor =
      'rgba(255,180,84,0.12)';
  }

  if (confidence === 'Low') {
    iconColor = COLORS.error;
    backgroundColor =
      'rgba(255,107,120,0.12)';
  }

  return (
    <View
      style={[
        styles.confidenceBadge,
        { backgroundColor },
      ]}
    >
      <View
        style={[
          styles.confidenceDot,
          {
            backgroundColor: iconColor,
          },
        ]}
      />

      <Text
        style={[
          styles.confidenceText,
          {
            color: iconColor,
          },
        ]}
      >
        {confidence} Confidence
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

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Header

  header: {
    height: 72,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
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
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2.5,
  },

  headerSubtitle: {
    marginTop: 2,
    color: COLORS.secondary,
    fontSize: 11,
  },

  // Intro

  successBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(69,214,166,0.10)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  successDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 7,
  },

  successBadgeText: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  pageTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.6,
    marginTop: 15,
  },

  pageSubtitle: {
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    marginBottom: 22,
    maxWidth: 340,
  },

  // Profile

  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  photoWrapper: {
    width: 112,
    height: 132,
    position: 'relative',
  },

  photo: {
    width: 112,
    height: 132,
    borderRadius: 17,
    resizeMode: 'cover',
  },

  photoPlaceholder: {
    width: 112,
    height: 132,
    borderRadius: 17,
    backgroundColor:
      COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  photoCorner: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderColor: COLORS.primaryBlue,
  },

  photoTopLeft: {
    top: 7,
    left: 7,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 5,
  },

  photoTopRight: {
    top: 7,
    right: 7,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 5,
  },

  photoBottomLeft: {
    bottom: 7,
    left: 7,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 5,
  },

  photoBottomRight: {
    bottom: 7,
    right: 7,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 5,
  },

  profileInfo: {
    flex: 1,
    marginLeft: 18,
  },

  profileLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  faceShape: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '700',
    marginTop: 5,
  },

  confidenceBadge: {
    alignSelf: 'flex-start',
    marginTop: 11,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },

  confidenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 7,
  },

  confidenceText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Analysis Cards

  analysisCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    marginBottom: 13,
    overflow: 'hidden',
  },

  analysisHeader: {
    minHeight: 68,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  analysisIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#171D31',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  analysisTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },

  completeIcon: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor:
      'rgba(69,214,166,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  analysisContent: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },

  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 11,
  },

  dataLabel: {
    color: COLORS.secondary,
    fontSize: 13,
  },

  dataValue: {
    flex: 1,
    marginLeft: 25,
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 3,
    marginBottom: 12,
  },

  notes: {
    color: COLORS.secondary,
    fontSize: 13,
    lineHeight: 20,
  },

  // Summary

  summaryCard: {
    backgroundColor: '#111629',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.28)',
    borderRadius: 18,
    padding: 17,
    marginTop: 3,
    marginBottom: 16,
  },

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor:
      'rgba(98,132,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  summaryEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  summaryTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 2,
  },

  summaryText: {
    color: COLORS.secondary,
    fontSize: 13,
    lineHeight: 21,
  },

  // Recommendation CTA

  recommendationCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 17,
  },

  recommendationTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  recommendationIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  recommendationText: {
    flex: 1,
  },

  recommendationTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
  },

  recommendationSubtitle: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  recommendButton: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    paddingHorizontal: 17,
  },

  recommendButtonText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Scan Again

  scanAgainButton: {
    height: 55,
    marginTop: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  scanAgainText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },

  // Privacy

  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    paddingHorizontal: 20,
  },

  privacyText: {
    flex: 1,
    marginLeft: 8,
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
  },

  // Error

  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 22,
  },

  errorText: {
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 9,
  },

  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});