import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppLayout } from '../components/shared/AppLayout';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = 200;

export const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <AppLayout showFilters={false}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="trending-up" size={32} color="#FF2D55" />
            <Text style={styles.title}>Trendify</Text>
          </View>
          <Text style={styles.subtitle}>Discover What's Hot</Text>
        </View>
        
        <View style={styles.content}>
          <TouchableOpacity 
            style={[styles.card, styles.cardElevated]}
            onPress={() => navigation.navigate('Hashtags')}
          >
            <Image 
              source={require('../assets/images/hashtags.jpg')}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardOverlay}>
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                style={styles.cardGradient}
              />
              <View style={styles.cardContent}>
                <Ionicons name="apps" size={32} color="#fff" />
                <Text style={styles.cardText}>Hashtags</Text>
                <Text style={styles.cardSubtext}>Trending Topics</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.cardElevated]}
            onPress={() => navigation.navigate('Songs')}
          >
            <Image 
              source={require('../assets/images/songs.jpg')}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardOverlay}>
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                style={styles.cardGradient}
              />
              <View style={styles.cardContent}>
                <Ionicons name="musical-notes" size={32} color="#fff" />
                <Text style={styles.cardText}>Songs</Text>
                <Text style={styles.cardSubtext}>Popular Songs</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.cardElevated]}
            onPress={() => navigation.navigate('Videos')}
          >
            <Image 
              source={require('../assets/images/videos.jpg')}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardOverlay}>
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                style={styles.cardGradient}
              />
              <View style={styles.cardContent}>
                <Ionicons name="videocam" size={32} color="#fff" />
                <Text style={styles.cardText}>Videos</Text>
                <Text style={styles.cardSubtext}>Trending Videos</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </AppLayout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FF2D55',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    marginLeft: 42,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  cardElevated: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
  },
  cardContent: {
    padding: 20,
    alignItems: 'center',
  },
  cardText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  cardSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
}); 