import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native';

export const PremiumBanner = ({ onPress, style }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.container, style]}
    >
      <Text style={[styles.lockIcon, { color: theme.textSecondary }]}>
        🔒
      </Text>
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        Unlock Premium Content
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#007AFF10',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lockIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  text: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
}); 