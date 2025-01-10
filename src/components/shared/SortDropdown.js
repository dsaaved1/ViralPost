import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

export const SORT_OPTIONS = [
  { id: 'hot', name: 'Hot' },
  { id: 'likes', name: 'Likes', premium: true },
  { id: 'comments', name: 'Comments', premium: true },
  { id: 'shares', name: 'Shares', premium: true },
];

export const SortDropdown = ({ selectedSort, onSelect, onPremiumPress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedSortName = SORT_OPTIONS.find(s => s.id === selectedSort)?.name || 'Sort By';

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity 
        style={styles.dropdownButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.dropdownButtonText}>{selectedSortName}</Text>
        <Text style={[styles.dropdownIcon, isOpen && styles.dropdownIconOpen]}>▼</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownListContainer}>
          <ScrollView 
            style={styles.dropdownList}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            {SORT_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.dropdownItem}
                onPress={() => {
                  if (item.premium) {
                    onPremiumPress();
                  } else {
                    onSelect(item.id);
                  }
                  setIsOpen(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  item.id === selectedSort && styles.selectedSort,
                  item.premium && styles.blurredText
                ]}>
                  {item.name}
                </Text>
                {item.premium && (
                  <Text style={[styles.lockIcon, styles.blurredText]}>🔒</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
    minWidth: 120,
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
    minWidth: 120,
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
    width: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  selectedSort: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  container: {
    minWidth: 120,
    height: 32,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  dropdownListContainer: {
    position: 'relative',
  },
  lockIcon: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
  },
  blurredText: {
    opacity: 0.3,
  },
}); 