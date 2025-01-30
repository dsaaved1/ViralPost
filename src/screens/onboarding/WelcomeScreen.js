import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/welcome.jpg')}
      style={styles.container}
    >
      <LinearGradient
        colors={[
          'transparent',
          'rgba(255, 45, 85, 0.3)',
          'rgba(255, 45, 85, 0.95)',
          '#FF2D55'
        ]}
        locations={[0, 0.5, 0.8, 1]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Level Up with{'\n'}ViralPost</Text>
            <Text style={styles.subtitle}>
              Discover what's trending, use it on your videos, and go viral
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Onboarding')}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
            
            
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 45,
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: 25,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#333333',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },

}); 