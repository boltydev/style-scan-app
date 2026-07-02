import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { Colors, Spacing, Radius } from '../constants/theme';
import type { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.heroIconWrap}>
          <Icon name="sparkles" size={36} color={Colors.primary} />
        </View>
        <Text style={styles.title}>StyleScan</Text>
        <Text style={styles.subtitle}>
          Scan your face to get personalized hairstyle and beard recommendations.
        </Text>

        {/* Main action */}
        <AppButton
          label="Start Face Scan"
          icon="camera"
          onPress={() => navigation.navigate('Scan')}
          style={{ marginTop: Spacing.xl, width: '100%' }}
        />

        {/* How it works */}
        <Text style={styles.sectionLabel}>How it works</Text>

        <Card title="1. Take a photo" icon="camera-outline">
          <Text style={styles.cardText}>
            Use your front camera to take a clear, well-lit photo of your face.
          </Text>
        </Card>

        <Card title="2. We scan your features" icon="scan-outline">
          <Text style={styles.cardText}>
            We detect your face shape, skin tone, and facial hair right on your phone.
          </Text>
        </Card>

        <Card title="3. Get style picks" icon="cut-outline">
          <Text style={styles.cardText}>
            An AI assistant suggests hairstyles and beard styles that suit you.
          </Text>
        </Card>

        {/* Footer link */}
        <AppButton
          label="About this app"
          variant="outline"
          icon="information-circle-outline"
          onPress={() => navigation.navigate('About')}
          style={{ marginTop: Spacing.xl, width: '100%' }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  heroIconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  sectionLabel: {
    width: '100%',
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  cardText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
