import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { OnboardingLayout } from '../../components/shared/OnboardingLayout';

export const SchedulingDemoScreen = ({ navigation }) => {
  return (
    <OnboardingLayout
      onNext={() => navigation.navigate('MainTabs')}
      onBack={() => navigation.goBack()}
      nextText="Get Started"
      currentPage={3}
    >
      <Image
        source={require('../../assets/images/scheduling-demo.jpg')}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Schedule Your Content
        </Text>
        <Text style={styles.subtitle}>
          Plan your content ahead with our scheduling feature. Get notifications when it's time to post and never miss the best posting times.
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