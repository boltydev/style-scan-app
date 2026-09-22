import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import type {
  RootStackScreenProps,
} from '../navigation/types';

type Props =
  RootStackScreenProps<'Home'>;

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
};

export default function HomeScreen({
  navigation,
}: Props) {
  const [menuVisible, setMenuVisible] =
    useState(false);

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
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <Pressable
            style={styles.headerIcon}
            onPress={() =>
              setMenuVisible(true)
            }
          >
            <Ionicons
              name="menu-outline"
              size={27}
              color={COLORS.text}
            />
          </Pressable>

          <Text style={styles.logo}>
            STYLE SCAN
          </Text>

          <Pressable
            style={styles.headerIcon}
            onPress={goToAbout}
          >
            <Ionicons
              name="information-circle-outline"
              size={26}
              color={COLORS.text}
            />
          </Pressable>
        </View>

        {/* Welcome */}

        <View style={styles.welcome}>
          <Text style={styles.welcomeTitle}>
            Find your perfect look.
          </Text>

          <Text
            style={styles.welcomeSubtitle}
          >
            AI-powered grooming
            recommendations made for your
            features.
          </Text>
        </View>

        {/* Main Scan Card */}

        <View style={styles.scanCard}>
          <View
            style={[
              styles.corner,
              styles.topLeft,
            ]}
          />

          <View
            style={[
              styles.corner,
              styles.topRight,
            ]}
          />

          <View
            style={[
              styles.corner,
              styles.bottomLeft,
            ]}
          />

          <View
            style={[
              styles.corner,
              styles.bottomRight,
            ]}
          />

          <View style={styles.faceIcon}>
            <Ionicons
              name="person-outline"
              size={58}
              color={COLORS.muted}
            />
          </View>

          <Text
            style={styles.scanCardTitle}
          >
            Ready for your scan?
          </Text>

          <Text
            style={styles.scanCardText}
          >
            Position your face in the frame
            to get started.
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={goToScan}
          >
            <Ionicons
              name="scan-outline"
              size={21}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.primaryButtonText
              }
            >
              Scan My Face
            </Text>
          </Pressable>
        </View>

        {/* Actions */}

        <Text style={styles.sectionTitle}>
          WHAT WOULD YOU LIKE TO DO?
        </Text>

        <ActionCard
          icon="scan-outline"
          title="Scan My Face"
          subtitle="Analyze your facial features"
          onPress={goToScan}
        />

        <ActionCard
          icon="sparkles-outline"
          title="Style Recommendations"
          subtitle="Discover styles designed for you"
          onPress={goToScan}
        />

        <ActionCard
          icon="time-outline"
          title="Scan History"
          subtitle="Review your StyleScan activity"
          onPress={goToHistory}
        />

        <ActionCard
          icon="information-circle-outline"
          title="About StyleScan"
          subtitle="Learn how the technology works"
          onPress={goToAbout}
        />

        {/* AI Info */}

        <View style={styles.aiBanner}>
          <View style={styles.aiIcon}>
            <Ionicons
              name="sparkles"
              size={19}
              color={COLORS.primaryBlue}
            />
          </View>

          <View
            style={styles.aiTextContainer}
          >
            <Text style={styles.aiTitle}>
              AI-Powered Analysis
            </Text>

            <Text
              style={styles.aiSubtitle}
            >
              Personalized recommendations
              based on your unique features.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}

      <View style={styles.bottomNav}>
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

      {/* Home Menu */}

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

              <View style={styles.menuHeading}>
                <Text
                  style={styles.menuEyebrow}
                >
                  STYLE SCAN
                </Text>

                <Text style={styles.menuTitle}>
                  Menu
                </Text>
              </View>

              <Pressable
                style={
                  styles.menuCloseButton
                }
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
              Explore your StyleScan tools and
              personalized grooming experience.
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
              subtitle="Review previous StyleScan activity"
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

// ------------------------------------------------------
// Action Card
// ------------------------------------------------------

type ActionCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

function ActionCard({
  icon,
  title,
  subtitle,
  onPress,
}: ActionCardProps) {
  return (
    <Pressable
      style={styles.actionCard}
      onPress={onPress}
    >
      <View style={styles.actionIcon}>
        <Ionicons
          name={icon}
          size={25}
          color={COLORS.primaryBlue}
        />
      </View>

      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>
          {title}
        </Text>

        <Text
          style={styles.actionSubtitle}
        >
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={21}
        color={COLORS.secondary}
      />
    </Pressable>
  );
}

// ------------------------------------------------------
// Bottom Nav Item
// ------------------------------------------------------

type NavItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress?: () => void;
};

function NavItem({
  icon,
  label,
  active = false,
  onPress,
}: NavItemProps) {
  return (
    <Pressable
      style={styles.navItem}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={23}
        color={
          active
            ? COLORS.primaryBlue
            : COLORS.muted
        }
      />

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
// Menu Item
// ------------------------------------------------------

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
};

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
}: MenuItemProps) {
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

      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemTitle}>
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
    paddingBottom: 30,
  },

  // Header

  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 4,
    color: COLORS.primaryBlue,
  },

  // Welcome

  welcome: {
    marginTop: 14,
    marginBottom: 18,
  },

  welcomeTitle: {
    color: COLORS.text,
    fontSize: 27,
    fontWeight: '700',
    letterSpacing: -0.5,
  },

  welcomeSubtitle: {
    marginTop: 8,
    color: COLORS.secondary,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 330,
  },

  // Scan Card

  scanCard: {
    minHeight: 245,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    overflow: 'hidden',
  },

  faceIcon: {
    height: 88,
    width: 88,
    borderRadius: 44,
    backgroundColor:
      COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  scanCardTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '700',
  },

  scanCardText: {
    color: COLORS.secondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 22,
  },

  primaryButton: {
    width: '100%',
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  corner: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderColor: COLORS.primaryBlue,
  },

  topLeft: {
    top: 14,
    left: 14,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 7,
  },

  topRight: {
    top: 14,
    right: 14,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 7,
  },

  bottomLeft: {
    bottom: 14,
    left: 14,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 7,
  },

  bottomRight: {
    bottom: 14,
    right: 14,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 7,
  },

  // Action Cards

  sectionTitle: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginTop: 22,
    marginBottom: 13,
  },

  actionCard: {
    minHeight: 82,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#171D31',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  actionText: {
    flex: 1,
  },

  actionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },

  actionSubtitle: {
    color: COLORS.secondary,
    fontSize: 13,
    marginTop: 4,
  },

  // AI Banner

  aiBanner: {
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
  },

  aiIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#171D31',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  aiTextContainer: {
    flex: 1,
  },

  aiTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },

  aiSubtitle: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  // Bottom Nav

  bottomNav: {
    height: 88,
    backgroundColor: '#0B0E15',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    paddingBottom: 12,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  navLabel: {
    color: COLORS.muted,
    fontSize: 11,
  },

  navLabelActive: {
    color: COLORS.primaryBlue,
    fontWeight: '600',
  },

  // Menu Modal

  modalOverlay: {
    flex: 1,
    backgroundColor:
      'rgba(0,0,0,0.68)',
    justifyContent: 'flex-end',
  },

  menuSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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
    backgroundColor: COLORS.border,
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
    borderRadius: 14,
    backgroundColor: '#171D31',
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
    backgroundColor: COLORS.surface,
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
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  menuItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#171D31',
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
    borderRadius: 14,
    backgroundColor: '#111629',
    borderWidth: 1,
    borderColor:
      'rgba(98,132,255,0.22)',
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