import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CountryDropdown } from './CountryDropdown';
import { TimeRangeBox } from './TimeRangeBox';

export const AppLayout = ({ 
  children, 
  selectedCountry, 
  onSelectCountry,
  extraFilters,
  rightControl,
  onPremiumPress,
  type,
  showTitle = false,
  showFilters = true
}) => {
  return (
    <View style={styles.container}>
      {showTitle && (
        <View style={styles.header}>
          <Text style={styles.appTitle}>Trendify</Text>
        </View>
      )}

      {showFilters && (
        <View style={styles.filters}>
          <View style={styles.filtersRow}>
            <View style={styles.leftControls}>
              <CountryDropdown
                selectedCountry={selectedCountry}
                onSelect={onSelectCountry}
                onPremiumPress={onPremiumPress}
                type={type}
              />
              <View style={styles.filterSpacing} />
              {extraFilters}
              <View style={styles.filterSpacing} />
              <TimeRangeBox />
            </View>
            {rightControl && (
              <View style={styles.rightControl}>
                {rightControl}
              </View>
            )}
          </View>
        </View>
      )}

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  filters: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 2,
  },
  filtersRow: {
    marginHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightControl: {
    height: 32,
  },
  filterSpacing: {
    width: 8,
  },
  content: {
    flex: 1,
  },
  toggleButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  toggleText: {
    fontSize: 16,
    color: '#007AFF',
  },
}); 