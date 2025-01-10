import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Linking,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { AppLayout } from '../components/shared/AppLayout';
import { PremiumBanner } from '../components/shared/PremiumBanner';
import { RankDisplay } from '../components/shared/RankDisplay';
import { api } from '../services/apifyService';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MAX_HASHTAGS = 20;
const FREE_HASHTAGS = 10;

const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${Math.round(num / 1000000)}M`;
  }
  if (num >= 1000) {
    return `${Math.round(num / 1000)}K`;
  }
  return num.toString();
};

export const HashtagsScreen = () => {
  const { theme } = useTheme();
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    loadHashtags();
  }, [selectedCountry]);

  const loadHashtags = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTopHashtags(selectedCountry);
      setHashtags(data);
    } catch (error) {
      console.error(error);
      setError('Failed to load hashtags');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradePress = () => {
    setShowUpgradeModal(true);
  };

  const TableHeader = () => (
    <View style={[styles.headerRow, { 
      backgroundColor: theme.surface,
      borderBottomColor: theme.border
    }]}>
      <View style={styles.rankHeader}>
        <Text style={[styles.headerText, { color: theme.textSecondary }]}>Rank</Text>
      </View>
      <View style={styles.hashtagHeader}>
        <Text style={[styles.headerText, { color: theme.textSecondary }]}>Hashtag</Text>
      </View>
      <View style={styles.statsHeader}>
        <Text style={[styles.headerText, { color: theme.textSecondary }]}>Posts</Text>
      </View>
      <View style={styles.statsHeader}>
        <Text style={[styles.headerText, { color: theme.textSecondary }]}>Views</Text>
      </View>
    </View>
  );

  const HashtagItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.hashtagItem, 
        { 
          backgroundColor: theme.cardBackground,
          shadowColor: theme.text,
        }
      ]} 
      onPress={() => Linking.openURL(`https://www.tiktok.com/tag/${item.name}`)}
      activeOpacity={0.6}
    >
      <LinearGradient
        colors={[theme.cardBackground, theme.surface]}
        style={[styles.hashtagGradient, { opacity: 0.5 }]}
      />
      <View style={styles.rankContainer}>
        <RankDisplay 
          rank={item.rank} 
          rankDiffType={item.rankDiffType} 
          rankDiff={item.rankDiff}
          theme={theme}
        />
      </View>
      <View style={styles.hashtagInfo}>
        <Text style={[styles.hashtagName, { 
          color: theme.isDark ? '#FFFFFF' : theme.accent
        }]}>#{item.name}</Text>
      </View>
      <View style={styles.statsValue}>
        <Text style={[styles.statsText, { color: theme.textSecondary }]}>
          {formatNumber(item.posts)}
        </Text>
      </View>
      <View style={styles.statsValue}>
        <Text style={[styles.statsText, { color: theme.textSecondary }]}>
          {formatNumber(item.views)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const LockedHashtagItem = ({ item, onPress }) => {
    const truncateText = (text, length) => {
      if (text.length <= length) return text;
      return `${text.slice(0, length)}...`;
    };

    return (
      <TouchableOpacity 
        style={[
          styles.hashtagItem, 
          { 
            backgroundColor: theme.surface,
            shadowColor: theme.text,
          }
        ]} 
        onPress={onPress}
        activeOpacity={0.6}
      >
        <LinearGradient
          colors={[theme.cardBackground, theme.surface]}
          style={[styles.hashtagGradient, { opacity: theme.isDark ? 0.3 : 0.1 }]}
        />
        <View style={styles.rankContainer}>
          <RankDisplay 
            rank={item.rank} 
            rankDiffType={item.rankDiffType} 
            rankDiff={item.rankDiff}
            isBlurred={true}
            theme={theme}
          />
        </View>
        <View style={styles.hashtagInfo}>
          <Text style={[styles.hashtagName, { color: theme.textSecondary, opacity: 0.5 }]}>
            #{truncateText(item.name, 4)}
          </Text>
        </View>
        <View style={styles.statsValue}>
          <Text style={[styles.statsText, { color: theme.textSecondary, opacity: 0.5 }]}>
            {formatNumber(item.posts)}
          </Text>
        </View>
        <View style={styles.statsValue}>
          <Text style={[styles.statsText, { color: theme.textSecondary, opacity: 0.5 }]}>
            {formatNumber(item.views)}
          </Text>
        </View>
        <View style={[styles.lockOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}>
          <View style={styles.lockIconContainer}>
            <Ionicons name="lock-closed" size={20} color={theme.textSecondary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const FooterMessage = () => (
    <View style={[styles.footerContainer, {
      borderTopColor: theme.border
    }]}>
      <Text style={[styles.footerText, { color: theme.textSecondary }]}>
        Unlock more trending hashtags with our premium subscription!
      </Text>
    </View>
  );

  const renderHashtag = ({ item, index }) => {
    if (index < FREE_HASHTAGS) {
      return <HashtagItem item={item} />;
    }
    return <LockedHashtagItem item={item} onPress={handleUpgradePress} />;
  };

  const renderUpgradeModal = () => (
    <Modal
      visible={showUpgradeModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowUpgradeModal(false)}
    >
      <View style={[styles.modalOverlay, { backgroundColor: theme.modalBackground }]}>
        <View style={[styles.upgradeModal, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.upgradeTitle, { color: theme.accent }]}>
            Upgrade to Premium
          </Text>
          <Text style={[styles.upgradeDescription, { color: theme.textSecondary }]}>
            Get access to all trending hashtags and unlock premium features!
          </Text>
          <TouchableOpacity 
            style={[styles.upgradeButton, { backgroundColor: theme.accent }]}
            onPress={() => setShowUpgradeModal(false)}
          >
            <Text style={styles.upgradeButtonText}>Subscribe Now</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setShowUpgradeModal(false)}
          >
            <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>
              Maybe Later
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <AppLayout 
        selectedCountry={selectedCountry} 
        onSelectCountry={setSelectedCountry}
        onPremiumPress={handleUpgradePress}
        type="hashtags"
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
      onPremiumPress={handleUpgradePress}
      type="hashtags"
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <FlatList
          data={hashtags.slice(0, MAX_HASHTAGS)}
          renderItem={renderHashtag}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          onRefresh={loadHashtags}
          ListHeaderComponent={<TableHeader />}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No hashtags found
              </Text>
            </View>
          }
          ListFooterComponent={hashtags.length > 0 ? <FooterMessage /> : null}
          style={{ backgroundColor: theme.background }}
          contentContainerStyle={styles.listContentContainer}
        />
        {renderUpgradeModal()}
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
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
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rankHeader: {
    width: 50,
    alignItems: 'center',
  },
  hashtagHeader: {
    flex: 1,
    marginLeft: 16,
  },
  statsHeader: {
    width: 80,
    alignItems: 'flex-end',
  },
  hashtagItem: {
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
  hashtagInfo: {
    flex: 1,
    marginLeft: 16,
  },
  hashtagName: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsValue: {
    width: 80,
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  statsText: {
    fontSize: 13,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  blurredText: {
    opacity: 0.4,
  },
  redactedText: {
    color: '#999',
    letterSpacing: 0,
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
  lockedItem: {
    opacity: 0.9,
    backgroundColor: '#f8f9fa',
  },
  lockIconContainer: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 8,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
    padding: 8,
  },
  fadeIn: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  hashtagGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  listContainer: {
    paddingBottom: 20,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  titleSection: {
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF2D55',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#FF2D55',
    opacity: 0.8,
    fontWeight: '500',
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countryDropdown: {
    flex: 1,
    marginRight: 12,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
}); 