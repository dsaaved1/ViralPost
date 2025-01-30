import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Share, Linking, Platform, SafeAreaView, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { notificationService } from '../services/notificationService';

import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import Purchases from 'react-native-purchases';

export const SettingsScreen = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [notifications, setNotifications] = useState(false);
  const [isPro, setIsPro] = useState(false);


  // Check subscription status on mount
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

  const proAction = async () => {
    try {
     if (isPro){
      Alert.alert('User has access.')
     } else {
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
        console.error("Error inside proAction:", error);
      }
     }
    } catch (error) {
      console.error("Error in proAction:", error);
    }
  };

  const SECTIONS = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'darkMode',
          title: 'Dark Mode',
          icon: 'moon',
          type: 'toggle'
        },
        {
          id: 'notifications',
          title: 'Notifications',
          icon: 'notifications',
          type: 'link'
        }
      ]
    },
    // {
    //   title: 'Notifications',
    //   items: [
    //     {
    //       id: 'trendAlerts',
    //       title: 'Trend Alerts',
    //       icon: 'notifications',
    //       type: 'toggle'
    //     }
    //   ]
    // },
    {
      title: 'Connect & Premium',
      items: [
        {
          id: 'subscription',
          title: 'Subscription',
          icon: 'pricetag',
          type: 'link',
        },
        // {
        //   id: 'freeMonth',
        //   title: 'Earn a Free Month',
        //   icon: 'gift',
        //   type: 'link'
        // },
        {
          id: 'shareApp',
          title: 'Share App',
          icon: 'share',
          type: 'button'
        },
        {
          id: 'rateUs',
          title: 'Rate Us',
          icon: 'heart',
          type: 'link'
        }
      ]
    },
    {
      title: 'Contact & Info',
      items: [
        {
          id: 'contact',
          title: 'Contact Us',
          icon: 'mail',
          type: 'link'
        },
        
        // {
        //   id: 'terms',
        //   title: 'Terms of Use',
        //   icon: 'document-text',
        //   type: 'link'
        // },
        // {
        //   id: 'privacy',
        //   title: 'Privacy Policy',
        //   icon: 'shield-checkmark',
        //   type: 'link'
        // }
      ]
    }
  ];

  // Load notification status on mount
  useEffect(() => {
    loadNotificationStatus();
  }, []);

  const loadNotificationStatus = async () => {
    const status = await notificationService.getNotificationStatus();
    setNotifications(status);
  };

  const handleNotificationToggle = async () => {
    try {
      const success = await notificationService.toggleNotifications(!notifications);
      if (success) {
        if (!notifications) {
          // Turning notifications ON
          setNotifications(true);
        } else {
          // Turning notifications OFF
          // This will cancel all scheduled notifications
          await notificationService.syncNotificationState(false);
          setNotifications(false);
        }
      }
    } catch (error) {
      console.error('Error handling notifications:', error);
    }
  };

  const handlePress = async (item) => {
    switch (item.id) {
      case 'contact':
        const email = 'hello@viralpostapp.com'; // Your support email
        const subject = 'ViralPost Support';
        const mailtoUrl = Platform.select({
          ios: `mailto:${email}?subject=${encodeURIComponent(subject)}`,
          android: `mailto:${email}?subject=${encodeURIComponent(subject)}`
        });
        
        try {
          const canOpen = await Linking.canOpenURL(mailtoUrl);
          if (canOpen) {
            await Linking.openURL(mailtoUrl);
          } else {
            Alert.alert(
              'No Email App',
              'Please make sure you have an email app installed.',
              [{ text: 'OK' }]
            );
          }
        } catch (error) {
          console.error('Error opening email:', error);
        }
      break;

      case 'subscription':
        try {
          proAction()
        } catch (error) {
          console.error('Error subscribing:', error);
        }
      break;

      case 'shareApp':
        try {
          const appStoreId = 'id6741085606'; // Your current App Store ID
          const androidPackageName = 'com.diegoas2.viralpost'; // Android package name

          const result = await Share.share({
            message: Platform.select({
              ios: `Check out this awesome app for content creators! https://apps.apple.com/app/${appStoreId}`,
              android: `Check out this awesome app for content creators! https://play.google.com/store/apps/details?id=${androidPackageName}`
            }),
            url: `https://apps.apple.com/app/${appStoreId}`, // iOS only
            title: 'Share ViralPost'
          });

          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
              console.log('Shared with activity type:', result.activityType);
            } else {
              // shared
              console.log('Shared');
            }
          }
        } catch (error) {
          console.error('Error sharing:', error);
        }
        break;

      case 'rateUs':
        const appStoreId = 'id6741085606'; // Your App Store ID from App Store Connect
        const androidPackageName = 'com.diegoas2.viralpost'; // Your Android package name

        const storeUrl = Platform.select({
          ios: `https://apps.apple.com/app/${appStoreId}`,
          android: `market://details?id=${androidPackageName}` // Direct link for Play Store
        });

        try {
          const canOpen = await Linking.canOpenURL(storeUrl);
          if (canOpen) {
            await Linking.openURL(storeUrl);
          } else {
            // Fallback URLs in case the direct market URL fails
            const fallbackUrl = Platform.select({
              ios: `https://apps.apple.com/app/${appStoreId}`,
              android: `https://play.google.com/store/apps/details?id=${androidPackageName}`
            });
            await Linking.openURL(fallbackUrl);
          }
        } catch (error) {
          console.error('Error opening store:', error);
        }
        break;

      case 'notifications':
        if (Platform.OS === 'ios') {
          Linking.openURL('app-settings:');
        } else {
          Linking.openSettings();
        }
        break;
    }
  };

  const renderItem = (item) => {

    if (item.type === 'toggle') {
      return (
        <Switch
          value={item.id === 'darkMode' ? isDark : false}
          onValueChange={item.id === 'darkMode' ? toggleTheme : null}
          trackColor={{ false: '#767577', true: '#FF2D55' }}
          thumbColor={'#fff'}
          style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
        />
      );
    }
    return (
      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.textSecondary}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        </View>

        <View style={styles.content}>
          {SECTIONS.map((section, index) => (
            <View key={section.title} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                {section.title}
              </Text>
              {section.items.map((item, itemIndex) => (
                item.type === 'toggle' ? (
                  <View
                    key={item.id}
                    style={[
                      styles.settingItem,
                      { borderBottomColor: theme.border },
                      itemIndex === section.items.length - 1 && styles.lastRow
                    ]}
                  >
                    <View style={styles.settingLeft}>
                      <Ionicons 
                        name={item.icon} 
                        size={24} 
                        color="#FF2D55" 
                        style={styles.settingIcon} 
                      />
                      <Text style={[styles.settingTitle, { color: theme.text }]}>
                        {item.title}
                      </Text>
                    </View>
                    {renderItem(item)}
                  </View>
                ) : (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.settingItem,
                      { borderBottomColor: theme.border },
                      itemIndex === section.items.length - 1 && styles.lastRow
                    ]}
                    onPress={() => handlePress(item)}
                  >
                    <View style={styles.settingLeft}>
                      <Ionicons 
                        name={item.icon} 
                        size={24} 
                        color="#FF2D55" 
                        style={styles.settingIcon} 
                      />
                      <Text style={[styles.settingTitle, { color: theme.text }]}>
                        {item.title}
                      </Text>
                    </View>
                    {renderItem(item)}
                  </TouchableOpacity>
                )
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          {/* <View style={styles.socialIcons}>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="logo-tiktok" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="logo-instagram" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="logo-twitter" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View> */}
          <Text style={[styles.version, { color: theme.textSecondary }]}>
            Version 1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  socialIcon: {
    marginHorizontal: 12,
    padding: 8,
  },
  version: {
    fontSize: 12,
    opacity: 0.7,
  },
}); 