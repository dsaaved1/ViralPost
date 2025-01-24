import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const OnboardingNextScreen = ({ navigation }) => {
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
      navigation.navigate('OnboardingFinal');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.titleBig}>Did you know?</Text>
          <Text style={styles.title}>
            That using trending hashtags, songs, or recreating popular videos can significantly boost your chances of going viral?
          </Text>
        </View>

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
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>
          {step === 0 ? 'Continue' : 'Get Started'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
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
  },
  textContainer: {
    marginTop: 40,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  titleBig: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 32,
  },
  imagesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imageWrapper: {
    width: '130%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
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
}); 