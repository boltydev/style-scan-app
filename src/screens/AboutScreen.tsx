import React, {
  useLayoutEffect,
} from 'react';

import {
  View,
  Text,
  StyleSheet,ScrollView,
  Pressable,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from 'react-native-vector-icons/Ionicons';

import type {
  RootStackScreenProps,
} from '../navigation/types';

type Props =
  RootStackScreenProps<'About'>;

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
};

export default function AboutScreen({
  navigation,
}: Props) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Ambient Background */}

      <View
        pointerEvents="none"
        style={styles.ambientTop}
      />

      <View
        pointerEvents="none"
        style={styles.ambientSide}
      />

      <ScrollView
        style={styles.scrollView}
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
              About the experience
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

        {/* Hero */}

        <View style={styles.hero}>
          <View style={styles.logoOrbit}>
            <View style={styles.logoGlow} />

            <View style={styles.logoCore}>
              <Ionicons
                name="scan-outline"
                size={42}
                color={COLORS.primaryBlue}
              />
            </View>
          </View>

          <View style={styles.aiBadge}>
            <View style={styles.aiDot} />

            <Text style={styles.aiBadgeText}>
              AI-POWERED GROOMING
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            Style intelligence,
          </Text>

          <Text
            style={styles.heroAccent}
          >
            built around you.
          </Text>

          <Text
            style={styles.heroSubtitle}
          >
            StyleScan analyzes facial features
            and turns them into personalized
            hairstyle and facial-hair guidance.
          </Text>
        </View>

        {/* Intelligence */}

        <View style={styles.intelligenceCard}>
          <View
            style={styles.intelligenceGlow}
          />

          <View
            style={styles.intelligenceHeader}
          >
            <View
              style={styles.intelligenceIcon}
            >
              <Ionicons
                name="sparkles"
                size={24}
                color={COLORS.primaryBlue}
              />
            </View>

            <View
              style={styles.intelligenceHeading}
            >
              <Text
                style={
                  styles.intelligenceEyebrow
                }
              >
                STYLESCAN INTELLIGENCE
              </Text>

              <Text
                style={
                  styles.intelligenceTitle
                }
              >
                One scan. More insight.
              </Text>
            </View>
          </View>

          <Text
            style={styles.intelligenceText}
          >
            Your StyleScan profile combines
            facial structure, complexion
            information, and facial-hair details
            to help surface grooming ideas that
            complement your features.
          </Text>

          <View
            style={styles.intelligenceStats}
          >
            <MiniStat
              icon="scan-outline"
              label="Face"
            />

            <View
              style={styles.statDivider}
            />

            <MiniStat
              icon="color-palette-outline"
              label="Tone"
            />

            <View
              style={styles.statDivider}
            />

            <MiniStat
              icon="person-outline"
              label="Grooming"
            />

            <View
              style={styles.statDivider}
            />

            <MiniStat
              icon="sparkles-outline"
              label="Style"
            />
          </View>
        </View>

        {/* How It Works */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>
            HOW IT WORKS
          </Text>

          <Text style={styles.sectionTitle}>
            From face scan to style.
          </Text>

          <Text
            style={styles.sectionSubtitle}
          >
            StyleScan turns a simple capture
            into a personalized grooming
            profile.
          </Text>
        </View>

        <View style={styles.timeline}>
          <TimelineStep
            number="01"
            icon="camera-outline"
            title="Capture"
            description="Center your face and capture a clear, evenly lit photo."
            first
          />

          <TimelineStep
            number="02"
            icon="scan-outline"
            title="Analyze"
            description="StyleScan evaluates your facial structure and visible features."
          />

          <TimelineStep
            number="03"
            icon="analytics-outline"
            title="Build your profile"
            description="Your scan becomes a structured grooming profile."
          />

          <TimelineStep
            number="04"
            icon="sparkles-outline"
            title="Discover styles"
            description="AI-powered recommendations help you explore looks suited to your profile."
            last
          />
        </View>

        {/* Capabilities */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>
            ANALYSIS LAYERS
          </Text>

          <Text style={styles.sectionTitle}>
            What StyleScan looks at.
          </Text>
        </View>

        <View style={styles.capabilityGrid}>
          <CapabilityCard
            icon="scan-outline"
            title="Face Shape"
            description="Identifies overall facial structure and proportions."
          />

          <CapabilityCard
            icon="color-palette-outline"
            title="Skin Tone"
            description="Adds complexion context to your StyleScan profile."
          />

          <CapabilityCard
            icon="person-outline"
            title="Facial Hair"
            description="Recognizes visible facial-hair characteristics."
          />

          <CapabilityCard
            icon="sparkles-outline"
            title="Style Matching"
            description="Uses your profile to generate grooming recommendations."
          />
        </View>

        {/* Technology */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>
            BUILT WITH
          </Text>

          <Text style={styles.sectionTitle}>
            Technology behind StyleScan.
          </Text>
        </View>

        <View style={styles.technologyCard}>
          <TechnologyRow
            icon="phone-portrait-outline"
            title="React Native"
            subtitle="Cross-platform mobile interface"
          />

          <View
            style={styles.technologyDivider}
          />

          <TechnologyRow
            icon="scan-outline"
            title="Face Detection"
            subtitle="Facial feature analysis pipeline"
          />

          <View
            style={styles.technologyDivider}
          />

          <TechnologyRow
            icon="hardware-chip-outline"
            title="AI Analysis"
            subtitle="Profile interpretation and reasoning"
          />

          <View
            style={styles.technologyDivider}
          />

          <TechnologyRow
            icon="sparkles-outline"
            title="Recommendations"
            subtitle="Personalized grooming suggestions"
          />
        </View>

        {/* Privacy */}

        <View style={styles.privacyCard}>
          <View style={styles.privacyTop}>
            <View style={styles.privacyIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={25}
                color={COLORS.success}
              />
            </View>

            <View
              style={styles.privacyHeading}
            >
              <Text
                style={styles.privacyEyebrow}
              >
                PRIVACY FIRST
              </Text>

              <Text
                style={styles.privacyTitle}
              >
                Your face. Your profile.
              </Text>
            </View>
          </View>

          <Text style={styles.privacyText}>
            StyleScan uses your captured image
            as part of the analysis process that
            produces your profile and style
            recommendations.
          </Text>

          <PrivacyItem
            text="Scan data powers your facial analysis"
          />

          <PrivacyItem
            text="Your profile drives personalized recommendations"
          />

          <PrivacyItem
            text="Saved-history features can be added separately as StyleScan evolves"
          />
        </View>

        {/* Vision */}

        <View style={styles.visionCard}>
          <View style={styles.visionGlow} />

          <View style={styles.visionIcon}>
            <Ionicons
              name="diamond-outline"
              size={27}
              color={COLORS.primaryBlue}
            />
          </View>

          <Text style={styles.visionEyebrow}>
            THE STYLESCAN VISION
          </Text>

          <Text style={styles.visionTitle}>
            Grooming guidance that feels
            personal.
          </Text>

          <Text style={styles.visionText}>
            Instead of guessing which styles
            might work, StyleScan is designed
            to give users a personalized place
            to start.
          </Text>
        </View>

        {/* CTA */}

        <Pressable
          style={({ pressed }) => [
            styles.scanButton,
            pressed &&
              styles.scanButtonPressed,
          ]}
          onPress={() =>
            navigation.navigate('Scan')
          }
        >
          <View
            style={styles.scanButtonIcon}
          >
            <Ionicons
              name="scan-outline"
              size={20}
              color="#FFFFFF"
            />
          </View>

          <Text
            style={styles.scanButtonText}
          >
            Start StyleScan
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFFFFF"
          />
        </Pressable>

        <Text style={styles.versionText}>
          STYLESCAN • AI GROOMING EXPERIENCE
        </Text>
      </ScrollView>

      {/* Floating Navigation */}

      <View style={styles.navShell}>
        <NavItem
          icon="home-outline"
          label="Home"
          onPress={() =>
            navigation.navigate('Home')
          }
        />

        <NavItem
          icon="scan-outline"
          label="Scan"
          onPress={() =>
            navigation.navigate('Scan')
          }
        />

        <NavItem
          icon="time-outline"
          label="History"
          onPress={() =>
            navigation.navigate('History')
          }
        />

        <NavItem
          icon="person"
          label="About"
          active
        />
      </View>
    </SafeAreaView>
  );
}

// ------------------------------------------------------
// Mini Stat
// ------------------------------------------------------

function MiniStat({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <View style={styles.miniStat}>
      <Ionicons
        name={icon}
        size={18}
        color={COLORS.primaryBlue}
      />

      <Text style={styles.miniStatText}>
        {label}
      </Text>
    </View>
  );
}

// ------------------------------------------------------
// Timeline Step
// ------------------------------------------------------

function TimelineStep({
  number,
  icon,
  title,
  description,
  first = false,
  last = false,
}: {
  number: string;
  icon: string;
  title: string;
  description: string;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineRail}>
        {!first && (
          <View
            style={styles.timelineLineTop}
          />
        )}

        <View style={styles.timelineDot}>
          <Text
            style={styles.timelineNumber}
          >
            {number}
          </Text>
        </View>

        {!last && (
          <View
            style={styles.timelineLineBottom}
          />
        )}
      </View>

      <View style={styles.timelineCard}>
        <View style={styles.timelineIcon}>
          <Ionicons
            name={icon}
            size={22}
            color={COLORS.primaryBlue}
          />
        </View>

        <View
          style={styles.timelineContent}
        >
          <Text style={styles.timelineTitle}>
            {title}
          </Text>

          <Text
            style={
              styles.timelineDescription
            }
          >
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ------------------------------------------------------
// Capability Card
// ------------------------------------------------------

function CapabilityCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.capabilityCard}>
      <View style={styles.capabilityIcon}>
        <Ionicons
          name={icon}
          size={23}
          color={COLORS.primaryBlue}
        />
      </View>

      <Text style={styles.capabilityTitle}>
        {title}
      </Text>

      <Text
        style={styles.capabilityDescription}
      >
        {description}
      </Text>
    </View>
  );
}

// ------------------------------------------------------
// Technology Row
// ------------------------------------------------------

function TechnologyRow({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.technologyRow}>
      <View style={styles.technologyIcon}>
        <Ionicons
          name={icon}
          size={21}
          color={COLORS.primaryBlue}
        />
      </View>

      <View
        style={styles.technologyContent}
      >
        <Text
          style={styles.technologyTitle}
        >
          {title}
        </Text>

        <Text
          style={styles.technologySubtitle}
        >
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="checkmark-circle-outline"
        size={19}
        color={COLORS.success}
      />
    </View>
  );
}

// ------------------------------------------------------
// Privacy Item
// ------------------------------------------------------

function PrivacyItem({
  text,
}: {
  text: string;
}) {
  return (
    <View style={styles.privacyItem}>
      <View style={styles.privacyCheck}>
        <Ionicons
          name="checkmark"
          size={13}
          color={COLORS.success}
        />
      </View>

      <Text
        style={styles.privacyItemText}
      >
        {text}
      </Text>
    </View>
  );
}

// ------------------------------------------------------
// Nav Item
// ------------------------------------------------------

function NavItem({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={styles.navItem}
      onPress={onPress}
    >
      <View
        style={[
          styles.navIconContainer,
          active &&
            styles.navIconActive,
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={
            active
              ? COLORS.primaryBlue
              : COLORS.muted
          }
        />
      </View>

      <Text
        style={[
          styles.navLabel,
          active &&
            styles.navLabelActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
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

  scrollView: {
    flex: 1,
  },

  ambientTop: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor:
      'rgba(98,132,255,0.055)',
    top: -175,
    right: -100,
  },

  ambientSide: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor:
      'rgba(115,87,255,0.04)',
    top: 700,
    left: -195,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 125,
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

  // Hero

  hero: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 30,
  },

  logoOrbit: {
    width: 126,
    height: 126,
    borderRadius: 63,
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoGlow: {
    position: 'absolute',
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor:
      'rgba(98,132,255,0.06)',
  },

  logoCore: {
    width: 82,
    height: 82,
    borderRadius: 26,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },

  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor:
      'rgba(69,214,166,0.07)',
    borderWidth: 1,
    borderColor:
      'rgba(69,214,166,0.13)',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 18,
  },

  aiDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor:
      COLORS.success,
    marginRight: 7,
  },

  aiBadgeText: {
    color: COLORS.success,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  heroTitle: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.8,
    textAlign: 'center',
    marginTop: 18,
  },

  heroAccent: {
    color: COLORS.primaryBlue,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.8,
    textAlign: 'center',
    marginTop: -2,
  },

  heroSubtitle: {
    color: COLORS.secondary,
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 340,
    marginTop: 11,
  },

  // Intelligence

  intelligenceCard: {
    backgroundColor: '#0E1426',
    borderWidth: 1,
    borderColor: COLORS.borderBlue,
    borderRadius: 23,
    padding: 18,
    overflow: 'hidden',
  },

  intelligenceGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor:
      'rgba(98,132,255,0.045)',
    top: -100,
    right: -80,
  },

  intelligenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  intelligenceIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor:
      'rgba(98,132,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  intelligenceHeading: {
    flex: 1,
  },

  intelligenceEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  intelligenceTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 3,
  },

  intelligenceText: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 20,
    marginTop: 16,
  },

  intelligenceStats: {
    height: 67,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor:
      'rgba(255,255,255,0.025)',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
  },

  miniStat: {
    flex: 1,
    alignItems: 'center',
  },

  miniStatText: {
    color: COLORS.secondary,
    fontSize: 8,
    fontWeight: '600',
    marginTop: 4,
  },

  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },

  // Sections

  sectionHeader: {
    marginTop: 31,
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
    fontSize: 21,
    fontWeight: '700',
    marginTop: 4,
  },

  sectionSubtitle: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  // Timeline

  timeline: {
    marginTop: 2,
  },

  timelineRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  timelineRail: {
    width: 52,
    alignItems: 'center',
  },

  timelineLineTop: {
    width: 1,
    height: 15,
    backgroundColor:
      'rgba(98,132,255,0.18)',
  },

  timelineDot: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor:
      'rgba(98,132,255,0.10)',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  timelineNumber: {
    color: COLORS.primaryBlue,
    fontSize: 8,
    fontWeight: '800',
  },

  timelineLineBottom: {
    width: 1,
    flex: 1,
    minHeight: 73,
    backgroundColor:
      'rgba(98,132,255,0.18)',
  },

  timelineCard: {
    flex: 1,
    minHeight: 104,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  timelineIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor:
      'rgba(98,132,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  timelineContent: {
    flex: 1,
  },

  timelineTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },

  timelineDescription: {
    color: COLORS.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  // Capabilities

  capabilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  capabilityCard: {
    width: '48.5%',
    minHeight: 158,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginBottom: 11,
  },

  capabilityIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor:
      'rgba(98,132,255,0.09)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  capabilityTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },

  capabilityDescription: {
    color: COLORS.secondary,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 5,
  },

  // Technology

  technologyCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 21,
    overflow: 'hidden',
  },

  technologyRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  technologyIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor:
      'rgba(98,132,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  technologyContent: {
    flex: 1,
  },

  technologyTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },

  technologySubtitle: {
    color: COLORS.secondary,
    fontSize: 10,
    marginTop: 3,
  },

  technologyDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 69,
  },

  // Privacy

  privacyCard: {
    backgroundColor:
      'rgba(69,214,166,0.035)',
    borderWidth: 1,
    borderColor:
      'rgba(69,214,166,0.14)',
    borderRadius: 22,
    padding: 17,
    marginTop: 30,
  },

  privacyTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  privacyIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor:
      'rgba(69,214,166,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  privacyHeading: {
    flex: 1,
  },

  privacyEyebrow: {
    color: COLORS.success,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  privacyTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 3,
  },

  privacyText: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 20,
    marginTop: 15,
    marginBottom: 11,
  },

  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },

  privacyCheck: {
    width: 23,
    height: 23,
    borderRadius: 8,
    backgroundColor:
      'rgba(69,214,166,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  privacyItemText: {
    flex: 1,
    color: COLORS.secondary,
    fontSize: 10,
    lineHeight: 15,
  },

  // Vision

  visionCard: {
    marginTop: 14,
    borderRadius: 22,
    backgroundColor: '#0E1426',
    borderWidth: 1,
    borderColor: COLORS.borderBlue,
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },

  visionGlow: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor:
      'rgba(98,132,255,0.045)',
    top: -100,
  },

  visionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor:
      'rgba(98,132,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  visionEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginTop: 15,
  },

  visionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 5,
  },

  visionText: {
    color: COLORS.secondary,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 320,
  },

  // CTA

  scanButton: {
    height: 58,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 16,

    shadowColor: COLORS.primary,
    shadowOpacity: 0.22,
    shadowRadius: 16,
  },

  scanButtonPressed: {
    opacity: 0.84,
    transform: [
      { scale: 0.99 },
    ],
  },

  scanButtonIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor:
      'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanButtonText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  versionText: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginTop: 18,
  },

  // Floating Navigation

  navShell: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 7,

    height: 76,
    borderRadius: 24,

    backgroundColor:
      'rgba(13,16,26,0.98)',

    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.08)',

    flexDirection: 'row',

    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 22,
    shadowOffset: {
      width: 0,
      height: 10,
    },

    elevation: 10,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navIconContainer: {
    width: 38,
    height: 31,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navIconActive: {
    backgroundColor:
      'rgba(98,132,255,0.10)',
  },

  navLabel: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 3,
  },

  navLabelActive: {
    color: COLORS.primaryBlue,
    fontWeight: '700',
  },
});