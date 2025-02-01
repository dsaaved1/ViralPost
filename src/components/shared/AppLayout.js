import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { CountryDropdown } from './CountryDropdown';
import { useTheme } from '../../context/ThemeContext';
import { IndustryDropdown } from './IndustryDropdown';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { SortDropdown } from './SortDropdown';
import { FilterModal } from './FilterModal';

export const AppLayout = ({ 
  children,
  showFilters = true,
  type,
  selectedCountry,
  onSelectCountry,
  selectedIndustry,
  onSelectIndustry,
  extraFilters,
  rightControl,
  onPremiumPress,
  isIndustryMode,
  showTitle = false,
}) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { theme } = useTheme();

  const renderFilters = () => {
    if (type === 'hashtags') {
      return (
        <View style={styles.filtersRow}>
          <View style={styles.leftControls}>
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
                opacity: isIndustryMode ? 1 : 0.5
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
          </View>
          {rightControl && (
            <View style={styles.rightControls}>
              {rightControl}
            </View>
          )}
        </View>
      );
    }

    return (
      <View style={styles.filtersRow}>
        <View style={styles.leftControls}>
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
        </View>
        {rightControl && (
          <View style={styles.rightControls}>
            {rightControl}
          </View>
        )}
      </View>
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
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: theme.surface }]}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="funnel-outline" size={20} color={theme.text} />
            <Text style={[styles.filterButtonText, { color: theme.text }]}>
              Filters
            </Text>
          </TouchableOpacity>
          {rightControl && (
            <View style={styles.rightControls}>
              {rightControl}
            </View>
          )}
        </View>
      )}

      <View style={styles.content}>
        {children}
      </View>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={() => {}}
        selectedCountry={selectedCountry}
        selectedIndustry={selectedIndustry}
        onSelectCountry={onSelectCountry}
        onSelectIndustry={onSelectIndustry}
        type={type}
        showIndustry={type === 'hashtags'}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
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
  filterSpacing: {
    width: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoButton: {
    padding: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 