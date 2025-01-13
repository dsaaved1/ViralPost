import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { API_ENDPOINTS } from '../../services/apifyService';
import { useTheme } from '../../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

// All possible countries with their availability per tab
const ALL_COUNTRIES = [
  // Free Tier (6 countries)
  { id: 'US', name: 'United States' },
  { id: 'GB', name: 'United Kingdom' },
  { id: 'BR', name: 'Brazil' },
  { id: 'FR', name: 'France' },
  { id: 'JP', name: 'Japan' },
  { id: 'MX', name: 'Mexico', availableIn: ['hashtags', 'songs'] },

  // Premium Tier (9 countries)
  { id: 'CA', name: 'Canada', premium: true  },
  { id: 'AU', name: 'Australia', premium: true },
  { id: 'DE', name: 'Germany',  premium: true },
  { id: 'KR', name: 'South Korea',  premium: true },
  { id: 'ID', name: 'Indonesia',  premium: true },
  { id: 'NG', name: 'Nigeria',  availableIn: ['hashtags', 'songs'], premium: true },
  { id: 'PH', name: 'Philippines',  premium: true },
  // { id: 'IT', name: 'Italy', premium: true  },
  // { id: 'ES', name: 'Spain', premium: true  },
];

export const COUNTRIES = {
  hashtags: ALL_COUNTRIES,
  songs: ALL_COUNTRIES,
  videos: ALL_COUNTRIES
};

const INDUSTRY_OPTIONS = [
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'travel', name: 'Travel' },
  { id: 'tech', name: 'Tech & Electronics' },
  { id: 'health', name: 'Health' },
  { id: 'games', name: 'Games' },
  { id: 'education', name: 'Education' },
  { id: 'beauty', name: 'Beauty & Personal Care' },
];

export const CountryDropdown = ({ 
  selectedCountry, 
  onSelect, 
  containerStyle,
  onPremiumPress,
  type,
  isIndustryMode,
  disabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  // Use the correct options list based on mode
  const options = isIndustryMode ? INDUSTRY_OPTIONS : ALL_COUNTRIES;
  
  // Set default selection if none exists
  useEffect(() => {
    if (isIndustryMode && !INDUSTRY_OPTIONS.find(opt => opt.id === selectedCountry)) {
      onSelect('entertainment');
    } else if (!isIndustryMode && !ALL_COUNTRIES.find(c => c.id === selectedCountry)) {
      onSelect('US');
    }
  }, [isIndustryMode]);

  const selectedOption = isIndustryMode 
    ? INDUSTRY_OPTIONS.find(opt => opt.id === selectedCountry) || INDUSTRY_OPTIONS[0]
    : ALL_COUNTRIES.find(c => c.id === selectedCountry) || ALL_COUNTRIES[0];

  const isPremium = (country) => {
    if (isIndustryMode) return false; // No premium options in industry mode
    
    // If country is marked as premium, it's premium in all tabs
    if (country.premium) return true;
    
    // If country has availableIn array and current type is not in it, it's premium
    if (country.availableIn && !country.availableIn.includes(type)) return true;
    
    // Otherwise it's not premium (like US and BR)
    return false;
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity 
        style={[
          styles.dropdownButton,
          { 
            backgroundColor: theme.surface,
            borderColor: theme.border 
          },
          containerStyle,
          disabled && styles.disabled
        ]}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Text style={[
          styles.dropdownButtonText,
          { 
            color: theme.text,
            opacity: disabled ? 0.5 : 0.9 
          }
        ]}>
          {selectedOption?.name}
        </Text>
        <Text style={[styles.dropdownIcon, isOpen && styles.dropdownIconOpen]}>▼</Text>
      </TouchableOpacity>

      {isOpen && (
        <ScrollView style={[
          styles.dropdownList,
          { 
            backgroundColor: theme.surface,
            borderColor: theme.border 
          }
        ]}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.dropdownItem,
                { borderBottomColor: theme.border }
              ]}
              onPress={() => {
                if (isPremium(option)) {
                  onPremiumPress();
                } else {
                  onSelect(option.id);
                }
                setIsOpen(false);
              }}
            >
              <Text style={[
                styles.dropdownItemText,
                { color: theme.text },
                option.id === selectedCountry && styles.selectedCountry,
                isPremium(option) && styles.blurredText
              ]}>
                {option.name}
              </Text>
              {isPremium(option) && (
                <Ionicons 
                  name="lock-closed" 
                  size={16} 
                  color={theme.textSecondary} 
                  style={styles.blurredText} 
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
    width: 150,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    width: 150,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 14,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    transform: [{ rotate: '0deg' }],
  },
  dropdownIconOpen: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    width: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'scroll',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownItemText: {
    fontSize: 14,
    flex: 1,
  },
  selectedCountry: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  blurredText: {
    opacity: 0.4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  viewToggle: {
    padding: 4,
    marginLeft: 4,
  }
}); 