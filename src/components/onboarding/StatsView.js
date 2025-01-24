import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

export const StatsView = () => {
  return (
    <View>
    
      <Image
        source={require('../../assets/images/stats-demo.png')}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.textContainer}>
      <Text style={styles.miniSubtitle}>
          Source: Mad Penguin (2024), based on TikTok studies
        </Text>
        <Text style={styles.title}>
          Boost Your Viral Potential
        </Text>
        <Text style={styles.subtitle}>
        Upload your videos with the latest trends and take your content creation to the next level. We’re here to help!
        </Text>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 350,
    marginTop: 20,
    paddingHorizontal:30
  },
  textContainer: {
    //marginTop: 14,
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
  miniSubtitle: {
    fontSize: 6,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 34,
  },
}); 