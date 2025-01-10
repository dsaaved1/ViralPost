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
} from 'react-native';
import { api } from '../services/apifyService';
import { AppLayout } from '../components/shared/AppLayout';
import { PremiumBanner } from '../components/shared/PremiumBanner';
import { RankDisplay } from '../components/shared/RankDisplay';
import { CountryDropdown } from '../components/shared/CountryDropdown';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export const SongsScreen = () => {
  const { theme } = useTheme();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isListView, setIsListView] = useState(true);

  useEffect(() => {
    loadSongs();
  }, [selectedCountry]);

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

  const handleUpgradePress = () => {
    setShowUpgradeModal(true);
  };

  const openSongLink = (link) => {
    Linking.openURL(link);
  };

  const MAX_SONGS = 20;
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
      <View style={styles.songInfo}>
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
          <Text style={styles.lockIcon}>🔒</Text>
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

  const SongListItem = ({ item, onPress }) => (
    <TouchableOpacity 
      style={[styles.songListItem, { 
        backgroundColor: theme.cardBackground,
        borderBottomColor: theme.border 
      }]} 
      onPress={onPress}
    >
      <RankDisplay 
        rank={item.rank}
        theme={theme}
      />
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
    </TouchableOpacity>
  );

  const LockedSongListItem = ({ item, onPress }) => {
    const truncateText = (text, length) => {
      if (text.length <= length) return text;
      return `${text.slice(0, length)}...`;
    };

    return (
      <TouchableOpacity 
        style={[styles.songListItem, { 
          backgroundColor: theme.surface,
          borderBottomColor: theme.border 
        }]} 
        onPress={onPress}
      >
        <RankDisplay 
          rank={item.rank}
          isBlurred={true}
          theme={theme}
        />
        <View style={styles.songColumn}>
          <View style={styles.lockedListCoverContainer}>
            <Image 
              source={{ uri: item.cover }} 
              style={[styles.listCoverImage, { opacity: 0.5 }]}
              resizeMode="cover"
            />
            <View style={[styles.listLockOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          </View>
          <View style={styles.songDetails}>
            <Text style={[styles.listSongTitle, styles.blurredText, { color: theme.text }]} numberOfLines={1}>
              {truncateText(item.title, 6)}
            </Text>
            <Text style={[styles.listSongAuthor, styles.blurredText, { color: theme.textSecondary }]} numberOfLines={1}>
              {truncateText(item.author, 4)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSong = ({ item, index }) => {
    if (index < FREE_SONGS) {
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

    if (index >= MAX_SONGS) {
      return null;
    }
    
    return isListView ? (
      <LockedSongListItem item={item} onPress={handleUpgradePress} />
    ) : (
      <LockedSongCard item={item} onPress={handleUpgradePress} />
    );
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
            Get access to all trending songs and unlock premium features!
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
    <View style={[styles.footerContainer, dynamicStyles.footerContainer]}>
      <Text style={[styles.footerText, { color: theme.textSecondary }]}>
        Discover more trending songs with our premium subscription!
      </Text>
    </View>
  );

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
      <AppLayout 
        selectedCountry={selectedCountry} 
        onSelectCountry={setSelectedCountry}
        scrollableFilters={true}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout 
        selectedCountry={selectedCountry} 
        onSelectCountry={setSelectedCountry}
        scrollableFilters={true}
      >
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadSongs}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      selectedCountry={selectedCountry} 
      onSelectCountry={setSelectedCountry}
      extraFilters={null}
      rightControl={
        <TouchableOpacity 
          style={styles.viewToggle}
          onPress={() => setIsListView(!isListView)}
        >
          <Ionicons 
            name={isListView ? "grid-outline" : "list-outline"} 
            size={20} 
            color={theme.accent}
          />
        </TouchableOpacity>
      }
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <FlatList
          data={songs.slice(0, MAX_SONGS)}
          renderItem={renderSong}
          keyExtractor={(item) => item.id}
          numColumns={isListView ? 1 : 2}
          key={isListView ? 'list' : 'grid'}
          columnWrapperStyle={!isListView && styles.songRow}
          contentContainerStyle={isListView ? styles.listContainer : styles.gridContainer}
          ListHeaderComponent={isListView ? <TableHeader /> : null}
          refreshing={loading}
          onRefresh={loadSongs}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No songs found
              </Text>
            </View>
          }
          ListFooterComponent={<FooterMessage />}
        />
        {renderUpgradeModal()}
      </View>
      <CountryDropdown
        selectedCountry={selectedCountry}
        onSelect={setSelectedCountry}
        onPremiumPress={handleUpgradePress}
        type="songs"
      />
    </AppLayout>
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
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  lockIcon: {
    fontSize: 24,
    color: '#007AFF',
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
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
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 0,
    textAlign: 'center',
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
    paddingBottom: 100,
  },
}); 