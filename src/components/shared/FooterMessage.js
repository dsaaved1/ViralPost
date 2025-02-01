import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const FooterMessage = ({ isIndustryView = false, type = 'hashtags', isPro = false }) => {
  const { theme } = useTheme();

  const getFooterMessage = () => {
    if (isPro) {
      switch (type) {
        case 'hashtags':
          return "✨ You've reached the end of today's trending hashtags. Check back tomorrow for new trends!";
        case 'songs':
          return "🎵 You've seen all of today's trending sounds. New trending sounds are added daily!";
        case 'videos':
          return "🎥 That's all for today's trending video ideas. Come back tomorrow for fresh inspiration!";
        default:
          return "Check back tomorrow for new trending content!";
      }
    }

    if (isIndustryView) {
      return "🔥 Want to see all trending hashtags? Upgrade to access the complete list!";
    }

    switch (type) {
      case 'hashtags':
        return "🔥 Unlock the top 3 trending hashtags plus 85 more. Upgrade to access the complete list!";
      case 'songs':
        return "🎵 Want to see all trending sounds? Upgrade to access the complete list!";
      case 'videos':
        return "📱 Want to see more trending videos? Upgrade to access the complete list!";
      default:
        return "Unlock more trending content with our premium subscription!";
    }
  };

  return (
    <View style={[styles.container, { borderTopColor: theme.border }]}>
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        {getFooterMessage()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    paddingBottom: 50
  },
  text: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 