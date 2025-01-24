import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { OnboardingLayout } from '../../components/shared/OnboardingLayout';

export const TrendingsDemoScreen = ({ navigation }) => {
  return (
    <OnboardingLayout
      onNext={() => navigation.navigate('SchedulingDemo')}
      onBack={() => navigation.goBack()}
      currentPage={2}
    >
      <Image
        source={require('../../assets/images/trending-demo.jpg')}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Master Your Social Media Strategy
        </Text>
        <Text style={styles.subtitle}>
          Find trending hashtags, songs, and viral videos. Click to view them directly on TikTok and boost your engagement.
        </Text>
      </View>

    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 400,
    borderRadius: 24,
    marginTop: 20,
  },
  textContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
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