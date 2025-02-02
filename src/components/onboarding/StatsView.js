import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

export const StatsView = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/stats-demo.png')}
          style={styles.image}
          //resizeMode="contain"
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>Elevate Your Reach</Text>
        {/* <Text style={styles.title}>
         Stats That Matter, Elevate Your Reach  Upload your videos with the latest trends and take your content creation to the next level.  We're here to help you! 
        </Text> */}
        <Text style={styles.subtitle}>
        Studies show that incorporating trending content can significantly boost your chances of going viral.
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
  image: {
    width: '100%',
    height: '110%',
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