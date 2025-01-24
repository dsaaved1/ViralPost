import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import { OnboardingLayout } from '../../components/shared/OnboardingLayout';

export const BeforeAfterScreen = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    fadeIn();
  }, []);

  const fadeIn = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    if (step < 1) {
      setStep(step + 1);
      fadeIn();
    } else {
      navigation.navigate('Stats');
    }
  };

  return (
    <OnboardingLayout
      onNext={handleNext}
      onBack={() => navigation.goBack()}
      nextText={step === 0 ? 'Continue' : 'Next'}
      currentPage={0}
    >
      <View style={styles.imagesContainer}>
        {step === 0 ? (
          <Animated.View
            style={[
              styles.imageWrapper,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Image
              source={require('../../assets/images/before-viral.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              styles.imageWrapper,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Image
              source={require('../../assets/images/after-viral.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </Animated.View>
        )}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Boost Your Viral Potential</Text>
        <Text style={styles.subtitle}>
          Using trending hashtags, songs, and recreating popular videos can significantly increase your chances of going viral on TikTok.
        </Text>
      </View>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  imagesContainer: {
    width: '100%',
    height: 430,
    marginTop: 0,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
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