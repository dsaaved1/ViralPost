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

const TableHeader = () => (
  <View style={styles.headerRow}>
    <View style={styles.rankHeader}>
      <Text style={styles.headerText}>Rank</Text>
    </View>
    <View style={styles.hashtagHeader}>
      <Text style={styles.headerText}>Hashtag</Text>
    </View>
    <View style={styles.statsHeader}>
      <Text style={styles.headerText}>Posts</Text>
    </View>
    <View style={styles.statsHeader}>
      <Text style={styles.headerText}>Views</Text>
    </View>
  </View>
);

const HashtagItem = ({ item }) => (
  <TouchableOpacity 
    style={styles.hashtagItem} 
    onPress={() => Linking.openURL(`https://www.tiktok.com/tag/${item.name}`)}
    activeOpacity={0.6}
  >
    <LinearGradient
      colors={['#fff', '#f8f9fa']}
      style={[styles.hashtagGradient, { opacity: 0.5 }]}
    />
    <View style={styles.rankContainer}>
      <RankDisplay 
        rank={item.rank} 
        rankDiffType={item.rankDiffType} 
        rankDiff={item.rankDiff}
      />
    </View>
    <View style={styles.hashtagInfo}>
      <Text style={styles.hashtagName}>#{item.name}</Text>
    </View>
    <View style={styles.statsValue}>
      <Text style={styles.statsText}>{formatNumber(item.posts)}</Text>
    </View>
    <View style={styles.statsValue}>
      <Text style={styles.statsText}>{formatNumber(item.views)}</Text>
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
      style={[styles.hashtagItem, styles.lockedItem]} 
      onPress={onPress}
      activeOpacity={0.6}
    >
      <LinearGradient
        colors={['#fff', '#f8f9fa']}
        style={[styles.hashtagGradient, { opacity: 0.3 }]}
      />
      <View style={styles.rankContainer}>
        <RankDisplay 
          rank={item.rank} 
          rankDiffType={item.rankDiffType} 
          rankDiff={item.rankDiff}
          isBlurred={true}
        />
      </View>
      <View style={styles.hashtagInfo}>
        <Text style={[styles.hashtagName, styles.redactedText]}>
          #{truncateText(item.name, 4)}
        </Text>
      </View>
      <View style={styles.statsValue}>
        <Text style={[styles.statsText, styles.blurredText]}>
          {formatNumber(item.posts)}
        </Text>
      </View>
      <View style={styles.statsValue}>
        <Text style={[styles.statsText, styles.blurredText]}>
          {formatNumber(item.views)}
        </Text>
      </View>
      <View style={styles.lockIconContainer}>
        <Text style={styles.lockIcon}>🔒</Text>
      </View>
    </TouchableOpacity>
  );
};

const FooterMessage = () => (
  <View style={styles.footerContainer}>
    <Text style={styles.footerText}>
      Unlock more trending hashtags with our premium subscription!
    </Text>
  </View>
);

export const HashtagsScreen = () => {
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
      <View style={styles.modalOverlay}>
        <View style={styles.upgradeModal}>
          <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
          <Text style={styles.upgradeDescription}>
            Get access to all trending hashtags and unlock premium features!
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
      <TableHeader />
      <FlatList
        data={hashtags.slice(0, MAX_HASHTAGS)}
        renderItem={renderHashtag}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadHashtags}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No hashtags found</Text>
            <Text style={styles.footerText}>
              Unlock more trending hashtags with our premium subscription!
            </Text>
          </View>
        }
        ListFooterComponent={hashtags.length > 0 ? <FooterMessage /> : null}
      />
      {renderUpgradeModal()}
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  hashtagInfo: {
    flex: 1,
    marginLeft: 16,
  },
  hashtagName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF2D55',
  },
  statsValue: {
    width: 80,
    alignItems: 'flex-end',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
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
  lockedItem: {
    opacity: 0.8,
  },
  lockIconContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 1,
  },
  lockIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 4,
  },
  fadeIn: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  hashtagGradient: {
    ...StyleSheet.absoluteFillObject,
  },
}); 