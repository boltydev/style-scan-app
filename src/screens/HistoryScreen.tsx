import React, {
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,ScrollView,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  deleteScan,
  getScanHistory,
  photoUri,
  type SavedScan,
} from '../utils/profileApi';

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
  const [scans, setScans] =
    useState<SavedScan[]>([]);

  const [loading, setLoading] =
    useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Reload whenever the screen comes into view, so a scan finished a
  // moment ago shows up right away.
  useFocusEffect(
    useCallback(() => {
      let active = true;

      getScanHistory()
        .then((history) => {
          if (active) setScans(history);
        })
        .catch(() => {
          if (active) setScans([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, []),
  );

  function openScan(scan: SavedScan) {
    navigation.navigate('Results', {
      data: JSON.stringify(scan.result),
      photoUri: photoUri(scan) ?? '',
      onDeviceShape: scan.onDeviceShape,
      scanId: scan.id,
    });
  }

  function confirmDelete(scan: SavedScan) {
    Alert.alert(
      'Delete this scan?',
      'It will be removed from your profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setScans((current) =>
              current.filter(
                (s) => s.id !== scan.id,
              ),
            );
            deleteScan(scan.id).catch(() => {});
          },
        },
      ],
    );
  }

  const withRecommendations =
    scans.filter(
      (s) => s.recommendations,
    ).length;

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
              value={String(scans.length)}
              label="Saved Scans"
            />

            <View
              style={styles.statDivider}
            />

            <HistoryStat
              value={String(
                withRecommendations,
              )}
              label="Style Profiles"
            />

            <View
              style={styles.statDivider}
            />

            <HistoryStat
              value={
                scans[0]?.result.faceShape
                  .shape ?? '—'
              }
              label="Latest Shape"
            />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="small"
            color={COLORS.primaryBlue}
            style={styles.loadingSpinner}
          />
        ) : scans.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text
                style={styles.sectionEyebrow}
              >
                SAVED SCANS
              </Text>

              <Text
                style={styles.sectionTitle}
              >
                Your past results.
              </Text>
            </View>

            {scans.map((scan) => (
              <ScanCard
                key={scan.id}
                scan={scan}
                onPress={() => openScan(scan)}
                onDelete={() =>
                  confirmDelete(scan)
                }
              />
            ))}
          </>
        ) : (
          <>
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
                Every completed StyleScan is saved
                to your profile and will appear
                here.
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
                Your history is a personal timeline
                for revisiting scans and
                recommendations.
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
          </>
        )}
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
// Scan Card
// ------------------------------------------------------

function ScanCard({
  scan,
  onPress,
  onDelete,
}: {
  scan: SavedScan;
  onPress: () => void;
  onDelete: () => void;
}) {
  const uri = photoUri(scan);
  const { result } = scan;

  const date = new Date(
    scan.createdAt,
  ).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const time = new Date(
    scan.createdAt,
  ).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Pressable
      style={({ pressed }) => [
        styles.scanCard,
        pressed && styles.scanCardPressed,
      ]}
      onPress={onPress}
      onLongPress={onDelete}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={styles.scanThumb}
        />
      ) : (
        <View
          style={[
            styles.scanThumb,
            styles.scanThumbEmpty,
          ]}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={COLORS.muted}
          />
        </View>
      )}

      <View style={styles.scanInfo}>
        <Text style={styles.scanDate}>
          {date} · {time}
        </Text>

        <Text style={styles.scanShape}>
          {result.faceShape.shape} face
        </Text>

        <Text
          style={styles.scanDetails}
          numberOfLines={2}
        >
          {[
            result.hairLength?.length &&
              `${result.hairLength.length} hair`,
            `${result.skinTone.tone} skin`,
            result.facialHair.type,
          ]
            .filter(Boolean)
            .join(' · ')}
        </Text>

        {scan.recommendations ? (
          <View style={styles.scanTag}>
            <Ionicons
              name="sparkles"
              size={11}
              color={COLORS.primaryBlue}
            />

            <Text style={styles.scanTagText}>
              RECOMMENDATIONS SAVED
            </Text>
          </View>
        ) : null}
      </View>

      <Pressable
        style={styles.scanDelete}
        onPress={onDelete}
        hitSlop={8}
      >
        <Ionicons
          name="trash-outline"
          size={18}
          color={COLORS.muted}
        />
      </Pressable>
    </Pressable>
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
  // Saved scans

  loadingSpinner: {
    marginTop: 40,
  },

  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
  },

  scanCardPressed: {
    opacity: 0.84,
  },

  scanThumb: {
    width: 64,
    height: 76,
    borderRadius: 14,
    resizeMode: 'cover',
  },

  scanThumbEmpty: {
    backgroundColor:
      'rgba(98,132,255,0.045)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanInfo: {
    flex: 1,
    marginLeft: 14,
  },

  scanDate: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '600',
  },

  scanShape: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 3,
  },

  scanDetails: {
    color: COLORS.secondary,
    fontSize: 12,
    marginTop: 3,
  },

  scanTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 7,
  },

  scanTagText: {
    color: COLORS.primaryBlue,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.9,
  },

  scanDelete: {
    padding: 8,
    marginLeft: 6,
  },

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