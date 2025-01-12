import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const INDUSTRY_OPTIONS = [
  { id: 'apparel', name: 'Apparel & Access' },
  { id: 'beauty', name: 'Beauty & Personal Care' },
  { id: 'education', name: 'Education' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'financial', name: 'Financial Services' },
  { id: 'food', name: 'Food & Beverage' },
  { id: 'games', name: 'Games' },
  { id: 'sports', name: 'Sports & Outdoors' },
  { id: 'tech', name: 'Tech & Electronics' },
  { id: 'travel', name: 'Travel' },
  { id: 'vehicle', name: 'Vehicle & Transportation' },
];

export const IndustryDropdown = ({ selectedIndustry, onSelect, containerStyle, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const selectedOption = INDUSTRY_OPTIONS.find(opt => opt.id === selectedIndustry) || INDUSTRY_OPTIONS[0];

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
          {INDUSTRY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.dropdownItem,
                { borderBottomColor: theme.border }
              ]}
              onPress={() => {
                onSelect(option.id);
                setIsOpen(false);
              }}
            >
              <Text style={[
                styles.dropdownItemText,
                { color: theme.text },
                option.id === selectedIndustry && styles.selectedIndustry
              ]}>
                {option.name}
              </Text>
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
  selectedIndustry: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
}); 