import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { AppButton } from '../components/AppButton';
import { getRecommendations } from '../utils/recommendApi';
import { Colors, Spacing } from '../constants/theme';
import type { RootStackScreenProps } from '../navigation/types';
import type { ScanResult, RecommendationResult } from '../utils/types';

type Props = RootStackScreenProps<'Recommendations'>;

export default function RecommendationsScreen({ route, navigation }: Props) {
  const { data } = route.params;

  const scan: ScanResult | null = useMemo(() => {
    if (!data) return null;
    try {
      return JSON.parse(data) as ScanResult;
    } catch {
      return null;
    }
  }, [data]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recs, setRecs] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    if (!scan) {
      setLoading(false);
      setError('Missing scan data.');
      return;
    }
    getRecommendations(scan)
      .then(setRecs)
      .catch((e) => setError(e instanceof Error ? e.message : 'Something went wrong.'))
      .finally(() => setLoading(false));
  }, [scan]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.statusText}>Finding your best styles...</Text>
      </View>
    );
  }

  if (error || !recs) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Something went wrong.'}</Text>
        <AppButton
          label="Back to Results"
          onPress={() => navigation.goBack()}
          style={{ marginTop: Spacing.md }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card title="Summary" icon="document-text-outline">
          <Text style={styles.notes}>{recs.summary}</Text>
        </Card>

        <Card title="Hairstyles For You" icon="cut-outline">
          {recs.hairstyles.map((h, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemName}>{h.name}</Text>
              <Text style={styles.notes}>{h.reason}</Text>
            </View>
          ))}
        </Card>

        {recs.beardStyles.length > 0 && (
          <Card title="Beard Styles For You" icon="man-outline">
            {recs.beardStyles.map((b, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemName}>{b.name}</Text>
                <Text style={styles.notes}>{b.reason}</Text>
              </View>
            ))}
          </Card>
        )}

        <AppButton
          label="Scan Again"
          variant="outline"
          icon="camera-outline"
          onPress={() => navigation.replace('Scan')}
          style={{ width: '100%', marginTop: Spacing.md }}
        />
        <AppButton
          label="Back to Home"
          variant="secondary"
          icon="home-outline"
          onPress={() => navigation.replace('Home')}
          style={{ width: '100%' }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  statusText: { color: Colors.textSecondary, fontSize: 15 },
  errorText: { color: Colors.textSecondary, fontSize: 15, textAlign: 'center' },
  content: { padding: Spacing.lg, gap: Spacing.md },
  item: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  itemName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  notes: { color: Colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 2 },
});
