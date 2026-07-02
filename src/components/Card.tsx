import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Radius, Spacing } from '../constants/theme';

interface Props {
  title: string;
  icon: string;
  children: React.ReactNode;
}

// A simple card with an icon + title header and any content below.
// Used on the results and recommendations screens.
export function Card({ title, icon, children }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Icon name={icon} size={18} color={Colors.primary} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
