import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Linking,
  ActivityIndicator,
  Modal,
  LinearGradient,
  SafeAreaView,
} from 'react-native';
import { api } from '../services/apifyService';
import { AppLayout } from '../components/shared/AppLayout';
import { PremiumBanner } from '../components/shared/PremiumBanner';
import { RankDisplay } from '../components/shared/RankDisplay';
import { CountryDropdown } from '../components/shared/CountryDropdown';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { FooterMessage } from '../components/shared/FooterMessage';
import { storageService } from '../services/storageService';
import { CustomHeader } from '../components/shared/CustomHeader';
import { FilterModal } from '../components/shared/FilterModal';

import Purchases from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

export const SongsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [isListView] = useState(true);
  const [savedSongs, setSavedSongs] = useState(new Set());
  const [isPro, setIsPro] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    loadSongs();
  }, [selectedCountry]);

  useEffect(() => {
    loadSavedSongs();
  }, []);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const loadSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTopSongs(selectedCountry);
      setSongs(data);
    } catch (error) {
      console.error(error);
      setError('Failed to load songs');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedSongs = async () => {
    try {
      const saved = await storageService.getSavedItems();
      const songIds = new Set(saved.unscheduled
        .filter(item => item.type === 'song')
        .map(item => item.id));
      setSavedSongs(songIds);
    } catch (error) {
      console.error('Error loading saved songs:', error);
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
          console.log("Already subscribed in songs");
          setIsPro(true)
          break;
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          setIsPro(true);
          break;
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
        default:
          break;
      }
    } catch (error) {
      console.error("Error in proAction:", error);
    }
  };

  const openSongLink = (link) => {
    Linking.openURL(link);
  };

  const handleSaveSong = async (song) => {
    try {
      if (savedSongs.has(song.id)) {
        await storageService.removeSong(song.id);
        setSavedSongs(prev => {
          const newSet = new Set(prev);
          newSet.delete(song.id);
          return newSet;
        });
      } else {
        await storageService.saveSong(song);
        setSavedSongs(prev => {
          const newSet = new Set(prev);
          newSet.add(song.id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error saving song:', error);
    }
  };

  const MAX_SONGS = isPro ? 100 : 15;
  const FREE_SONGS = 10;

  const dynamicStyles = {
    footerContainer: {
      borderTopColor: theme.border,
    },
    rankBadge: {
      backgroundColor: theme.isDark ? 'rgba(0, 0, 0, 0.7)' : '#FF2D55',
    },
  };

  const SongCard = ({ item, onPress }) => (
    <TouchableOpacity 
      style={[styles.songCard, { backgroundColor: theme.cardBackground }]} 
      onPress={onPress}
    >
      <View style={[styles.rankBadge, dynamicStyles.rankBadge]}>
        <Text style={styles.rankBadgeText}>#{item.rank}</Text>
      </View>
      <Image 
        source={{ uri: item.cover }} 
        style={styles.coverImage}
        resizeMode="cover"
      />
      <View style={styles.songCardContent}>
        <Text style={[styles.songTitle, { color: theme.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.songAuthor, { color: theme.textSecondary }]} numberOfLines={1}>
          {item.author}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const LockedSongCard = ({ item, onPress }) => (
    <TouchableOpacity 
      style={[styles.songCard, { backgroundColor: theme.surface }]} 
      onPress={onPress}
    >
      <View style={[styles.rankBadge, { backgroundColor: 'rgba(0, 0, 0, 0.4)' }]}>
        <Text style={[styles.rankBadgeText, { color: '#999' }]}>#{item.rank}</Text>
      </View>
      <View style={styles.lockedCoverContainer}>
        <Image 
          source={{ uri: item.cover }} 
          style={[styles.coverImage, { opacity: 0.5 }]}
          resizeMode="cover"
        />
        <View style={[styles.lockOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}>
          <Ionicons 
            name="lock-closed" 
            size={28}
            color="#fff"
          />
        </View>
      </View>
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, styles.blurredText, { color: theme.text }]} numberOfLines={1}>
          {item.title.slice(0, 3)}...
        </Text>
        <Text style={[styles.songAuthor, styles.blurredText, { color: theme.textSecondary }]} numberOfLines={1}>
          {item.author.slice(0, 3)}...
        </Text>
      </View>
    </TouchableOpacity>
  );

  const SongListItem = ({ item, onPress }) => {
    const { theme } = useTheme();
    const isSaved = savedSongs.has(item.id);
    
    return (
      <TouchableOpacity 
        style={[styles.songListItem, { backgroundColor: theme.surface }]}
        onPress={onPress}
      >
        <View style={styles.rankColumn}>
          <RankDisplay 
            rank={item.rank}
            rankDiff={item.rankDiff}
            rankDiffType={item.rankDiffType}
            theme={theme}
          />
        </View>
        <View style={styles.songColumn}>
          <Image 
            source={{ uri: item.cover }} 
            style={styles.listCoverImage}
            resizeMode="cover"
          />
          <View style={styles.songDetails}>
            <Text style={[styles.listSongTitle, { color: theme.text }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.listSongAuthor, { color: theme.textSecondary }]} numberOfLines={1}>
              {item.author}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={(e) => {
            e.stopPropagation();
            handleSaveSong(item);
          }}
        >
          <Ionicons 
            name={isSaved ? "heart" : "heart-outline"}
            size={20} 
            color={isSaved ? "#FF4B4B" : theme.textSecondary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const LockedSongListItem = ({ item, onPress }) => {
    const { theme } = useTheme();
    const truncateText = (text, length) => {
      if (text.length <= length) return text;
      return `${text.slice(0, length)}...`;
    };

    return (
      <TouchableOpacity 
        style={[styles.songListItem, { backgroundColor: theme.surface }]}
        onPress={onPress}
      >
        <View style={styles.rankColumn}>
          <RankDisplay 
            rank={item.rank}
            rankDiff={item.rankDiff}
            rankDiffType={item.rankDiffType}
            theme={theme}
            isBlurred={true}
          />
        </View>
        <View style={styles.songColumn}>
          <View style={styles.lockedListCoverContainer}>
            <Image 
              source={{ uri: item.cover }} 
              style={[styles.listCoverImage, { opacity: 0.5 }]}
              resizeMode="cover"
            />
            <View style={[styles.listLockOverlay, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
              <Ionicons name="lock-closed" size={20} color="#fff" />
            </View>
          </View>
          <View style={styles.songDetails}>
            <Text style={[styles.listSongTitle, styles.blurredText, { color: theme.text }]} numberOfLines={1}>
            {truncateText(item.title, 6)}
            </Text>
            <Text style={[styles.listSongAuthor, styles.blurredText, { color: theme.textSecondary }]} numberOfLines={1}>
            {truncateText(item.author, 6)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSong = ({ item, index }) => {
    // If the user is Pro, show all songs unlocked
    if (isPro) {
      return isListView ? (
        <SongListItem 
          item={item} 
          onPress={() => openSongLink(item.link)}
        />
      ) : (
        <SongCard 
          item={item} 
          onPress={() => openSongLink(item.link)}
        />
      );
    }

    // Lock only first 3 entries for non-pro users
    const isLocked = index < 3;
    
    if (!isLocked) {
      return isListView ? (
        <SongListItem 
          item={item} 
          onPress={() => openSongLink(item.link)}
        />
      ) : (
        <SongCard 
          item={item} 
          onPress={() => openSongLink(item.link)}
        />
      );
    }
    
    return isListView ? (
      <LockedSongListItem item={item} onPress={proAction} />
    ) : (
      <LockedSongCard item={item} onPress={proAction} />
    );
  };

  const TableHeader = () => (
    <View style={[styles.headerRow, { 
      backgroundColor: theme.surface,
      borderBottomColor: theme.border
    }]}>
      <View style={styles.rankHeader}>
        <Text style={[styles.headerText, { color: theme.textSecondary }]}>Rank</Text>
      </View>
      <View style={styles.songHeader}>
        <Text style={[styles.headerText, { color: theme.textSecondary }]}>Songs</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <CustomHeader 
          title="Songs"
          onBack={() => navigation.goBack()}
          onFilter={() => setShowFilterModal(true)}
        />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#666" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <CustomHeader 
          title="Songs"
          onBack={() => navigation.goBack()}
          onFilter={() => setShowFilterModal(true)}
        />
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadSongs}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView style={{ backgroundColor: theme.background }}>
        <CustomHeader 
          title="Songs"
          onBack={() => navigation.goBack()}
          onFilter={() => setShowFilterModal(true)}
        />
      </SafeAreaView>
      
      <AppLayout
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        onPremiumPress={proAction}
        type="songs"
        showFilters={false}
      >
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <FlatList
            data={songs.slice(0, MAX_SONGS)}
            renderItem={renderSong}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={<TableHeader />}
            refreshing={loading}
            onRefresh={loadSongs}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  No songs found
                </Text>
              </View>
            }
            ListFooterComponent={songs.length > 0 ? <FooterMessage isPro={isPro} type="songs" /> : null}
          />
        </View>
      </AppLayout>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={() => loadSongs()}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        type="songs"
        showIndustry={false}
        showCountry={true}
      />
    </View>
  );
};

const BORDER_RADIUS = 12;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  songCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    marginBottom: 16,
  },
  rankBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: BORDER_RADIUS / 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  rankBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 0,
    textAlign: 'center',
  },
  coverImage: {
    width: '100%',
    aspectRatio: 1,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
  },
  songInfo: {
    padding: 12,
  },
  songTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  songAuthor: {
    fontSize: 12,
    color: '#666',
  },
  blurredText: {
    opacity: 0.4,
  },
  blurredImage: {
    opacity: 0.5,
  },
  lockedCoverContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
  },
  lockIcon: {
    marginLeft: 8,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeModal: {
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS,
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
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  viewToggle: {
    padding: 4,
  },
  viewToggleText: {
    fontSize: 18,
    color: '#007AFF',
    lineHeight: 18,
  },
  songListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 16,
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    paddingRight: 12,
  },
  rankColumn: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  songColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    marginRight: 8,
  },
  listCoverImage: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS / 1.5,
  },
  songDetails: {
    marginLeft: 12,
    flex: 1,
  },
  listSongTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  listSongAuthor: {
    fontSize: 14,
    color: '#8E8E93',
  },
  lockedListCoverContainer: {
    position: 'relative',
    width: 56,
    height: 56,
  },
  listLockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  listContainer: {
    paddingHorizontal: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rankHeader: {
    width: 50,
    alignItems: 'center',
  },
  songHeader: {
    flex: 1,
    paddingLeft: 16,
  },
  rankSame: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  blurredRankChange: {
    opacity: 0.3,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  gridContainer: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  saveButton: {
    padding: 8,
    marginLeft: 8,
  },
  songContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  songCover: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  songCardContent: {
    padding: 16,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#FF4B4B',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 16,
  },
}); 