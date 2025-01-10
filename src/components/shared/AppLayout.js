import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CountryDropdown } from './CountryDropdown';
import { useTheme } from '../../context/ThemeContext';
import { IndustryDropdown } from './IndustryDropdown';

export const AppLayout = ({ 
  children, 
  selectedCountry, 
  onSelectCountry,
  selectedIndustry,
  onSelectIndustry,
  extraFilters,
  rightControl,
  onPremiumPress,
  type,
  isIndustryMode,
  showTitle = false,
  showFilters = true
}) => {
  const { theme } = useTheme();

  const renderFilters = () => {
    if (type === 'hashtags') {
      return (
        <>
          <View style={[styles.filterBox, !isIndustryMode && styles.activeFilter]}>
            <Text style={[styles.filterTitle, { 
              color: theme.textSecondary,
              opacity: isIndustryMode ? 0.5 : 1
            }]}>
              Country
            </Text>
            <CountryDropdown
              selectedCountry={selectedCountry}
              onSelect={onSelectCountry}
              onPremiumPress={onPremiumPress}
              type={type}
              disabled={isIndustryMode}
              containerStyle={[
                styles.dropdown, 
                { backgroundColor: theme.surface },
                isIndustryMode && styles.disabledDropdown
              ]}
            />
          </View>
          <View style={styles.filterSpacing} />
          <View style={[styles.filterBox, isIndustryMode && styles.activeFilter]}>
            <Text style={[styles.filterTitle, { 
              color: theme.textSecondary,
              opacity: !isIndustryMode ? 0.5 : 1
            }]}>
              Industry
            </Text>
            <IndustryDropdown
              selectedIndustry={selectedIndustry}
              onSelect={onSelectIndustry}
              disabled={!isIndustryMode}
              containerStyle={[
                styles.dropdown, 
                { backgroundColor: theme.surface },
                !isIndustryMode && styles.disabledDropdown
              ]}
            />
          </View>
        </>
      );
    }

    return (
      <>
        <View style={styles.filterBox}>
          <Text style={[styles.filterTitle, { color: theme.textSecondary }]}>
            Country
          </Text>
          <CountryDropdown
            selectedCountry={selectedCountry}
            onSelect={onSelectCountry}
            onPremiumPress={onPremiumPress}
            type={type}
            containerStyle={[styles.dropdown, { backgroundColor: theme.surface }]}
          />
        </View>
        {type === 'videos' && extraFilters && (
          <>
            <View style={styles.filterSpacing} />
            <View style={styles.filterBox}>
              <Text style={[styles.filterTitle, { color: theme.textSecondary }]}>
                Sort by
              </Text>
              {extraFilters}
            </View>
          </>
        )}
      </>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {showTitle && (
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <Text style={[styles.appTitle, { color: theme.accent }]}>Trendify</Text>
        </View>
      )}

      {showFilters && (
        <View style={[styles.filterContainer, { backgroundColor: theme.background }]}>
          <View style={styles.filtersRow}>
            <View style={styles.leftControls}>
              {renderFilters()}
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
    padding: 8,
    paddingBottom: 4,
    zIndex: 2,
    marginTop: 8,
  },
  filtersRow: {
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
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
    height: 36,
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    marginLeft: 4,
  },
  filterBox: {
    height: 48,
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  activeFilter: {
    opacity: 1,
  },
  disabledDropdown: {
    opacity: 0.5,
  },
}); 