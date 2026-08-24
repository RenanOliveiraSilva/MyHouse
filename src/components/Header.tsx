import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '@/constants/theme';
import { formatCurrency } from '@/utils/format';
import { StatsSummary } from '@/types/house';

interface HeaderProps {
  stats: StatsSummary;
}

export function Header({ stats }: HeaderProps) {
  return (
    <View style={styles.header}>
      {/* Subtitle tag */}
      <Text style={styles.tag}>NOSSA CASA · PROJETO A DOIS</Text>

      {/* Main Title */}
      <Text style={styles.title}>
        Lista de <Text style={styles.titleItalic}>móveis</Text> que vamos comprar
      </Text>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>PLANEJADO</Text>
          <Text style={styles.statValueNavy}>{formatCurrency(stats.plannedTotal)}</Text>
        </View>

        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>JÁ COMPRADO</Text>
          <Text style={styles.statValueTeal}>{formatCurrency(stats.purchasedTotal)}</Text>
        </View>

        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>FALTA COMPRAR</Text>
          <Text style={styles.statValueNavy}>{formatCurrency(stats.remainingToBuyTotal)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.paper,
  },
  tag: {
    fontFamily: Typography.mono,
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: Colors.stone,
    marginBottom: 8,
  },
  title: {
    fontFamily: Typography.fraunces,
    fontSize: 32,
    lineHeight: 38,
    color: Colors.navy,
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  titleItalic: {
    fontFamily: Typography.frauncesItalic,
    fontStyle: 'italic',
    color: Colors.navy,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  statColumn: {
    flex: 1,
  },
  statLabel: {
    fontFamily: Typography.mono,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: Colors.stone,
    marginBottom: 4,
  },
  statValueNavy: {
    fontFamily: Typography.fraunces,
    fontSize: 19,
    lineHeight: 24,
    color: Colors.navy,
  },
  statValueTeal: {
    fontFamily: Typography.fraunces,
    fontSize: 19,
    lineHeight: 24,
    color: Colors.teal,
  },
});
