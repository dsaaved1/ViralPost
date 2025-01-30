import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';

export const BeforeAfterView = ({ showAfterImage }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (showAfterImage) {
      fadeIn();
    } else {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
    }
  }, [showAfterImage]);

  const fadeIn = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Animated.View
          style={[
            styles.imageWrapper,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {!showAfterImage ? (
            <Image
              source={require('../../assets/images/before-viral.png')}
              style={styles.image}
              //resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../../assets/images/after-viral.png')}
              style={styles.image}
              //resizeMode="contain"
            />
          )}
        </Animated.View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Did You Know?</Text>
        <Text style={styles.subtitle}>
          Using the right trending hashtag, song, or video idea could be the missing key to making your content go viral.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  imageContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '120%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 0.3,
    paddingHorizontal: 32,
    justifyContent: 'flex-end',
    paddingBottom: 32,
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