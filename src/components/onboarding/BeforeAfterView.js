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
        duration: 400,
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
    <View>
      <View style={styles.imagesContainer}>
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
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../../assets/images/after-viral.png')}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </Animated.View>
      </View>

      <View style={styles.textContainer}>
        {/* <Text style={styles.title}>Did You Know?</Text> */}
        <Text style={styles.title}>Unlock Your Potential</Text>
        <Text style={styles.subtitle}>
        Using the right trending hashtag, song, or video idea can be the key to making your content go viral.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imagesContainer: {
    width: '100%',
    height: 450,
    marginTop: 0,
    backgroundColor: '#fff',
   
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:10
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