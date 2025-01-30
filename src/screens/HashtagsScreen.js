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
import { FooterMessage } from '../components/shared/FooterMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageService } from '../services/storageService';

import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import Purchases from 'react-native-purchases';

const formatNumber = (num) => {
  if (num === undefined || num === null) {
    return '0';
  }

  const number = Number(num);

  if (isNaN(number)) {
    return '0';
  }

  if (number >= 1000000) {
    return `${Math.round(number / 1000000)}M`;
  }
  if (number >= 1000) {
    return `${Math.round(number / 1000)}K`;
  }

  return number.toString();
};

export const HashtagsScreen = () => {
  const { theme } = useTheme();

  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedIndustry, setSelectedIndustry] = useState('entertainment');

  const [isGlobalView, setIsGlobalView] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const [recentlySaved, setRecentlySaved] = useState(null);
  const [savedHashtags, setSavedHashtags] = useState(new Set());

  const MAX_HASHTAGS = isPro? 100: 15;
  const FREE_HASHTAGS = 10;

  const MAX_INDUSTRY_HASHTAGS = isPro? 100: 15;
  const FREE_INDUSTRY_HASHTAGS = 10;

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      // Check if user has 'pro' entitlement
      const isPremium = customerInfo?.entitlements?.active?.['pro']?.isActive ?? false;
      setIsPro(isPremium);
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsPro(false);
    }
  };

  useEffect(() => {
    loadSavedHashtags();
    fetchHashtags();
  }, [selectedCountry, isGlobalView, selectedIndustry]);

  const fetchHashtags = async () => {
    setLoading(true);
    try {
      const data = await api.getTopHashtags(selectedCountry, isGlobalView, selectedIndustry);
      setHashtags(data);
    } catch (error) {
      console.error('Error fetching hashtags:', error);
      setHashtags([]);
    } finally {
      setLoading(false);
    }
  };


  const handleModeSwitch = () => {
    setIsGlobalView(!isGlobalView);
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



  const loadSavedHashtags = async () => {
    try {
      const saved = await storageService.getSavedItems();
      const hashtagIds = new Set(saved.unscheduled
        .filter(item => item.type === 'hashtag')
        .map(item => item.id));
      setSavedHashtags(hashtagIds);
    } catch (error) {
      console.error('Error loading saved hashtags:', error);
    }
  };


  const handleSaveHashtag = async (hashtag) => {
    try {
      const saved = await storageService.getSavedItems();
      const newSaved = { ...saved };
      
      if (savedHashtags.has(hashtag.id)) {
        // Remove hashtag
        await storageService.removeHashtag(hashtag.id);
        setSavedHashtags(prev => {
          const newSet = new Set(prev);
          newSet.delete(hashtag.id);
          return newSet;
        });
      } else {
        // Add hashtag
        const savedHashtag = {
          id: hashtag.id,
          type: 'hashtag',
          name: hashtag.name,
          createdAt: new Date().toISOString()
        };
        await storageService.saveHashtag(savedHashtag);
        setSavedHashtags(prev => {
          const newSet = new Set(prev);
          newSet.add(hashtag.id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error saving hashtag:', error);
    }
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
        <Text style={[styles.headerText, { color: theme.textSecondary }]}>Hashtags</Text>
      </View>
      <View style={styles.statsHeader}>
        <Text style={[styles.headerText, { color: theme.textSecondary }]}>Posts</Text>
      </View>
      {!isGlobalView && (
        <View style={styles.statsHeader}>
          <Text style={[styles.headerText, { color: theme.textSecondary }]}>Views</Text>
        </View>
      )}
    </View>
  );

  const HashtagItem = ({ item }) => {
    const { theme } = useTheme();
    const isRecentlySaved = recentlySaved === item.id;
    const isSaved = savedHashtags.has(item.id);
    
    return (
      <View style={[styles.hashtagItem, { 
        backgroundColor: theme.cardBackground,
        shadowColor: theme.text,
      }]}>
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
          <TouchableOpacity 
            onPress={() => Linking.openURL(`https://www.tiktok.com/tag/${item.name}`)}
          >
            <Text style={[styles.hashtagName, { 
              color: theme.isDark ? '#FFFFFF' : theme.accent
            }]}>#{item.name}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsValue}>
          <Text style={[styles.statsText, { color: theme.textSecondary }]}>
            {formatNumber(item?.posts)}
          </Text>
        </View>
        {!isGlobalView && (
          <View style={styles.statsValue}>
            <Text style={[styles.statsText, { color: theme.textSecondary }]}>
              {formatNumber(item?.views)}
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.cornerSaveButton}
          onPress={() => handleSaveHashtag(item)}
        >
          <Ionicons 
            name={isSaved ? "heart" : "heart-outline"}
            size={14} 
            color={isSaved ? "#FF4B4B" : theme.textSecondary}
          />
        </TouchableOpacity>
      </View>
    );
  };

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
        <View style={[styles.lockOverlay, { backgroundColor: theme.surface }]} />
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
          <Text style={[styles.hashtagName, { color: theme.textSecondary, opacity: 0.4 }]}>
            #{truncateText(item.name, 4)}
          </Text>
        </View>
        <View style={styles.statsValue}>
          <Text style={[styles.statsText, { color: theme.textSecondary, opacity: 0.4 }]}>
            {formatNumber(item?.posts)}
          </Text>
        </View>
        {!isGlobalView && (
          <View style={styles.statsValue}>
            <Text style={[styles.statsText, { color: theme.textSecondary, opacity: 0.4 }]}>
              {formatNumber(item?.views)}
            </Text>
          </View>
        )}
        <View style={styles.lockOverlay}>
          <Ionicons 
            name="lock-closed" 
            size={20} 
            color={theme.textSecondary} 
            style={{ opacity: 0.6 }} 
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHashtag = ({ item, index }) => {
    // If the user is Pro, show all hashtags unlocked
    if (isPro) {
      return <HashtagItem item={item} />;
    }

    const maxItems = isGlobalView ? MAX_INDUSTRY_HASHTAGS : MAX_HASHTAGS;
    const freeItems = isGlobalView ? FREE_INDUSTRY_HASHTAGS : FREE_HASHTAGS;

    if (index < freeItems) {
      return <HashtagItem item={item} />;
    }
    
    if (index >= maxItems) {
      return null;
    }
    
    return <LockedHashtagItem item={item} onPress={proAction} />;
  };


  if (loading) {
    return (
      <AppLayout 
        selectedCountry={selectedCountry} 
        onSelectCountry={setSelectedCountry}
        selectedIndustry={selectedIndustry}
        onSelectIndustry={setSelectedIndustry}
        onPremiumPress={proAction}
        type="hashtags"
        isIndustryMode={isGlobalView}
        rightControl={
          <TouchableOpacity 
            style={styles.viewToggle}
            onPress={handleModeSwitch}
          >
            <Ionicons 
              name={isGlobalView ? "earth" : "location-outline"}
              size={20} 
              color={theme.accent}
            />
          </TouchableOpacity>
        }
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
      selectedIndustry={selectedIndustry}
      onSelectIndustry={setSelectedIndustry}
      onPremiumPress={proAction}
      type="hashtags"
      isIndustryMode={isGlobalView}
      rightControl={
        <TouchableOpacity 
          style={styles.viewToggle}
          onPress={handleModeSwitch}
        >
          <Ionicons 
            name={isGlobalView ? "earth" : "location-outline"}
            size={20} 
            color={theme.accent}
          />
        </TouchableOpacity>
      }
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <FlatList
          data={hashtags.slice(0, isGlobalView ? MAX_INDUSTRY_HASHTAGS : MAX_HASHTAGS)}
          renderItem={renderHashtag}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          onRefresh={fetchHashtags}
          ListHeaderComponent={<TableHeader />}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No hashtags found
              </Text>
            </View>
          }
          ListFooterComponent={hashtags.length > 0 && !isPro ? <FooterMessage isIndustryView={isGlobalView} type="hashtags" /> : null}
          style={{ backgroundColor: theme.background }}
          contentContainerStyle={styles.listContentContainer}
        />
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
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
    marginRight: 8,
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
    paddingBottom: 20,
  },
  viewToggle: {
    padding: 4,
  },
  cornerSaveButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 4,
  },
  saveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
}); 