import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppLayout } from '../components/shared/AppLayout';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { ViralPostIcon } from '../assets/svgs/ViralPost';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import notificationService from '../services/notificationService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = 195;


export const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [loadingImages, setLoadingImages] = useState({
    hashtags: true,
    songs: true,
    videos: true,
  });
  
  useEffect(() => {
    checkAndShowPaywall();
    requestNotificationPermission();
  }, []);

  const checkAndShowPaywall = async () => {
    try {
      const shouldShowPaywall = await AsyncStorage.getItem('shouldShowPaywall');
      
      if (shouldShowPaywall === 'true') {
        // Remove the flag so it won't show again
        await AsyncStorage.removeItem('shouldShowPaywall');
        
        // Show paywall
        const paywallResult = await RevenueCatUI.presentPaywall({
          requiredEntitlementIdentifier: 'pro',
        });
        
        switch (paywallResult) {
          case PAYWALL_RESULT.PURCHASED:
          case PAYWALL_RESULT.RESTORED:
            // Handle successful purchase
            break;
          case PAYWALL_RESULT.CANCELLED:
          case PAYWALL_RESULT.ERROR:
          default:
            // Handle other cases
            break;
        }
      }
    } catch (error) {
      console.error('Error checking/showing paywall:', error);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const hasAsked = await AsyncStorage.getItem('hasAskedNotifications');
      if (hasAsked !== 'true') {
        Alert.alert(
          '"ViralPost" Would Like to Send You Notifications',
          'Notifications may include alerts, sounds, and icon badges.',
          [
            {
              text: "Don't Allow",
              style: 'cancel',
              onPress: async () => {
                await AsyncStorage.setItem('hasAskedNotifications', 'true');
              }
            },
            {
              text: 'Allow',
              onPress: async () => {
                await AsyncStorage.setItem('hasAskedNotifications', 'true');
                const token = await notificationService.requestPermissions();
                if (!token) {
                  Alert.alert(
                    'Notifications Disabled',
                    'To receive notifications, go to Settings and enable notifications for ViralPost.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Open Settings', 
                        onPress: () => notificationService.openNotificationSettings() 
                      }
                    ]
                  );
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ViralPostIcon width={32} height={32} fill={theme.accent} />
          <Text style={[styles.title, { color: theme.text }]}>ViralPost</Text>
        </View>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Discover What's Hot 
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Hashtags')}
        >
          {loadingImages.hashtags && (
            <ActivityIndicator 
              size="large" 
              color="#666"
              style={styles.loadingIndicator}
            />
          )}
          <Image 
            source={require('../assets/images/hashtags.jpg')}
            style={styles.cardImage}
            resizeMode="cover"
            onLoadStart={() => setLoadingImages(prev => ({ ...prev, hashtags: true }))}
            onLoadEnd={() => setLoadingImages(prev => ({ ...prev, hashtags: false }))}
          />
          <View style={styles.cardOverlay}>
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
              style={styles.cardGradient}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardIcon}>#</Text>
              <Text style={styles.cardText}>Hashtags</Text>
              <Text style={styles.cardSubtext}>Trending Topics</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, styles.cardElevated]}
          onPress={() => navigation.navigate('Songs')}
        >
          {loadingImages.songs && (
            <ActivityIndicator 
              size="large" 
              color="#666"
              style={styles.loadingIndicator}
            />
          )}
          <Image 
            source={require('../assets/images/songs.jpg')}
            style={styles.cardImage}
            resizeMode="cover"
            onLoadStart={() => setLoadingImages(prev => ({ ...prev, songs: true }))}
            onLoadEnd={() => setLoadingImages(prev => ({ ...prev, songs: false }))}
          />
          <View style={styles.cardOverlay}>
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
              style={styles.cardGradient}
            />
            <View style={styles.cardContent}>
              <Ionicons name="musical-notes" size={32} color="#fff" />
              <Text style={styles.cardText}>Songs</Text>
              <Text style={styles.cardSubtext}>Trending Songs</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, styles.cardElevated]}
          onPress={() => navigation.navigate('Videos')}
        >
          {loadingImages.videos && (
            <ActivityIndicator 
              size="large" 
              color="#666"
              style={styles.loadingIndicator}
            />
          )}
          <Image 
            source={require('../assets/images/videos.jpg')}
            style={styles.cardImage}
            resizeMode="cover"
            onLoadStart={() => setLoadingImages(prev => ({ ...prev, videos: true }))}
            onLoadEnd={() => setLoadingImages(prev => ({ ...prev, videos: false }))}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    marginLeft: 42,
    opacity: 0.8,
  },
  cardsContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    transform: [{ scale: 1 }],
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
    padding: 24,
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  loadingIndicator: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    top: '45%',
  },
}); 