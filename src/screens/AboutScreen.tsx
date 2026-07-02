import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Card } from '../components/Card';
import { Colors, Spacing } from '../constants/theme';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card title="What StyleScan does" icon="information-circle-outline">
          <Text style={styles.text}>
            StyleScan takes a photo of your face, analyzes it on your phone to find your
            face's outline, then sends it to an AI for a closer look at your face shape,
            skin tone, and facial hair.
          </Text>
        </Card>

        <Card title="Privacy" icon="lock-closed-outline">
          <Text style={styles.text}>
            Your photo is only used to generate your scan result and style recommendations.
            It is not stored or shared.
          </Text>
        </Card>

        <Card title="Built with" icon="construct-outline">
          <Text style={styles.text}>
            React Native, on-device face detection via ML Kit, and OpenAI GPT-4 Vision for
            analysis and style recommendations.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  text: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
