import React, {
  useLayoutEffect,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import type { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'About'>;

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
            ABOUT
          </Text>

          <Text style={styles.headerSubtitle}>
            StyleScan
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

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Branding */}

        <View style={styles.hero}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <Ionicons
                name="scan-outline"
                size={42}
                color={COLORS.primaryBlue}
              />
            </View>
          </View>

          <Text style={styles.logoText}>
            STYLE SCAN
          </Text>

          <Text style={styles.heroTitle}>
            Find the look that fits you.
          </Text>

          <Text style={styles.heroSubtitle}>
            AI-powered grooming recommendations
            personalized to your facial features.
          </Text>
        </View>

        {/* What StyleScan Does */}

        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Ionicons
                name="information-circle-outline"
                size={23}
                color={COLORS.primaryBlue}
              />
            </View>

            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardEyebrow}>
                ABOUT THE APP
              </Text>

              <Text style={styles.cardTitle}>
                What StyleScan does
              </Text>
            </View>
          </View>

          <Text style={styles.cardText}>
            StyleScan takes a photo of your
            face, analyzes its structure, and
            uses AI to identify features like
            your face shape, skin tone, and
            facial hair.
          </Text>

          <Text style={styles.cardTextSecondary}>
            Those results are then used to
            generate hairstyle and beard
            recommendations personalized for
            you.
          </Text>
        </View>

        {/* How It Works */}

        <Text style={styles.sectionEyebrow}>
          HOW IT WORKS
        </Text>

        <Text style={styles.sectionTitle}>
          From scan to style.
        </Text>

        <View style={styles.stepsContainer}>
          <StepCard
            number="01"
            icon="camera-outline"
            title="Capture"
            description="Take a clear photo with your face centered in the frame."
          />

          <View style={styles.stepConnector} />

          <StepCard
            number="02"
            icon="scan-outline"
            title="Analyze"
            description="StyleScan examines your facial structure and key features."
          />

          <View style={styles.stepConnector} />

          <StepCard
            number="03"
            icon="sparkles-outline"
            title="Recommend"
            description="AI creates hairstyle and facial-hair recommendations for you."
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

            <View style={styles.privacyHeading}>
              <Text style={styles.privacyEyebrow}>
                YOUR PRIVACY
              </Text>

              <Text style={styles.privacyTitle}>
                Your scan stays focused on you.
              </Text>
            </View>
          </View>

          <Text style={styles.privacyText}>
            Your photo is used only to generate
            your scan results and personalized
            style recommendations.
          </Text>

          <View style={styles.privacyItem}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={COLORS.success}
            />

            <Text style={styles.privacyItemText}>
              Used for your StyleScan analysis
            </Text>
          </View>

          <View style={styles.privacyItem}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={COLORS.success}
            />

            <Text style={styles.privacyItemText}>
              Used to generate recommendations
            </Text>
          </View>

          <View style={styles.privacyItem}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={COLORS.success}
            />

            <Text style={styles.privacyItemText}>
              Not stored or shared
            </Text>
          </View>
        </View>

        {/* Technology */}

        <Text style={styles.sectionEyebrow}>
          POWERED BY
        </Text>

        <Text style={styles.sectionTitle}>
          Technology behind StyleScan.
        </Text>

        <View style={styles.techGrid}>
          <TechCard
            icon="phone-portrait-outline"
            title="React Native"
            subtitle="Mobile experience"
          />

          <TechCard
            icon="scan-outline"
            title="ML Kit"
            subtitle="Face detection"
          />

          <TechCard
            icon="sparkles-outline"
            title="AI Analysis"
            subtitle="Facial analysis"
          />

          <TechCard
            icon="color-wand-outline"
            title="Recommendations"
            subtitle="Personalized styles"
          />
        </View>

        {/* Closing Card */}

        <View style={styles.closingCard}>
          <View style={styles.closingIcon}>
            <Ionicons
              name="sparkles"
              size={24}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.closingText}>
            <Text style={styles.closingTitle}>
              Built around your features.
            </Text>

            <Text style={styles.closingSubtitle}>
              One scan. Personalized grooming
              ideas designed around you.
            </Text>
          </View>
        </View>

        {/* Start Scan */}

        <Pressable
          style={styles.scanButton}
          onPress={() =>
            navigation.navigate('Scan')
          }
        >
          <Ionicons
            name="scan-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.scanButtonText}>
            Start a Face Scan
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFFFFF"
          />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// ------------------------------------------------------
// Step Card
// ------------------------------------------------------

type StepCardProps = {
  number: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

function StepCard({
  number,
  icon,
  title,
  description,
}: StepCardProps) {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepIcon}>
        <Ionicons
          name={icon}
          size={23}
          color={COLORS.primaryBlue}
        />
      </View>

      <View style={styles.stepContent}>
        <Text style={styles.stepNumber}>
          STEP {number}
        </Text>

        <Text style={styles.stepTitle}>
          {title}
        </Text>

        <Text style={styles.stepDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

// ------------------------------------------------------
// Technology Card
// ------------------------------------------------------

type TechCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
};

function TechCard({
  icon,
  title,
  subtitle,
}: TechCardProps) {
  return (
    <View style={styles.techCard}>
      <View style={styles.techIcon}>
        <Ionicons
          name={icon}
          size={23}
          color={COLORS.primaryBlue}
        />
      </View>

      <Text style={styles.techTitle}>
        {title}
      </Text>

      <Text style={styles.techSubtitle}>
        {subtitle}
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
    letterSpacing: 2.7,
  },

  headerSubtitle: {
    marginTop: 2,
    color: COLORS.secondary,
    fontSize: 11,
  },

  // Hero

  hero: {
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 30,
  },

  logoOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor:
      'rgba(98,132,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoInner: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoText: {
    color: COLORS.primaryBlue,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 3.4,
    marginTop: 17,
  },

  heroTitle: {
    color: COLORS.text,
    fontSize: 27,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginTop: 16,
  },

  heroSubtitle: {
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 330,
    marginTop: 8,
  },

  // General Info Card

  infoCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 19,
    padding: 17,
    marginBottom: 28,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#171D31',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  cardTitleContainer: {
    flex: 1,
  },

  cardEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  cardTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 3,
  },

  cardText: {
    color: COLORS.secondary,
    fontSize: 13,
    lineHeight: 21,
  },

  cardTextSecondary: {
    color: COLORS.secondary,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
  },

  // Section Titles

  sectionEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 14,
  },

  // Steps

  stepsContainer: {
    marginBottom: 30,
  },

  stepCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#171D31',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  stepContent: {
    flex: 1,
  },

  stepNumber: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  stepTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },

  stepDescription: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  stepConnector: {
    height: 12,
    width: 1,
    backgroundColor: COLORS.border,
    marginLeft: 39,
  },

  // Privacy

  privacyCard: {
    backgroundColor:
      'rgba(69,214,166,0.045)',
    borderWidth: 1,
    borderColor:
      'rgba(69,214,166,0.20)',
    borderRadius: 19,
    padding: 17,
    marginBottom: 30,
  },

  privacyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  privacyIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor:
      'rgba(69,214,166,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  privacyHeading: {
    flex: 1,
  },

  privacyEyebrow: {
    color: COLORS.success,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  privacyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 3,
  },

  privacyText: {
    color: COLORS.secondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 15,
  },

  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },

  privacyItemText: {
    color: COLORS.secondary,
    fontSize: 12,
    marginLeft: 9,
  },

  // Technology

  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  techCard: {
    width: '48.5%',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    padding: 15,
    marginBottom: 11,
  },

  techIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: '#171D31',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  techTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },

  techSubtitle: {
    color: COLORS.secondary,
    fontSize: 11,
    marginTop: 4,
  },

  // Closing

  closingCard: {
    backgroundColor: '#111629',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.28)',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  closingIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  closingText: {
    flex: 1,
  },

  closingTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },

  closingSubtitle: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  // Button

  scanButton: {
    height: 56,
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  scanButtonText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});