import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { API_ENDPOINTS } from '../../services/apifyService';

// All possible countries with their availability per tab
const ALL_COUNTRIES = [
  { id: 'US', name: 'United States' },
  { id: 'BR', name: 'Brazil' },
  { id: 'MX', name: 'Mexico', availableIn: ['hashtags', 'songs'] },
  { id: 'ID', name: 'Indonesia', availableIn: ['hashtags'] },
  { id: 'IT', name: 'Italy', premium: true },
  { id: 'ES', name: 'Spain', premium: true },
  { id: 'JP', name: 'Japan', premium: true },
  { id: 'KR', name: 'South Korea', premium: true }
];

export const COUNTRIES = {
  hashtags: ALL_COUNTRIES,
  songs: ALL_COUNTRIES,
  videos: ALL_COUNTRIES
};

export const CountryDropdown = ({ selectedCountry, onSelect, onPremiumPress, type = 'hashtags' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const availableCountries = COUNTRIES[type];
  const selectedCountryName = availableCountries.find(c => c.id === selectedCountry)?.name;

  const isPremium = (country) => {
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
        style={styles.dropdownButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.dropdownButtonText}>{selectedCountryName}</Text>
        <Text style={[styles.dropdownIcon, isOpen && styles.dropdownIconOpen]}>▼</Text>
      </TouchableOpacity>

      {isOpen && (
        <ScrollView style={styles.dropdownList}>
          {availableCountries.map((country) => (
            <TouchableOpacity
              key={country.id}
              style={styles.dropdownItem}
              onPress={() => {
                if (isPremium(country)) {
                  onPremiumPress();
                } else {
                  onSelect(country.id);
                }
                setIsOpen(false);
              }}
            >
              <Text style={[
                styles.dropdownItemText,
                country.id === selectedCountry && styles.selectedCountry,
                isPremium(country) && styles.blurredText
              ]}>
                {country.name}
              </Text>
              {isPremium(country) && (
                <Text style={[styles.lockIcon, styles.blurredText]}>🔒</Text>
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
    backgroundColor: '#f8f8f8',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width: 150,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
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
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  selectedCountry: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  blurredText: {
    color: '#999',
  },
  lockIcon: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
}); 