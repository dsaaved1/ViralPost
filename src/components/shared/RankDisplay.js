import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const RankDisplay = ({ rank, rankDiffType, rankDiff, isBlurred = false, theme }) => {
  const getRankChangeDisplay = () => {
    switch (rankDiffType) {
      case 4:
        return 'NEW';
      case 1:
        return `↑${Math.abs(rankDiff || 1)}`;
      case 3:
        return `↓${Math.abs(rankDiff || 1)}`;
      case 2:
      default:
        return '-';
    }
  };

  const getRankChangeColor = () => {
    switch (rankDiffType) {
      case 4:
        return '#007AFF';
      case 1:
        return '#34C759';
      case 3:
        return '#FF3B30';
      case 2:
      default:
        return theme.textSecondary;
    }
  };

  return (
    <View style={styles.rankContainer}>
      <Text style={[
        styles.rankText,
        { color: theme.text },
        isBlurred && styles.blurredText
      ]}>
        {rank}
      </Text>
      <Text style={[
        styles.rankChange,
        { color: getRankChangeColor() },
        isBlurred && styles.blurredText
      ]}>
        {getRankChangeDisplay()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rankChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  blurredText: {
    opacity: 0.4,
  },
}); 