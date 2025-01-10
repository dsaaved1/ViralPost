import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const RankDisplay = ({ rank, rankDiffType = 2, rankDiff, isBlurred = false }) => {
  const RankChange = () => {
    if (rankDiffType === 4) {
      return <Text style={[styles.rankDiff, styles.rankNew]}>NEW</Text>;
    }
    
    if (rankDiffType === 2) {
      return <Text style={styles.rankSame}>-</Text>;
    }

    const color = rankDiffType === 1 ? styles.rankUp : styles.rankDown;
    const symbol = rankDiffType === 1 ? '↑' : '↓';
    return <Text style={[styles.rankDiff, color]}>{symbol}{Math.abs(rankDiff)}</Text>;
  };

  return (
    <View style={styles.rankContainer}>
      <Text style={[styles.rank, isBlurred && styles.blurredText]}>{rank}</Text>
      {isBlurred ? (
        <View style={styles.blurredRankChange}>
          <RankChange />
        </View>
      ) : (
        <RankChange />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rankDiff: {
    fontSize: 12,
    fontWeight: '500',
  },
  rankNew: {
    color: '#007AFF',
    textTransform: 'uppercase',
  },
  rankUp: {
    color: '#34C759',
  },
  rankDown: {
    color: '#FF3B30',
  },
  rankSame: {
    fontSize: 12,
    color: '#8E8E93',
  },
  blurredText: {
    opacity: 0.4,
  },
  blurredRankChange: {
    opacity: 0.3,
  },
}); 