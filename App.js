import React, { useState, useEffect } from 'react';
import { Platform, TouchableOpacity, Modal, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from './src/screens/HomeScreen';
import { SavedScreen } from './src/screens/SavedScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { HashtagsScreen } from './src/screens/HashtagsScreen';
import { SongsScreen } from './src/screens/SongsScreen';
import { VideosScreen } from './src/screens/VideosScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from './src/services/notificationService';
import { WelcomeScreen } from './src/screens/onboarding/WelcomeScreen';
import { OnboardingScreen } from './src/screens/onboarding/OnboardingScreen';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Saved') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingTop: 0,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.background,
          borderBottomColor: theme.border,
          borderBottomWidth: 1,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          color: theme.text,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Saved" 
        component={SavedScreen}
        options={{ 
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
};

const InfoModal = ({ visible, onClose, theme }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>About Our Data</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.modalText, { color: theme.textSecondary }]}>
           We aggregate data daily using powerful Tiktok data extractors and directly from TikTok Creative Center.
          </Text>
          <Text style={[styles.modalText, { color: theme.textSecondary }]}>
            Metrics (posts, views, and rank) represent usage from the last 7 days.
          </Text>
          {/* <Text style={[styles.modalText, { color: theme.textSecondary }]}>
          Our goal is to deliver accurate and reliable insights 
            Our goal is to provide accurate insights, but numbers are approximate and updated constantly. 
          </Text> */}
        </View>
      </View>
    </Modal>
  );
};

const AppNavigator = () => {
  const { theme } = useTheme();
  const [showInfoModal, setShowInfoModal] = useState(false);

  const renderInfoButton = () => (
    <TouchableOpacity 
      onPress={() => setShowInfoModal(true)}
      style={{ marginRight: 16 }}
    >
      <Ionicons 
        name="information-circle-outline" 
        size={22}
        color={theme.textSecondary}
      />
    </TouchableOpacity>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
            borderBottomWidth: 1,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            color: theme.text,
          },
        }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Hashtags" 
          component={HashtagsScreen}
          options={{
            title: 'Hashtags',
            headerRight: renderInfoButton
          }}
        />
        <Stack.Screen 
          name="Songs" 
          component={SongsScreen}
          options={{ 
            headerTitle: 'Songs',
            headerBackTitle: 'Back',
            headerRight: renderInfoButton
          }}
        />
        <Stack.Screen 
          name="Videos" 
          component={VideosScreen}
          options={{ 
            headerTitle: 'Videos',
            headerBackTitle: 'Back',
            headerRight: renderInfoButton
          }}
        />
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <InfoModal 
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        theme={theme}
      />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  modalText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
});

const App = () => {
  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('@has_launched');
      if (!hasLaunched) {
        // First launch - request permissions
        await notificationService.requestPermissions();
        await AsyncStorage.setItem('@has_launched', 'true');
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  return (
    <>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
      <Toast />
    </>
  );
};

export default App;
