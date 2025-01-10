import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export const PremiumBanner = ({ onPress }) => (
  <TouchableOpacity style={styles.premiumBanner} onPress={onPress}>
    <View style={styles.premiumContent}>
      <Text style={styles.lockIcon}>🔒</Text>
      <Text style={styles.premiumText}>Unlock all trending content with Premium</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  premiumBanner: {
    padding: 12,
    backgroundColor: '#007AFF10',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  lockIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  premiumText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
}); 