import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getLogEntries, LogEntry } from "../utils/storage";
import { useIsFocused } from "@react-navigation/native";
import type { RootStackScreenProps } from "../navigation/types";

type Props = RootStackScreenProps<"Home">;

export default function HomeScreen({ navigation }: Props) {
  const [lastScan, setLastScan] = useState<LogEntry | null>(null);
  const isFocused = useIsFocused(); // 👈 Detects if user is looking at the Home Tab

  useEffect(() => {
    if (isFocused) {
      fetchLatestScan();
    }
  }, [isFocused]);

  const fetchLatestScan = async () => {
    const entries = await getLogEntries();
    if (entries && entries.length > 0) {
      setLastScan(entries[0]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* --- LUXURY HEADER --- */}
        <SafeAreaView style={styles.headerContainer}>
          <View>
            <Text style={styles.dateLabel}>THURSDAY, JULY 16</Text>
            <Text style={styles.greetingText}>Hey David</Text>
          </View>
          <TouchableOpacity style={styles.profileAvatar} onPress={() => navigation.navigate("About")}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>DK</Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>

        {/* --- START SCAN --- */}
        <TouchableOpacity style={styles.scanButton} onPress={() => navigation.navigate("Scan")}>
          <Ionicons name="camera" size={20} color="#000000" />
          <Text style={styles.scanButtonText}>Start Face Scan</Text>
        </TouchableOpacity>

        {/* --- DAILY CURATION --- */}
        <Text style={styles.sectionHeader}>Today's Curation</Text>

        {lastScan ? (
          <View style={styles.feedCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.vibeBadge}>
                <Text style={styles.vibeBadgeText}>{lastScan.vibe.toUpperCase()}</Text>
              </View>
              <View style={styles.weatherTag}>
                <Ionicons name="sunny" size={12} color="#D4AF37" />
                <Text style={styles.weatherTagText}>{lastScan.weather}</Text>
              </View>
            </View>

            <Text style={styles.outfitTitle}>The Daily Uniform</Text>

            <View style={styles.itemGrid}>
              <View style={styles.itemRow}>
                <View style={styles.iconWrapper}>
                  <Ionicons name="shirt-outline" size={15} color="#D4AF37" />
                </View>
                <Text style={styles.itemText}>{lastScan.top}</Text>
              </View>

              <View style={styles.itemRow}>
                <View style={styles.iconWrapper}>
                  <Ionicons name="git-commit-outline" size={15} color="#D4AF37" />
                </View>
                <Text style={styles.itemText}>{lastScan.bottom}</Text>
              </View>

              <View style={styles.itemRow}>
                <View style={styles.iconWrapper}>
                  <Ionicons name="footsteps-outline" size={15} color="#D4AF37" />
                </View>
                <Text style={styles.itemText}>{lastScan.shoes}</Text>
              </View>
            </View>

            {/* Luxury Scent Vault Block */}
            <View style={styles.scentBanner}>
              <View style={styles.scentInfo}>
                <Text style={styles.scentLabel}>SIGNATURE COLOGNE</Text>
                <Text style={styles.scentValue}>{lastScan.fragranceName}</Text>
                <Text style={styles.scentNotes}>{lastScan.fragranceNotes}</Text>
              </View>
              <View style={styles.scentIconCircle}>
                <Ionicons name="flask-outline" size={18} color="#D4AF37" />
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.emptyFeedCard} onPress={() => navigation.navigate("Scan")}>
            <Ionicons name="sparkles-outline" size={28} color="#555" />
            <Text style={styles.emptyText}>No curation matrix generated for today yet.</Text>
          </TouchableOpacity>
        )}

        {/* --- STATS FOOTER --- */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabelText}>Style Match</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>Charlotte</Text>
            <Text style={styles.statLabelText}>Current Hub</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  headerContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20, marginBottom: 5 },
  dateLabel: { color: "#666666", fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  greetingText: { color: "#FFFFFF", fontSize: 30, fontWeight: "800", letterSpacing: -0.5 },
  profileAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#121212", borderWidth: 1, borderColor: "#222222", justifyContent: "center", alignItems: "center" },
  avatarInner: { justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#D4AF37", fontSize: 12, fontWeight: "700" },
  scanButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#D4AF37", borderRadius: 16, paddingVertical: 18, marginTop: 25, marginBottom: 25 },
  scanButtonText: { color: "#000000", fontSize: 16, fontWeight: "800" },
  sectionHeader: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 15 },
  feedCard: { backgroundColor: "#121212", borderRadius: 16, borderWidth: 1, borderColor: "#1F1F1F", padding: 20 },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  vibeBadge: { backgroundColor: "#FFFFFF", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4 },
  vibeBadgeText: { color: "#000000", fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  weatherTag: { flexDirection: "row", alignItems: "center", backgroundColor: "#1C1C1E", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  weatherTagText: { color: "#AAAAAA", fontSize: 11, fontWeight: "600", marginLeft: 5 },
  outfitTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "700", marginBottom: 15 },
  itemGrid: { marginBottom: 20 },
  itemRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#1C1C1E", paddingVertical: 14, paddingHorizontal: 14, borderRadius: 10, marginVertical: 4 },
  iconWrapper: { marginRight: 12 },
  itemText: { color: "#FFFFFF", fontSize: 14, fontWeight: "500" },
  scentBanner: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1C1C1E", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#2C2C2E" },
  scentInfo: { flex: 1 },
  scentLabel: { color: "#D4AF37", fontSize: 9, fontWeight: "700", letterSpacing: 1, marginBottom: 4 },
  scentValue: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  scentNotes: { color: "#8E8E93", fontSize: 12, marginTop: 2 },
  scentIconCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(212, 175, 55, 0.1)", justifyContent: "center", alignItems: "center" },
  emptyFeedCard: { backgroundColor: "#121212", borderRadius: 16, padding: 30, alignItems: "center", borderWidth: 1, borderColor: "#222222", borderStyle: "dashed" },
  emptyText: { color: "#666", fontSize: 14 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  statBox: { flex: 1, backgroundColor: "#121212", borderRadius: 12, padding: 16, alignItems: "center", marginHorizontal: 4, borderWidth: 1, borderColor: "#1F1F1F" },
  statNumber: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  statLabelText: { color: "#555555", fontSize: 11, marginTop: 2 }
});
