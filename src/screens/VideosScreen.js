import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
  Linking,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { AppLayout } from '../components/shared/AppLayout';
import { SortDropdown } from '../components/shared/SortDropdown';
import { CountryDropdown } from '../components/shared/CountryDropdown';
import { TimeRangeBox } from '../components/shared/TimeRangeBox';
import { PremiumBanner } from '../components/shared/PremiumBanner';
import { api } from '../services/apifyService';
import { useTheme } from '../context/ThemeContext';
import { FooterMessage } from '../components/shared/FooterMessage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Purchases from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const SPACING = 1;
const ITEM_WIDTH = (width - (COLUMN_COUNT + 1) * SPACING) / COLUMN_COUNT;
const MAX_VIDEOS = 15;
const FREE_VIDEOS = 9;

const VideoCard = ({ item, onPress }) => (
  <TouchableOpacity 
    style={styles.videoCard}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Image 
      source={{ uri: item.cover }} 
      style={styles.thumbnail}
      resizeMode="cover"
    />
  </TouchableOpacity>
);

const LockedVideoCard = ({ item, onPress }) => (
  <TouchableOpacity 
    style={[styles.videoCard, { opacity: 0.7 }]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Image 
      source={{ uri: item.cover }} 
      style={[styles.thumbnail, { opacity: 0.5 }]}
      resizeMode="cover"
    />
    <View style={styles.lockOverlay}>
      <Ionicons 
        name="lock-closed" 
        size={20} 
        color="#fff"
      />
    </View>
  </TouchableOpacity>
);

export const VideosScreen = () => {
  const { theme } = useTheme();
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedSort, setSelectedSort] = useState('hot');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    loadVideos();
    checkSubscriptionStatus();
  }, [selectedCountry, selectedSort]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTopVideos(selectedCountry, selectedSort);
      const videos = data.slice(0, MAX_VIDEOS).map((video, index) => ({
        ...video,
        isLocked: index >= FREE_VIDEOS
      }));
      setVideos(videos);
    } catch (error) {
      console.error(error);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const isPremium = customerInfo?.entitlements?.active?.['pro']?.isActive ?? false;
      setIsPro(isPremium);
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsPro(false);
    }
  };

  const proAction = async () => {
    try {
      const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: 'pro',
      });
      
      switch (paywallResult) {
        case PAYWALL_RESULT.NOT_PRESENTED:
          console.log("Already subscribed");
          setIsPro(true)
          break;
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          console.log("Just purchased or restored");
          setIsPro(true)
          break;
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
          console.log("Purchase cancelled or error")
          break;
        default:
          console.log("Default case");
          break;
      }
    } catch (error) {
      console.error("Error in proAction:", error);
    }
  };

  const openVideo = (url) => {
    Linking.openURL(url);
  };


  const renderVideo = ({ item, index }) => {
    if (!item.cover || !item.url) {
      return null;
    }

    if (isPro || index < FREE_VIDEOS) {
      return (
        <VideoCard 
          item={item}
          onPress={() => openVideo(item.url)}
        />
      );
    }
    
    return <LockedVideoCard item={item} onPress={proAction} />;
  };


  if (loading) {
    return (
      <AppLayout 
        selectedCountry={selectedCountry} 
        onSelectCountry={setSelectedCountry}
        onPremiumPress={proAction}
        type="videos"
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#666" />
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      selectedCountry={selectedCountry} 
      onSelectCountry={setSelectedCountry}
      extraFilters={
        <SortDropdown
          selectedSort={selectedSort}
          onSelect={setSelectedSort}
          onPremiumPress={proAction}
        />
      }
      onPremiumPress={proAction}
      type="videos"
    >
      {videos.length === 0 ? (
        <View style={styles.centered}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No data available yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={({ item, index }) => (
            <View style={styles.videoItem}>
              {renderVideo({ item, index })}
            </View>
          )}
          keyExtractor={item => item.id}
          numColumns={3}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No videos found
              </Text>
            </View>
          }
          ListFooterComponent={videos.length > 0 && !isPro ? <FooterMessage type="videos" /> : null}
          contentContainerStyle={[styles.listContentContainer, { paddingBottom: 20 }]}
        />
      )}
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  videoList: {
    padding: SPACING,
  },
  videoItem: {
    width: '33.33%',
    padding: SPACING,
  },
  videoCard: {
    width: ITEM_WIDTH - SPACING * 2,
    height: (ITEM_WIDTH - SPACING * 2) * 1.5,
    backgroundColor: '#000',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  blurredImage: {
    opacity: 0.6,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 24,
    color: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  upgradeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
  },
  footerContainer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
}); 