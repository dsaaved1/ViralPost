import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const SettingsScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  const SettingItem = ({ icon, title, value, onValueChange, type = 'toggle' }) => (
    <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={theme.accent} style={styles.settingIcon} />
        <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
      </View>
      {type === 'toggle' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: theme.accent }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Appearance</Text>
        <SettingItem
          icon="moon"
          title="Dark Mode"
          value={isDark}
          onValueChange={toggleTheme}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Account</Text>
        <SettingItem
          icon="person"
          title="Profile"
          type="button"
        />
        <SettingItem
          icon="notifications"
          title="Notifications"
          type="button"
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Premium</Text>
        <SettingItem
          icon="star"
          title="Subscription"
          type="button"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
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
}); 