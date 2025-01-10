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

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const SPACING = 1;
const ITEM_WIDTH = (width - (COLUMN_COUNT + 1) * SPACING) / COLUMN_COUNT;
const VIDEOS_PER_PAGE = 12;
const MAX_VIDEOS = 24;

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
    style={styles.videoCard}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Image 
      source={{ uri: item.cover }} 
      style={[styles.thumbnail, styles.blurredImage]}
      resizeMode="cover"
    />
    <View style={styles.lockOverlay}>
      <Text style={styles.lockIcon}>🔒</Text>
    </View>
  </TouchableOpacity>
);

export const VideosScreen = () => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedSort, setSelectedSort] = useState('hot');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    loadVideos();
  }, [selectedCountry, selectedSort]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTopVideos(selectedCountry);
      setVideos(data);
    } catch (error) {
      console.error(error);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const openVideo = (url) => {
    Linking.openURL(url);
  };

  const handleUpgradePress = () => {
    setShowUpgradeModal(true);
  };

  const renderVideo = ({ item, index }) => {
    if (index < VIDEOS_PER_PAGE) {
      return (
        <VideoCard 
          item={item}
          onPress={() => openVideo(item.url)}
        />
      );
    }
    
    if (index >= MAX_VIDEOS) {
      return null;
    }
    
    return <LockedVideoCard item={item} onPress={handleUpgradePress} />;
  };

  const renderUpgradeModal = () => (
    <Modal
      visible={showUpgradeModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowUpgradeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.upgradeModal}>
          <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
          <Text style={styles.upgradeDescription}>
            Get access to all trending videos and unlock premium features!
          </Text>
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={() => setShowUpgradeModal(false)}
          >
            <Text style={styles.upgradeButtonText}>Subscribe Now</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setShowUpgradeModal(false)}
          >
            <Text style={styles.cancelButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const FooterMessage = () => (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>
        Discover more trending content with our premium subscription!
      </Text>
    </View>
  );

  if (loading) {
    return (
      <AppLayout 
        selectedCountry={selectedCountry} 
        onSelectCountry={setSelectedCountry}
        onPremiumPress={handleUpgradePress}
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
          onPremiumPress={handleUpgradePress}
        />
      }
      onPremiumPress={handleUpgradePress}
      type="videos"
    >
      <FlatList
        data={videos.slice(0, MAX_VIDEOS)}
        renderItem={({ item, index }) => (
          <View style={styles.videoItem}>
            {renderVideo({ item, index })}
          </View>
        )}
        keyExtractor={item => item.id}
        numColumns={3}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No videos found</Text>
            <Text style={styles.footerText}>
              Unlock more trending videos with our premium subscription!
            </Text>
          </View>
        }
        ListFooterComponent={videos.length > 0 ? <FooterMessage /> : null}
        contentContainerStyle={styles.videoList}
      />
      {renderUpgradeModal()}
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 24,
    color: '#007AFF',
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
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
}); 