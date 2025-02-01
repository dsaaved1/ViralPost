import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export const CustomHeader = ({ 
  title, 
  onBack, 
  onFilter,
  rightControl,
}) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: theme.background }}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity 
          onPress={onBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

        <View style={styles.rightControls}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={onFilter}
          >
            <Ionicons name="filter" size={24} color={theme.text} />
          </TouchableOpacity>
          {rightControl}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  filterButton: {
    padding: 4,
    marginRight: 8,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 