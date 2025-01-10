import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const TimeRangeBox = () => (
  <View style={styles.timeRange}>
    <Text style={styles.timeRangeText}>Last 7 days</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  timeRange: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width: 100,
  },
  timeRangeText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
}); 