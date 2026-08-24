import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Shadows, Typography } from '@/constants/theme';
import { formatCurrency } from '@/utils/format';

interface BudgetCardProps {
  totalBudget: number;
  plannedTotal: number;
  onEditBudget: () => void;
}

export function BudgetCard({
  totalBudget,
  plannedTotal,
  onEditBudget,
}: BudgetCardProps) {
  const percentage = totalBudget > 0 ? Math.round((plannedTotal / totalBudget) * 100) : 0;
  const remaining = totalBudget - plannedTotal;
  const isOverBudget = remaining < 0;

  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={styles.topRow}>
        <Text style={styles.label}>ORÇAMENTO TOTAL</Text>
        <TouchableOpacity
          onPress={onEditBudget}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text style={styles.editButton}>editar</Text>
        </TouchableOpacity>
      </View>

      {/* Main Budget Number */}
      <Text style={styles.budgetValue}>{formatCurrency(totalBudget)}</Text>

      {/* Progress Track */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            isOverBudget && styles.progressFillOver,
            { width: `${Math.min(Math.max(percentage, 0), 100)}%` },
          ]}
        />
      </View>

      {/* Subtitle / summary status */}
      <Text style={styles.statusText}>
        {isOverBudget
          ? `${formatCurrency(Math.abs(remaining))} acima do teto · ${percentage}% usado`
          : `${formatCurrency(remaining)} de folga · ${percentage}% usado`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.navy,
    borderRadius: 16,
    padding: 22,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    ...Shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontFamily: Typography.mono,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(218, 213, 183, 0.8)',
  },
  editButton: {
    fontFamily: Typography.mono,
    fontSize: 11,
    color: Colors.sandMuted,
    textDecorationLine: 'underline',
  },
  budgetValue: {
    fontFamily: Typography.fraunces,
    fontSize: 28,
    lineHeight: 34,
    color: Colors.paper,
    marginBottom: 16,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.navyAlpha15,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.sand,
  },
  progressFillOver: {
    backgroundColor: '#E06D53',
  },
  statusText: {
    fontFamily: Typography.mono,
    fontSize: 11,
    color: Colors.sandMuted,
  },
});
