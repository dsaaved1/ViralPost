import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const FooterMessage = ({ isIndustryView = false, type = 'hashtags' }) => {
  const { theme } = useTheme();

  const getFooterMessage = () => {
    if (isIndustryView) {
      return "Unlock 50+ industry trending hashtags with our premium subscription!";
    }
    switch (type) {
      case 'hashtags':
        return "Unlock 100+ trending hashtags with our premium subscription!";
      case 'songs':
        return "Unlock 100+ trending songs with our premium subscription!";
      case 'videos':
        return "Unlock 50+ trending videos with our premium subscription!";
      default:
        return "Unlock more trending content with our premium subscription!";
    }
  };

  return (
    <View style={[styles.footerContainer, { borderTopColor: theme.border }]}>
      <Text style={[styles.footerText, { color: theme.textSecondary }]}>
        {getFooterMessage()}
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
    marginHorizontal: 16,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 