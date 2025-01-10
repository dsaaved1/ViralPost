import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const FooterMessage = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.footerContainer, { borderTopColor: theme.border }]}>
      <Text style={[styles.footerText, { color: theme.textSecondary }]}>
        Unlock 20+ more trending content with our premium subscription!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    padding: 20,
    paddingBottom: 20,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 