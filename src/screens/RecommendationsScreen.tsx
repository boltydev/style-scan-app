import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from '@expo/vector-icons/Ionicons';

import { getRecommendations } from '../utils/recommendApi';

import type {
  RootStackScreenProps,
} from '../navigation/types';

import type {
  ScanResult,
  RecommendationResult,
} from '../utils/types';

type Props =
  RootStackScreenProps<'Recommendations'>;

/*
  TEMPORARY UI PREVIEW MODE

  Keep true while using the simulator.

  When the real recommendation API is ready
  for testing, this can be changed to false.
*/
const USE_MOCK_RECOMMENDATIONS = true;

const MOCK_RECOMMENDATIONS: RecommendationResult = {
  hairstyles: [
    {
      name: 'Textured Crop',
      reason:
        'A textured crop works well with an oval face because it adds definition without making the face appear longer.',
    },
    {
      name: 'Low Taper Fade',
      reason:
        'A low taper keeps the sides clean while preserving enough volume on top to maintain balanced facial proportions.',
    },
    {
      name: 'Short Twists',
      reason:
        'Short twists add texture and personality while complementing the natural balance of an oval face shape.',
    },
  ],

  beardStyles: [
    {
      name: 'Short Boxed Beard',
      reason:
        'A short boxed beard adds definition around the jaw while keeping your facial proportions balanced.',
    },
    {
      name: 'Clean Stubble',
      reason:
        'Light stubble creates subtle jaw definition without overpowering your natural face shape.',
    },
    {
      name: 'Defined Goatee',
      reason:
        'A clean goatee can emphasize the chin and create a sharper, more structured appearance.',
    },
  ],

  summary:
    'Your oval face shape gives you a lot of flexibility. Styles with texture, controlled volume, and clean sides should work especially well while keeping your natural proportions balanced.',
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

  text: '#F7F8FC',
  secondary: '#A5ACBC',
  muted: '#6F7688',

  success: '#45D6A6',
  warning: '#FFB454',
  error: '#FF6B78',
};

export default function RecommendationsScreen({
  route,
  navigation,
}: Props) {
  const { data } = route.params;

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [recs, setRecs] =
    useState<RecommendationResult | null>(
      null,
    );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const scan: ScanResult | null =
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
  // Load Recommendations
  // ------------------------------------------------------

  useEffect(() => {
    if (!scan) {
      setLoading(false);
      setError('Missing scan data.');
      return;
    }

    setLoading(true);
    setError('');

    if (USE_MOCK_RECOMMENDATIONS) {
      const timer = setTimeout(() => {
        setRecs(
          MOCK_RECOMMENDATIONS,
        );

        setLoading(false);
      }, 700);

      return () =>
        clearTimeout(timer);
    }

    getRecommendations(scan)
      .then((result) => {
        setRecs(result);
      })
      .catch((e) => {
        setError(
          e instanceof Error
            ? e.message
            : 'Something went wrong.',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [scan]);

  // ------------------------------------------------------
  // Loading
  // ------------------------------------------------------

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
        <View style={styles.loadingGlow} />

        <View
          style={styles.loadingIconOuter}
        >
          <View
            style={styles.loadingIconInner}
          >
            <Ionicons
              name="sparkles"
              size={38}
              color={COLORS.primaryBlue}
            />
          </View>
        </View>

        <View style={styles.loadingBadge}>
          <View
            style={styles.loadingBadgeDot}
          />

          <Text
            style={styles.loadingBadgeText}
          >
            STYLE MATCHING ACTIVE
          </Text>
        </View>

        <Text style={styles.loadingTitle}>
          Building your style profile.
        </Text>

        <Text style={styles.loadingText}>
          StyleScan AI is matching your
          features with personalized grooming
          recommendations.
        </Text>

        <ActivityIndicator
          size="small"
          color={COLORS.primaryBlue}
          style={styles.spinner}
        />

        <View
          style={styles.loadingSteps}
        >
          <LoadingStep
            icon="scan-outline"
            label="Profile"
          />

          <LoadingStep
            icon="git-compare-outline"
            label="Matching"
          />

          <LoadingStep
            icon="sparkles-outline"
            label="Styles"
          />
        </View>
      </SafeAreaView>
    );
  }

  // ------------------------------------------------------
  // Error
  // ------------------------------------------------------

  if (error || !recs) {
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
          MATCHING INTERRUPTED
        </Text>

        <Text style={styles.errorTitle}>
          Recommendations unavailable.
        </Text>

        <Text style={styles.errorText}>
          {error ||
            'Something went wrong while loading your recommendations.'}
        </Text>

        <Pressable
          style={styles.errorButton}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Ionicons
            name="arrow-back-outline"
            size={20}
            color="#FFFFFF"
          />

          <Text
            style={styles.errorButtonText}
          >
            Back to Results
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // ------------------------------------------------------
  // Main Screen
  // ------------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <View
        pointerEvents="none"
        style={styles.ambientTop}
      />

      <View
        pointerEvents="none"
        style={styles.ambientSide}
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
              navigation.goBack()
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
              Style Intelligence
            </Text>
          </View>

          <Pressable
            style={styles.headerButton}
            onPress={() =>
              navigation.navigate('Home')
            }
          >
            <Ionicons
              name="home-outline"
              size={22}
              color={COLORS.text}
            />
          </Pressable>
        </View>

        {/* Match Status */}

        <View style={styles.matchBadge}>
          <View style={styles.matchDot} />

          <Text
            style={styles.matchBadgeText}
          >
            PERSONALIZED MATCHES READY
          </Text>

          <Ionicons
            name="checkmark-circle"
            size={14}
            color={COLORS.success}
          />
        </View>

        <Text style={styles.pageTitle}>
          Your style matches.
        </Text>

        <Text style={styles.pageSubtitle}>
          Recommendations selected around
          your facial structure and grooming
          profile.
        </Text>

        {/* AI Style Direction */}

        <View style={styles.directionCard}>
          <View
            style={styles.directionGlow}
          />

          <View
            style={styles.directionHeader}
          >
            <View
              style={styles.directionIcon}
            >
              <Ionicons
                name="sparkles"
                size={24}
                color={COLORS.primaryBlue}
              />
            </View>

            <View
              style={
                styles.directionHeading
              }
            >
              <Text
                style={
                  styles.directionEyebrow
                }
              >
                STYLESCAN INTELLIGENCE
              </Text>

              <Text
                style={
                  styles.directionTitle
                }
              >
                Your Style Direction
              </Text>
            </View>
          </View>

          <Text
            style={styles.directionText}
          >
            {recs.summary}
          </Text>

          {scan && (
            <View
              style={styles.profileChips}
            >
              <ProfileChip
                icon="scan-outline"
                label={scan.faceShape.shape}
              />

              <ProfileChip
                icon="color-palette-outline"
                label={
                  scan.skinTone.undertone
                }
              />

              <ProfileChip
                icon="person-outline"
                label={
                  scan.facialHair.present
                    ? scan.facialHair.type
                    : 'Clean Shaven'
                }
              />
            </View>
          )}
        </View>

        {/* Hairstyle Header */}

        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={styles.sectionEyebrow}
            >
              HAIRSTYLE MATCHES
            </Text>

            <Text
              style={styles.sectionTitle}
            >
              Best looks for you.
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text
              style={styles.countNumber}
            >
              {recs.hairstyles.length}
            </Text>

            <Text
              style={styles.countLabel}
            >
              PICKS
            </Text>
          </View>
        </View>

        {/* Hero Recommendation */}

        {recs.hairstyles.length > 0 && (
          <FeaturedRecommendation
            category="TOP HAIR MATCH"
            icon="cut-outline"
            number={1}
            title={
              recs.hairstyles[0].name
            }
            reason={
              recs.hairstyles[0].reason
            }
          />
        )}

        {/* Remaining Hairstyles */}

        {recs.hairstyles
          .slice(1)
          .map((style, index) => (
            <RecommendationCard
              key={`hair-${index + 1}`}
              number={index + 2}
              icon="cut-outline"
              title={style.name}
              reason={style.reason}
            />
          ))}

        {/* Beard Section */}

        {recs.beardStyles.length >
          0 && (
          <>
            <View
              style={[
                styles.sectionHeader,
                styles.secondSection,
              ]}
            >
              <View>
                <Text
                  style={
                    styles.sectionEyebrow
                  }
                >
                  FACIAL HAIR MATCHES
                </Text>

                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Refine your profile.
                </Text>
              </View>

              <View
                style={styles.countBadge}
              >
                <Text
                  style={
                    styles.countNumber
                  }
                >
                  {
                    recs.beardStyles
                      .length
                  }
                </Text>

                <Text
                  style={
                    styles.countLabel
                  }
                >
                  PICKS
                </Text>
              </View>
            </View>

            {recs.beardStyles.map(
              (style, index) => (
                <RecommendationCard
                  key={`beard-${index}`}
                  number={index + 1}
                  icon="person-outline"
                  title={style.name}
                  reason={style.reason}
                />
              ),
            )}
          </>
        )}

        {/* Barber Tip */}

        <View style={styles.barberCard}>
          <View style={styles.barberTop}>
            <View style={styles.barberIcon}>
              <Ionicons
                name="cut-outline"
                size={23}
                color={COLORS.primaryBlue}
              />
            </View>

            <View
              style={styles.barberHeading}
            >
              <Text
                style={styles.barberEyebrow}
              >
                STYLESCAN TIP
              </Text>

              <Text
                style={styles.barberTitle}
              >
                Bring your picks with you.
              </Text>
            </View>
          </View>

          <Text style={styles.barberText}>
            Use these recommendations as a
            starting point when talking with
            your barber or stylist. They can
            adapt each look to your hair type
            and personal preferences.
          </Text>
        </View>

        {/* Actions */}

        <Pressable
          style={({ pressed }) => [
            styles.scanAgainButton,
            pressed &&
              styles.buttonPressed,
          ]}
          onPress={() =>
            navigation.replace('Scan')
          }
        >
          <View
            style={styles.actionIconBox}
          >
            <Ionicons
              name="scan-outline"
              size={20}
              color="#FFFFFF"
            />
          </View>

          <Text
            style={styles.scanAgainText}
          >
            Start Another Scan
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFFFFF"
          />
        </Pressable>

        <Pressable
          style={styles.homeButton}
          onPress={() =>
            navigation.navigate('Home')
          }
        >
          <Ionicons
            name="home-outline"
            size={20}
            color={COLORS.secondary}
          />

          <Text style={styles.homeText}>
            Back to Home
          </Text>
        </Pressable>

        <View style={styles.footerNote}>
          <Ionicons
            name="sparkles-outline"
            size={14}
            color={COLORS.muted}
          />

          <Text
            style={styles.footerNoteText}
          >
            Recommendations are generated
            from your StyleScan profile.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ------------------------------------------------------
// Featured Recommendation
// ------------------------------------------------------

type FeaturedRecommendationProps = {
  category: string;
  icon: keyof typeof Ionicons.glyphMap;
  number: number;
  title: string;
  reason: string;
};

function FeaturedRecommendation({
  category,
  icon,
  number,
  title,
  reason,
}: FeaturedRecommendationProps) {
  return (
    <View style={styles.featuredCard}>
      <View style={styles.featuredGlow} />

      <View style={styles.featuredHeader}>
        <View
          style={styles.featuredIcon}
        >
          <Ionicons
            name={icon}
            size={27}
            color={COLORS.primaryBlue}
          />
        </View>

        <View
          style={styles.featuredHeading}
        >
          <Text
            style={styles.featuredEyebrow}
          >
            {category}
          </Text>

          <Text
            style={styles.featuredTitle}
          >
            {title}
          </Text>
        </View>

        <View style={styles.topBadge}>
          <Ionicons
            name="star"
            size={13}
            color={COLORS.warning}
          />

          <Text style={styles.topText}>
            TOP
          </Text>
        </View>
      </View>

      <View style={styles.featuredDivider} />

      <Text style={styles.whyLabel}>
        WHY IT WORKS
      </Text>

      <Text style={styles.featuredReason}>
        {reason}
      </Text>

      <View style={styles.featuredFooter}>
        <View style={styles.matchStatus}>
          <View
            style={styles.matchStatusDot}
          />

          <Text
            style={styles.matchStatusText}
          >
            RECOMMENDED FOR YOUR PROFILE
          </Text>
        </View>

        <Text
          style={styles.rankNumber}
        >
          0{number}
        </Text>
      </View>
    </View>
  );
}

// ------------------------------------------------------
// Recommendation Card
// ------------------------------------------------------

type RecommendationCardProps = {
  number: number;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  reason: string;
};

function RecommendationCard({
  number,
  icon,
  title,
  reason,
}: RecommendationCardProps) {
  return (
    <View
      style={styles.recommendationCard}
    >
      <View
        style={styles.recommendationHeader}
      >
        <View
          style={styles.recommendationNumber}
        >
          <Text
            style={
              styles.recommendationNumberText
            }
          >
            {String(number).padStart(
              2,
              '0',
            )}
          </Text>
        </View>

        <View
          style={styles.recommendationIcon}
        >
          <Ionicons
            name={icon}
            size={22}
            color={COLORS.primaryBlue}
          />
        </View>

        <View
          style={
            styles.recommendationHeading
          }
        >
          <Text
            style={
              styles.recommendationEyebrow
            }
          >
            STYLE MATCH
          </Text>

          <Text
            style={
              styles.recommendationTitle
            }
          >
            {title}
          </Text>
        </View>

        <View
          style={
            styles.recommendedBadge
          }
        >
          <Ionicons
            name="checkmark"
            size={13}
            color={COLORS.success}
          />
        </View>
      </View>

      <View
        style={styles.cardDivider}
      />

      <Text style={styles.whyLabel}>
        WHY IT WORKS
      </Text>

      <Text
        style={
          styles.recommendationReason
        }
      >
        {reason}
      </Text>
    </View>
  );
}

// ------------------------------------------------------
// Profile Chip
// ------------------------------------------------------

function ProfileChip({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.profileChip}>
      <Ionicons
        name={icon}
        size={14}
        color={COLORS.primaryBlue}
      />

      <Text
        style={styles.profileChipText}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

// ------------------------------------------------------
// Loading Step
// ------------------------------------------------------

function LoadingStep({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.loadingStep}>
      <Ionicons
        name={icon}
        size={18}
        color={COLORS.primaryBlue}
      />

      <Text
        style={styles.loadingStepText}
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
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor:
      'rgba(98,132,255,0.055)',
    top: -170,
    right: -105,
  },

  ambientSide: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor:
      'rgba(115,87,255,0.035)',
    top: 690,
    left: -180,
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

  matchBadge: {
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

  matchDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor:
      COLORS.success,
    marginRight: 7,
  },

  matchBadgeText: {
    color: COLORS.success,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
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

  // Direction Card

  directionCard: {
    backgroundColor: '#0E1426',
    borderWidth: 1,
    borderColor: COLORS.borderBlue,
    borderRadius: 24,
    padding: 18,
    overflow: 'hidden',
  },

  directionGlow: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor:
      'rgba(98,132,255,0.05)',
    top: -105,
    right: -80,
  },

  directionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  directionIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor:
      'rgba(98,132,255,0.11)',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  directionHeading: {
    flex: 1,
  },

  directionEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  directionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 3,
  },

  directionText: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 20,
    marginTop: 16,
  },

  profileChips: {
    flexDirection: 'row',
    marginTop: 17,
  },

  profileChip: {
    flex: 1,
    height: 36,
    borderRadius: 11,
    backgroundColor:
      'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginHorizontal: 3,
  },

  profileChipText: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '600',
    marginLeft: 5,
    maxWidth: 70,
  },

  // Section Header

  sectionHeader: {
    marginTop: 30,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  secondSection: {
    marginTop: 31,
  },

  sectionEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '700',
    marginTop: 4,
  },

  countBadge: {
    minWidth: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  countNumber: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },

  countLabel: {
    color: COLORS.muted,
    fontSize: 6,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 1,
  },

  // Featured Card

  featuredCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderBlue,
    borderRadius: 23,
    padding: 17,
    overflow: 'hidden',
    marginBottom: 13,
  },

  featuredGlow: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor:
      'rgba(98,132,255,0.045)',
    top: -95,
    left: -60,
  },

  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  featuredIcon: {
    width: 55,
    height: 55,
    borderRadius: 17,
    backgroundColor:
      'rgba(98,132,255,0.10)',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  featuredHeading: {
    flex: 1,
  },

  featuredEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  featuredTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '700',
    marginTop: 3,
  },

  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(255,180,84,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(255,180,84,0.15)',
    borderRadius: 13,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  topText: {
    color: COLORS.warning,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginLeft: 4,
  },

  featuredDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 15,
  },

  whyLabel: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  featuredReason: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 20,
    marginTop: 7,
  },

  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginTop: 16,
  },

  matchStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  matchStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor:
      COLORS.success,
    marginRight: 6,
  },

  matchStatusText: {
    color: COLORS.success,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  rankNumber: {
    color: 'rgba(255,255,255,0.07)',
    fontSize: 30,
    fontWeight: '800',
  },

  // Regular Recommendation

  recommendationCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },

  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  recommendationNumber: {
    width: 31,
    alignItems: 'flex-start',
  },

  recommendationNumberText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '800',
  },

  recommendationIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor:
      'rgba(98,132,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  recommendationHeading: {
    flex: 1,
  },

  recommendationEyebrow: {
    color: COLORS.muted,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.1,
  },

  recommendationTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 3,
  },

  recommendedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor:
      'rgba(69,214,166,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(69,214,166,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardDivider: {
    height: 1,
    backgroundColor:
      COLORS.border,
    marginVertical: 14,
  },

  recommendationReason: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },

  // Barber Card

  barberCard: {
    marginTop: 18,
    borderRadius: 21,
    backgroundColor: '#0E1426',
    borderWidth: 1,
    borderColor: COLORS.borderBlue,
    padding: 17,
  },

  barberTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  barberIcon: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor:
      'rgba(98,132,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  barberHeading: {
    flex: 1,
  },

  barberEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  barberTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 3,
  },

  barberText: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 20,
    marginTop: 14,
  },

  // Actions

  scanAgainButton: {
    height: 58,
    borderRadius: 17,
    backgroundColor:
      COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
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

  actionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor:
      'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanAgainText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  homeButton: {
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
    marginTop: 11,
  },

  homeText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '600',
  },

  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 17,
    paddingHorizontal: 15,
  },

  footerNoteText: {
    color: COLORS.muted,
    fontSize: 9,
    lineHeight: 14,
    marginLeft: 7,
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

  loadingGlow: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor:
      'rgba(98,132,255,0.055)',
  },

  loadingIconOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor:
      'rgba(98,132,255,0.04)',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingIconInner: {
    width: 82,
    height: 82,
    borderRadius: 26,
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
    textAlign: 'center',
    marginTop: 18,
  },

  loadingText: {
    color: COLORS.secondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 320,
  },

  spinner: {
    marginTop: 19,
  },

  loadingSteps: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 24,
  },

  loadingStep: {
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

  loadingStepText: {
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