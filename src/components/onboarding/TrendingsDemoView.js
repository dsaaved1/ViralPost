import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

export const TrendingsDemoView = () => {
  return (
    <View>
      <Image
        source={require('../../assets/images/trending-demo.jpg')}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Trusted Trends Rankings
        </Text>
        <Text style={styles.subtitle}>
          Find trending hashtags, songs, and viral videos. Click to view them directly on TikTok and boost your engagement.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 430,
    marginTop: 0,
  },
  textContainer: {
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 