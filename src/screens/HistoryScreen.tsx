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

type Props =
  RootStackScreenProps<'History'>;

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

export default function HistoryScreen({
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
            HISTORY
          </Text>

          <Text style={styles.headerSubtitle}>
            Your StyleScan activity
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
        {/* Intro */}

        <View style={styles.intro}>
          <Text style={styles.pageTitle}>
            Your scan history.
          </Text>

          <Text style={styles.pageSubtitle}>
            Revisit your previous StyleScan
            results and recommendations.
          </Text>
        </View>

        {/* Empty State */}

        <View style={styles.emptyCard}>
          <View style={styles.emptyGlow}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="time-outline"
                size={42}
                color={COLORS.primaryBlue}
              />
            </View>
          </View>

          <Text style={styles.emptyTitle}>
            No saved scans yet
          </Text>

          <Text style={styles.emptyText}>
            Scan history storage hasn't been
            connected yet. Once that feature is
            added, previous results can appear
            here.
          </Text>

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
        </View>

        {/* Future Feature Preview */}

        <Text style={styles.sectionEyebrow}>
          HISTORY FEATURES
        </Text>

        <Text style={styles.sectionTitle}>
          Designed for easy comparison.
        </Text>

        <FeatureCard
          icon="person-outline"
          title="Past Scan Results"
          description="Review previous face-shape, skin-tone, and facial-hair analysis."
        />

        <FeatureCard
          icon="sparkles-outline"
          title="Style Recommendations"
          description="Return to hairstyles and facial-hair recommendations from earlier scans."
        />

        <FeatureCard
          icon="git-compare-outline"
          title="Compare Your Looks"
          description="Future history support can make it easier to compare results over time."
        />

        {/* Info Banner */}

        <View style={styles.infoBanner}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="construct-outline"
              size={20}
              color={COLORS.primaryBlue}
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              History is being prepared
            </Text>

            <Text style={styles.infoText}>
              The interface is ready, but saved
              scan storage still needs to be
              connected to the app.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type FeatureCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIcon}>
        <Ionicons
          name={icon}
          size={23}
          color={COLORS.primaryBlue}
        />
      </View>

      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>
          {title}
        </Text>

        <Text style={styles.featureDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

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

  // Intro

  intro: {
    marginTop: 18,
    marginBottom: 22,
  },

  pageTitle: {
    color: COLORS.text,
    fontSize: 29,
    fontWeight: '700',
    letterSpacing: -0.6,
  },

  pageSubtitle: {
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    maxWidth: 340,
  },

  // Empty State

  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 22,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 30,
  },

  emptyGlow: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor:
      'rgba(98,132,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyIcon: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: '#171D31',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '700',
    marginTop: 18,
  },

  emptyText: {
    color: COLORS.secondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 310,
  },

  scanButton: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 17,
    marginTop: 23,
  },

  scanButtonText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Section

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

  // Feature Cards

  featureCard: {
    minHeight: 92,
    backgroundColor: COLORS.surface,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#171D31',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },

  featureDescription: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  // Info

  infoBanner: {
    marginTop: 12,
    padding: 16,
    borderRadius: 17,
    backgroundColor: '#111629',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.25)',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor:
      'rgba(98,132,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },

  infoText: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
});