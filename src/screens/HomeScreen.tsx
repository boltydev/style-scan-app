import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,ScrollView,
  Pressable,
  Modal,
  Animated,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from '@expo/vector-icons/Ionicons';

import type {
  RootStackScreenProps,
} from '../navigation/types';

type Props =
  RootStackScreenProps<'Home'>;

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

export default function HomeScreen({
  navigation,
}: Props) {
  const [menuVisible, setMenuVisible] =
    useState(false);

  const pulse = useRef(
    new Animated.Value(1),
  ).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.18,
          duration: 1100,
          useNativeDriver: true,
        }),

        Animated.timing(pulse, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [pulse]);

  function closeMenu() {
    setMenuVisible(false);
  }

  function goToScan() {
    closeMenu();
    navigation.navigate('Scan');
  }

  function goToHistory() {
    closeMenu();
    navigation.navigate('History');
  }

  function goToAbout() {
    closeMenu();
    navigation.navigate('About');
  }

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
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <Pressable
            style={styles.headerButton}
            onPress={() =>
              setMenuVisible(true)
            }
          >
            <Ionicons
              name="menu-outline"
              size={25}
              color={COLORS.text}
            />
          </Pressable>

          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Ionicons
                name="scan-outline"
                size={16}
                color={COLORS.primaryBlue}
              />
            </View>

            <Text style={styles.logo}>
              STYLESCAN
            </Text>
          </View>

          <Pressable
            style={styles.headerButton}
            onPress={goToAbout}
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={COLORS.text}
            />
          </Pressable>
        </View>

        {/* Intro */}

        <View style={styles.intro}>
          <View style={styles.aiStatus}>
            <Animated.View
              style={[
                styles.aiStatusGlow,
                {
                  transform: [
                    { scale: pulse },
                  ],
                },
              ]}
            />

            <View
              style={styles.aiStatusDot}
            />

            <Text
              style={styles.aiStatusText}
            >
              AI READY
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            Your look.
          </Text>

          <Text
            style={styles.heroTitleAccent}
          >
            Reimagined by AI.
          </Text>

          <Text
            style={styles.heroSubtitle}
          >
            Scan your features and discover
            grooming recommendations designed
            around you.
          </Text>
        </View>

        {/* Main Scan Experience */}

        <View style={styles.scanExperience}>
          <View style={styles.cardGlow} />

          <View style={styles.scanTopRow}>
            <View>
              <Text
                style={styles.scanEyebrow}
              >
                PERSONALIZED ANALYSIS
              </Text>

              <Text style={styles.scanTitle}>
                Face Scan
              </Text>
            </View>

            <View style={styles.liveBadge}>
              <Animated.View
                style={[
                  styles.liveDotOuter,
                  {
                    transform: [
                      { scale: pulse },
                    ],
                  },
                ]}
              />

              <View
                style={styles.liveDot}
              />

              <Text
                style={styles.liveText}
              >
                READY
              </Text>
            </View>
          </View>

          <View style={styles.scanVisual}>
            <View style={styles.scanOrbit}>
              <View style={styles.scanCircle}>
                <Ionicons
                  name="person-outline"
                  size={66}
                  color={COLORS.muted}
                />

                <View
                  style={styles.scanLine}
                />
              </View>
            </View>

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
          </View>

          <View style={styles.featureChips}>
            <FeatureChip
              icon="scan-outline"
              label="Face Shape"
            />

            <FeatureChip
              icon="color-palette-outline"
              label="Skin Tone"
            />

            <FeatureChip
              icon="person-outline"
              label="Facial Hair"
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed &&
                styles.primaryButtonPressed,
            ]}
            onPress={goToScan}
          >
            <View
              style={styles.buttonIcon}
            >
              <Ionicons
                name="scan-outline"
                size={20}
                color="#FFFFFF"
              />
            </View>

            <Text
              style={
                styles.primaryButtonText
              }
            >
              Start StyleScan
            </Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
            />
          </Pressable>

          <Text style={styles.scanHint}>
            Takes less than a minute
          </Text>
        </View>

        {/* Quick Access */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>
            QUICK ACCESS
          </Text>

          <Text style={styles.sectionHeading}>
            Pick up where you left off.
          </Text>
        </View>

        <View style={styles.quickGrid}>
          <QuickCard
            icon="sparkles-outline"
            eyebrow="STYLE PICKS"
            title="Recommendations"
            subtitle="Discover your best looks"
            onPress={goToScan}
          />

          <QuickCard
            icon="time-outline"
            eyebrow="YOUR ACTIVITY"
            title="History"
            subtitle="Review previous scans"
            onPress={goToHistory}
          />
        </View>

        {/* Intelligence */}

        <View style={styles.analysisCard}>
          <View
            style={styles.analysisHeader}
          >
            <View
              style={styles.analysisIcon}
            >
              <Ionicons
                name="sparkles"
                size={21}
                color={COLORS.primaryBlue}
              />
            </View>

            <View
              style={styles.analysisHeading}
            >
              <Text
                style={styles.analysisEyebrow}
              >
                STYLESCAN INTELLIGENCE
              </Text>

              <Text
                style={styles.analysisTitle}
              >
                Built around your features.
              </Text>
            </View>
          </View>

          <Text style={styles.analysisText}>
            StyleScan combines facial analysis
            with AI-powered recommendations to
            help you explore hairstyles and
            facial-hair styles that complement
            your look.
          </Text>

          <View
            style={styles.analysisStats}
          >
            <AnalysisStat
              icon="scan-outline"
              label="Face"
            />

            <View
              style={styles.statDivider}
            />

            <AnalysisStat
              icon="color-palette-outline"
              label="Tone"
            />

            <View
              style={styles.statDivider}
            />

            <AnalysisStat
              icon="sparkles-outline"
              label="Style"
            />
          </View>
        </View>
      </ScrollView>

      {/* Floating Navigation */}

      <View style={styles.navShell}>
        <NavItem
          icon="home"
          label="Home"
          active
        />

        <NavItem
          icon="scan-outline"
          label="Scan"
          onPress={goToScan}
        />

        <NavItem
          icon="time-outline"
          label="History"
          onPress={goToHistory}
        />

        <NavItem
          icon="person-outline"
          label="About"
          onPress={goToAbout}
        />
      </View>

      {/* Menu */}

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeMenu}
          />

          <View style={styles.menuSheet}>
            <View style={styles.menuHandle} />

            <View style={styles.menuHeader}>
              <View style={styles.menuLogo}>
                <Ionicons
                  name="scan-outline"
                  size={25}
                  color={COLORS.primaryBlue}
                />
              </View>

              <View
                style={styles.menuHeading}
              >
                <Text
                  style={styles.menuEyebrow}
                >
                  STYLESCAN
                </Text>

                <Text
                  style={styles.menuTitle}
                >
                  Explore
                </Text>
              </View>

              <Pressable
                style={styles.menuCloseButton}
                onPress={closeMenu}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={COLORS.text}
                />
              </Pressable>
            </View>

            <Text style={styles.menuIntro}>
              Your personalized grooming tools
              in one place.
            </Text>

            <MenuItem
              icon="home-outline"
              title="Home"
              subtitle="Return to your dashboard"
              onPress={closeMenu}
            />

            <MenuItem
              icon="scan-outline"
              title="Face Scan"
              subtitle="Analyze your facial features"
              onPress={goToScan}
            />

            <MenuItem
              icon="time-outline"
              title="Scan History"
              subtitle="Review your StyleScan activity"
              onPress={goToHistory}
            />

            <MenuItem
              icon="information-circle-outline"
              title="About StyleScan"
              subtitle="Learn how StyleScan works"
              onPress={goToAbout}
            />

            <View style={styles.menuFooter}>
              <Ionicons
                name="sparkles"
                size={15}
                color={COLORS.primaryBlue}
              />

              <Text
                style={styles.menuFooterText}
              >
                AI-powered grooming guidance
                made for your features.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function FeatureChip({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.featureChip}>
      <Ionicons
        name={icon}
        size={14}
        color={COLORS.primaryBlue}
      />

      <Text
        style={styles.featureChipText}
      >
        {label}
      </Text>
    </View>
  );
}

function QuickCard({
  icon,
  eyebrow,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  eyebrow: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.quickCard,
        pressed &&
          styles.quickCardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.quickTop}>
        <View style={styles.quickIcon}>
          <Ionicons
            name={icon}
            size={23}
            color={COLORS.primaryBlue}
          />
        </View>

        <Ionicons
          name="arrow-up-outline"
          size={18}
          color={COLORS.muted}
          style={{
            transform: [
              { rotate: '45deg' },
            ],
          }}
        />
      </View>

      <Text style={styles.quickEyebrow}>
        {eyebrow}
      </Text>

      <Text
        style={styles.quickTitle}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.82}
      >
        {title}
      </Text>

      <Text style={styles.quickSubtitle}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

function AnalysisStat({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.analysisStat}>
      <Ionicons
        name={icon}
        size={19}
        color={COLORS.primaryBlue}
      />

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
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

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.menuItem}
      onPress={onPress}
    >
      <View style={styles.menuItemIcon}>
        <Ionicons
          name={icon}
          size={23}
          color={COLORS.primaryBlue}
        />
      </View>

      <View
        style={styles.menuItemContent}
      >
        <Text
          style={styles.menuItemTitle}
        >
          {title}
        </Text>

        <Text
          style={styles.menuItemSubtitle}
        >
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={COLORS.muted}
      />
    </Pressable>
  );
}

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
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor:
      'rgba(82,92,255,0.07)',
    top: -150,
    right: -110,
  },

  ambientSide: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor:
      'rgba(115,87,255,0.045)',
    top: 420,
    left: -190,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 125,
  },

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

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  brandMark: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor:
      'rgba(98,132,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  logo: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 3.2,
    color: COLORS.text,
  },

  intro: {
    marginTop: 21,
    marginBottom: 25,
  },

  aiStatus: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(69,214,166,0.07)',
    borderWidth: 1,
    borderColor:
      'rgba(69,214,166,0.13)',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 18,
    marginBottom: 15,
  },

  aiStatusGlow: {
    position: 'absolute',
    left: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor:
      'rgba(69,214,166,0.20)',
  },

  aiStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor:
      COLORS.success,
    marginRight: 8,
  },

  aiStatusText: {
    color: COLORS.success,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  heroTitle: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1.1,
  },

  heroTitleAccent: {
    color: COLORS.primaryBlue,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1.1,
    marginTop: -2,
  },

  heroSubtitle: {
    marginTop: 13,
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 340,
  },

  scanExperience: {
    minHeight: 440,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderBlue,
    borderRadius: 26,
    padding: 18,
    overflow: 'hidden',
  },

  cardGlow: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor:
      'rgba(98,132,255,0.055)',
    alignSelf: 'center',
    top: 70,
  },

  scanTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  scanEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  scanTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 3,
  },

  liveBadge: {
    height: 31,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor:
      'rgba(69,214,166,0.16)',
    backgroundColor:
      'rgba(69,214,166,0.07)',
    flexDirection: 'row',
    alignItems: 'center',
  },

  liveDotOuter: {
    position: 'absolute',
    left: 9,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor:
      'rgba(69,214,166,0.15)',
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor:
      COLORS.success,
    marginRight: 7,
  },

  liveText: {
    color: COLORS.success,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  scanVisual: {
    height: 205,
    marginTop: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanOrbit: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanCircle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor:
      'rgba(13,18,33,0.75)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  scanLine: {
    position: 'absolute',
    width: 105,
    height: 1.5,
    backgroundColor: COLORS.primaryBlue,
    shadowColor: COLORS.primaryBlue,
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },

  scanCorner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: COLORS.primaryBlue,
  },

  topLeft: {
    top: 17,
    left: 15,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 8,
  },

  topRight: {
    top: 17,
    right: 15,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 8,
  },

  bottomLeft: {
    bottom: 17,
    left: 15,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 8,
  },

  bottomRight: {
    bottom: 17,
    right: 15,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 8,
  },

  featureChips: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 17,
  },

  featureChip: {
    flex: 1,
    minHeight: 35,
    borderRadius: 12,
    backgroundColor:
      'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 3,
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  featureChipText: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '600',
    marginLeft: 5,
  },

  primaryButton: {
    height: 58,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.23,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },

  primaryButtonPressed: {
    opacity: 0.86,
    transform: [
      { scale: 0.99 },
    ],
  },

  buttonIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor:
      'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },

  scanHint: {
    color: COLORS.muted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 10,
  },

  sectionHeader: {
    marginTop: 30,
    marginBottom: 13,
  },

  sectionEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  sectionHeading: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '700',
    marginTop: 4,
  },

  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  quickCard: {
    width: '48.5%',
    minHeight: 172,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
  },

  quickCardPressed: {
    opacity: 0.8,
    transform: [
      { scale: 0.985 },
    ],
  },

  quickTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor:
      'rgba(98,132,255,0.10)',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickEyebrow: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  quickTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.25,
    marginTop: 4,
  },

  quickSubtitle: {
    color: COLORS.secondary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },

  analysisCard: {
    marginTop: 14,
    borderRadius: 21,
    backgroundColor: '#0E1426',
    borderWidth: 1,
    borderColor: COLORS.borderBlue,
    padding: 17,
  },

  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  analysisIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor:
      'rgba(98,132,255,0.11)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  analysisHeading: {
    flex: 1,
  },

  analysisEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  analysisTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 3,
  },

  analysisText: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 15,
  },

  analysisStats: {
    height: 60,
    borderRadius: 15,
    backgroundColor:
      'rgba(255,255,255,0.025)',
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  analysisStat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statLabel: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '600',
    marginTop: 4,
  },

  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },

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

  modalOverlay: {
    flex: 1,
    backgroundColor:
      'rgba(0,0,0,0.70)',
    justifyContent: 'flex-end',
  },

  menuSheet: {
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

  menuHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor:
      'rgba(255,255,255,0.12)',
    alignSelf: 'center',
    marginBottom: 20,
  },

  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  menuLogo: {
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

  menuHeading: {
    flex: 1,
  },

  menuEyebrow: {
    color: COLORS.primaryBlue,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  menuTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 3,
  },

  menuCloseButton: {
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

  menuIntro: {
    color: COLORS.secondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 17,
  },

  menuItem: {
    minHeight: 74,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  menuItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor:
      'rgba(98,132,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  menuItemContent: {
    flex: 1,
  },

  menuItemTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },

  menuItemSubtitle: {
    color: COLORS.secondary,
    fontSize: 11,
    marginTop: 3,
  },

  menuFooter: {
    marginTop: 6,
    padding: 14,
    borderRadius: 15,
    backgroundColor: '#0E1426',
    borderWidth: 1,
    borderColor: COLORS.borderBlue,
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuFooterText: {
    flex: 1,
    color: COLORS.secondary,
    fontSize: 11,
    lineHeight: 16,
    marginLeft: 9,
  },
});