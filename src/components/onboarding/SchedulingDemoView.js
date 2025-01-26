import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

export const SchedulingDemoView = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/scheduling-demo.png')}
          style={styles.image}
          //resizeMode="contain"
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>Smart Content Scheduler</Text>
        <Text style={styles.subtitle}>
          Plan your content ahead and get notifications when it's time to post so you never miss the best posting times.
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
    marginBottom: 25
  },
  image: {
    width: '100%',
    height: '120%',
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