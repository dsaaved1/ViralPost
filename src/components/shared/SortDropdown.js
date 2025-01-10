import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const SORT_OPTIONS = [
  { id: 'hot', name: 'Hot' },
  { id: 'likes', name: 'Likes', premium: true },
  { id: 'comments', name: 'Comments', premium: true },
  { id: 'shares', name: 'Shares', premium: true },
];

export const SortDropdown = ({ selectedSort, onSelect, onPremiumPress, containerStyle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity 
        style={[
          styles.dropdownButton,
          { backgroundColor: theme.surface },
          containerStyle
        ]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={[styles.dropdownButtonText, { color: theme.text }]}>
          {selectedSort === 'hot' ? 'Hot' : selectedSort}
        </Text>
        <Text style={[styles.dropdownIcon, isOpen && styles.dropdownIconOpen]}>▼</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={[styles.dropdownList, { backgroundColor: theme.surface }]}>
          {SORT_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.dropdownItem, { borderBottomColor: theme.border }]}
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
                { color: theme.text },
                item.id === selectedSort && styles.selectedSort,
                item.premium && styles.blurredText
              ]}>
                {item.name}
              </Text>
              {item.premium && (
                <Ionicons name="lock-closed" size={16} color={theme.textSecondary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
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
    height: 36,
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
    height: 36,
    width: 150,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
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