import React from 'react';
import { Platform } from 'react-native';
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
        options={{ headerTitle: 'Saved' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ headerTitle: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

// Create a new component to wrap the navigation with theme
const AppNavigator = () => {
  const { theme } = useTheme();

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
          name="MainTabs" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Hashtags" 
          component={HashtagsScreen}
          options={{ 
            headerTitle: 'Hashtags',
            headerBackTitle: 'Back'
          }}
        />
        <Stack.Screen 
          name="Songs" 
          component={SongsScreen}
          options={{ 
            headerTitle: 'Songs',
            headerBackTitle: 'Back'
          }}
        />
        <Stack.Screen 
          name="Videos" 
          component={VideosScreen}
          options={{ 
            headerTitle: 'Videos',
            headerBackTitle: 'Back'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
};

export default App;
