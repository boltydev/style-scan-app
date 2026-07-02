import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Card } from '../components/Card';
import { AppButton } from '../components/AppButton';
import { Colors, Spacing, Radius } from '../constants/theme';
import type { RootStackScreenProps } from '../navigation/types';
import type { ScanResult } from '../utils/types';

type Props = RootStackScreenProps<'Results'>;

export default function ResultsScreen({ route, navigation }: Props) {
  const { data, photoUri } = route.params;

  const result: ScanResult | null = useMemo(() => {
    if (!data) return null;
    try {
      return JSON.parse(data) as ScanResult;
    } catch {
      return null;
    }
  }, [data]);

  if (!result) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>We couldn't load your scan results.</Text>
        <AppButton
          label="Back to Home"
          onPress={() => navigation.navigate('Home')}
          style={{ marginTop: Spacing.md }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {photoUri && <Image source={{ uri: photoUri }} style={styles.thumbnail} />}

        <Card title="Face Shape" icon="ellipse-outline">
          <Row label="Shape" value={result.faceShape.shape} />
          <Row label="Confidence" value={result.faceShape.confidence} />
          <Text style={styles.notes}>{result.faceShape.notes}</Text>
        </Card>

        <Card title="Skin Tone" icon="color-palette-outline">
          <Row label="Tone" value={result.skinTone.tone} />
          <Row label="Undertone" value={result.skinTone.undertone} />
          <Text style={styles.notes}>{result.skinTone.notes}</Text>
        </Card>

        <Card title="Facial Hair" icon="man-outline">
          <Row label="Present" value={result.facialHair.present ? 'Yes' : 'No'} />
          <Row label="Type" value={result.facialHair.type} />
          <Text style={styles.notes}>{result.facialHair.notes}</Text>
        </Card>

        <Card title="Summary" icon="document-text-outline">
          <Text style={styles.notes}>{result.summary}</Text>
        </Card>

        <AppButton
          label="Get Style Recommendations"
          icon="sparkles"
          onPress={() =>
            navigation.navigate('Recommendations', {
              data: JSON.stringify(result),
            })
          }
          style={{ marginTop: Spacing.md, width: '100%' }}
        />
        <AppButton
          label="Scan Again"
          variant="outline"
          icon="camera-outline"
          onPress={() => navigation.replace('Scan')}
          style={{ width: '100%' }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
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
  },
  errorText: { color: Colors.textSecondary, fontSize: 15, textAlign: 'center' },
  content: { padding: Spacing.lg, gap: Spacing.md },
  thumbnail: {
    width: 96,
    height: 96,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { color: Colors.textSecondary, fontSize: 14 },
  rowValue: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  notes: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
});
