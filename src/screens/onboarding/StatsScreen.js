import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingLayout } from '../../components/shared/OnboardingLayout';

export const StatsScreen = ({ navigation }) => {
  return (
    <OnboardingLayout
      onNext={() => navigation.navigate('TrendingsDemo')}
      onBack={() => navigation.goBack()}
      currentPage={1}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          In fact, TikTok studies reveal:
        </Text>
        
      </View>
      <Image
        source={require('../../assets/images/stats-demo.png')}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.textContainer}>
       
        <Text style={styles.subtitle}>
        Source: Mad Penguin (2024), based on TikTok studies
        </Text>
      </View>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 40,
  },
  bulletPoints: {
    paddingHorizontal: 20,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  bullet: {
    fontSize: 20,
    marginRight: 8,
    color: '#333333',
  },
  bulletText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 26,
    color: '#333333',
  },
  nextButton: {
    backgroundColor: '#FF2D55',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  textContainer: {
    padding: 24,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: '#333333',
  },
}); 