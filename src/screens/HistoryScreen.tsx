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
  RootStackScreenProps<'History'>;

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
              Scan History
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

        {/* Intro */}

        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />

          <Text style={styles.statusText}>
            YOUR STYLE JOURNEY
          </Text>
        </View>

        <Text style={styles.pageTitle}>
          Your scan history.
        </Text>

        <Text style={styles.pageSubtitle}>
          Revisit your StyleScan activity,
          compare results, and track the looks
          that fit you best.
        </Text>

        {/* History Dashboard */}

        <View style={styles.dashboardCard}>
          <View style={styles.dashboardGlow} />

          <View
            style={styles.dashboardHeader}
          >
            <View
              style={styles.dashboardIcon}
            >
              <Ionicons
                name="time-outline"
                size={25}
                color={COLORS.primaryBlue}
              />
            </View>

            <View
              style={styles.dashboardHeading}
            >
              <Text
                style={
                  styles.dashboardEyebrow
                }
              >
                STYLESCAN HISTORY
              </Text>

              <Text
                style={
                  styles.dashboardTitle
                }
              >
                Your activity at a glance.
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <HistoryStat
              value="0"
              label="Saved Scans"
            />

            <View
              style={styles.statDivider}
            />

            <HistoryStat
              value="0"
              label="Style Profiles"
            />

            <View
              style={styles.statDivider}
            />

            <HistoryStat
              value="0"
              label="Saved Looks"
            />
          </View>
        </View>

        {/* Empty State */}

        <View style={styles.emptyCard}>
          <View style={styles.emptyVisual}>
            <View style={styles.emptyOrbit}>
              <View
                style={styles.emptyOrbitInner}
              >
                <Ionicons
                  name="time-outline"
                  size={39}
                  color={COLORS.primaryBlue}
                />
              </View>
            </View>
          </View>

          <View style={styles.emptyBadge}>
            <Ionicons
              name="sparkles-outline"
              size={14}
              color={COLORS.primaryBlue}
            />

            <Text
              style={styles.emptyBadgeText}
            >
              READY WHEN YOU ARE
            </Text>
          </View>

          <Text style={styles.emptyTitle}>
            Your first scan starts here.
          </Text>

          <Text style={styles.emptyText}>
            Your completed StyleScan sessions
            will appear here when saved history
            becomes available.
          </Text>

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
              Start Your First Scan
            </Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* History Features */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>
            HISTORY EXPERIENCE
          </Text>

          <Text style={styles.sectionTitle}>
            Built for comparison.
          </Text>

          <Text
            style={styles.sectionSubtitle}
          >
            Your history can become a personal
            timeline for revisiting scans,
            recommendations, and favorite looks.
          </Text>
        </View>

        <HistoryFeature
          number="01"
          icon="document-text-outline"
          title="Past Analysis"
          description="Return to previous face-shape, complexion, and facial-hair results."
        />

        <HistoryFeature
          number="02"
          icon="sparkles-outline"
          title="Recommendation History"
          description="Revisit hairstyle and facial-hair suggestions from earlier StyleScan sessions."
        />

        <HistoryFeature
          number="03"
          icon="git-compare-outline"
          title="Compare Profiles"
          description="Compare different scans and grooming choices over time."
        />

        <HistoryFeature
          number="04"
          icon="bookmark-outline"
          title="Favorite Looks"
          description="Keep the styles you want to remember in one convenient place."
        />

        {/* Style Timeline */}

        <View style={styles.timelineCard}>
          <View style={styles.timelineGlow} />

          <View style={styles.timelineHeader}>
            <View
              style={styles.timelineHeaderIcon}
            >
              <Ionicons
                name="analytics-outline"
                size={23}
                color={COLORS.primaryBlue}
              />
            </View>

            <View
              style={styles.timelineHeading}
            >
              <Text
                style={styles.timelineEyebrow}
              >
                YOUR STYLE JOURNEY
              </Text>

              <Text
                style={styles.timelineTitle}
              >
                A timeline built around you.
              </Text>
            </View>
          </View>

          <Text style={styles.timelineText}>
            As you complete future StyleScan
            sessions, this space can give you a
            simple way to revisit how your
            grooming profile evolves.
          </Text>

          <View
            style={styles.timelinePreview}
          >
            <TimelinePreviewItem
              icon="scan-outline"
              title="Face Scan"
              status="Scan analysis"
            />

            <View
              style={styles.previewConnector}
            />

            <TimelinePreviewItem
              icon="sparkles-outline"
              title="Style Profile"
              status="Recommendations"
            />

            <View
              style={styles.previewConnector}
            />

            <TimelinePreviewItem
              icon="bookmark-outline"
              title="Saved Look"
              status="Favorites"
            />
          </View>
        </View>

        {/* History Availability */}

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="time-outline"
              size={22}
              color={COLORS.primaryBlue}
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoEyebrow}>
              COMING TO HISTORY
            </Text>

            <Text style={styles.infoTitle}>
              Your StyleScan timeline.
            </Text>

            <Text style={styles.infoText}>
              Saved scan history will give you
              one place to revisit previous
              profiles and recommendations.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* True Floating Navigation */}

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
          icon="time"
          label="History"
          active
        />

        <NavItem
          icon="person-outline"
          label="About"
          onPress={() =>
            navigation.navigate('About')
          }
        />
      </View>
    </SafeAreaView>
  );
}

// ------------------------------------------------------
// History Stat
// ------------------------------------------------------

function HistoryStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <View style={styles.historyStat}>
      <Text style={styles.historyStatValue}>
        {value}
      </Text>

      <Text style={styles.historyStatLabel}>
        {label}
      </Text>
    </View>
  );
}

// ------------------------------------------------------
// History Feature
// ------------------------------------------------------

function HistoryFeature({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureNumber}>
        <Text
          style={styles.featureNumberText}
        >
          {number}
        </Text>
      </View>

      <View style={styles.featureIcon}>
        <Ionicons
          name={icon}
          size={22}
          color={COLORS.primaryBlue}
        />
      </View>

      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>
          {title}
        </Text>

        <Text
          style={styles.featureDescription}
        >
          {description}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={COLORS.muted}
      />
    </View>
  );
}

// ------------------------------------------------------
// Timeline Preview Item
// ------------------------------------------------------

function TimelinePreviewItem({
  icon,
  title,
  status,
}: {
  icon: string;
  title: string;
  status: string;
}) {
  return (
    <View style={styles.previewItem}>
      <View style={styles.previewIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={COLORS.primaryBlue}
        />
      </View>

      <View style={styles.previewContent}>
        <Text style={styles.previewTitle}>
          {title}
        </Text>

        <Text style={styles.previewStatus}>
          {status}
        </Text>
      </View>

      <View style={styles.previewDot} />
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
      'rgba(115,87,255,0.035)',
    top: 650,
    left: -190,
  },

  content: {
    paddingHorizontal: 20,

    /*
      Extra room for the floating
      navigation bar.
    */
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

  // Intro

  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(98,132,255,0.07)',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.14)',
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor:
      COLORS.primaryBlue,
    marginRight: 7,
  },

  statusText: {
    color: COLORS.primaryBlue,
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

  // Dashboard

  dashboardCard: {
    backgroundColor: '#0E1426',
    borderWidth: 1,
    borderColor: COLORS.borderBlue,
    borderRadius: 23,
    padding: 18,
    overflow: 'hidden',
  },

  dashboardGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor:
      'rgba(98,132,255,0.045)',
    top: -100,
    right: -80,
  },

  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dashboardIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor:
      'rgba(98,132,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  dashboardHeading: {
    flex: 1,
  },

  dashboardEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  dashboardTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 3,
  },

  statsRow: {
    height: 78,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor:
      'rgba(255,255,255,0.025)',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  historyStat: {
    flex: 1,
    alignItems: 'center',
  },

  historyStatValue: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
  },

  historyStatLabel: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },

  statDivider: {
    width: 1,
    height: 34,
    backgroundColor: COLORS.border,
  },

  // Empty State

  emptyCard: {
    marginTop: 15,
    backgroundColor: COLORS.surface,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    alignItems: 'center',
  },

  emptyVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },

  emptyOrbit: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyOrbitInner: {
    width: 78,
    height: 78,
    borderRadius: 25,
    backgroundColor:
      'rgba(98,132,255,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 19,
  },

  emptyBadgeText: {
    color: COLORS.primaryBlue,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginLeft: 6,
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 9,
  },

  emptyText: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 320,
    marginTop: 8,
  },

  scanButton: {
    width: '100%',
    height: 58,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 22,

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

  // Feature Cards

  featureCard: {
    minHeight: 88,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  featureNumber: {
    width: 29,
  },

  featureNumberText: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '800',
  },

  featureIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor:
      'rgba(98,132,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  featureContent: {
    flex: 1,
    paddingVertical: 13,
  },

  featureTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },

  featureDescription: {
    color: COLORS.secondary,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },

  // Timeline

  timelineCard: {
    marginTop: 19,
    borderRadius: 22,
    backgroundColor: '#0E1426',
    borderWidth: 1,
    borderColor: COLORS.borderBlue,
    padding: 17,
    overflow: 'hidden',
  },

  timelineGlow: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor:
      'rgba(98,132,255,0.04)',
    top: -100,
    right: -80,
  },

  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timelineHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor:
      'rgba(98,132,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  timelineHeading: {
    flex: 1,
  },

  timelineEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  timelineTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 3,
  },

  timelineText: {
    color: COLORS.secondary,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 14,
  },

  timelinePreview: {
    marginTop: 17,
  },

  previewItem: {
    minHeight: 58,
    borderRadius: 15,
    backgroundColor:
      'rgba(255,255,255,0.025)',
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  previewIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor:
      'rgba(98,132,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  previewContent: {
    flex: 1,
  },

  previewTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },

  previewStatus: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 2,
  },

  previewDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor:
      'rgba(98,132,255,0.45)',
  },

  previewConnector: {
    width: 1,
    height: 10,
    backgroundColor:
      'rgba(98,132,255,0.18)',
    marginLeft: 30,
  },

  // Information

  infoCard: {
    marginTop: 14,
    borderRadius: 19,
    backgroundColor:
      'rgba(98,132,255,0.035)',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.13)',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  infoIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor:
      'rgba(98,132,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  infoContent: {
    flex: 1,
  },

  infoEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  infoTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },

  infoText: {
    color: COLORS.secondary,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },

  // True Floating Nav

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