import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CountryDropdown } from './CountryDropdown';
import { TimeRangeBox } from './TimeRangeBox';
import { useTheme } from '../../context/ThemeContext';

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
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {showTitle && (
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <Text style={[styles.appTitle, { color: theme.accent }]}>Trendify</Text>
        </View>
      )}

      {showFilters && (
        <View style={[
          styles.filterContainer, 
          { 
            backgroundColor: theme.background,
            borderBottomColor: theme.border
          }
        ]}>
          <View style={styles.filtersRow}>
            <View style={styles.leftControls}>
              <CountryDropdown
                selectedCountry={selectedCountry}
                onSelect={onSelectCountry}
                onPremiumPress={onPremiumPress}
                type={type}
                containerStyle={[styles.dropdown, { backgroundColor: theme.surface }]}
              />
              <View style={styles.filterSpacing} />
              {extraFilters}
              <View style={styles.filterSpacing} />
              <TimeRangeBox style={{ backgroundColor: theme.surface }} />
            </View>
            {rightControl && (
              <View style={styles.rightControl}>
                {rightControl}
              </View>
            )}
          </View>
        </View>
      )}

      <View style={[styles.content, { backgroundColor: theme.background }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
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
  },
  filterContainer: {
    padding: 16,
    borderBottomWidth: 1,
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
  dropdown: {
    width: '100%',
    padding: 8,
    borderRadius: 8,
  },
}); 