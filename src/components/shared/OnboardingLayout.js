import React from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const OnboardingLayout = ({ 
  children, 
  onNext, 
  onBack, 
  nextText = 'Continue',
  currentPage = 0,
  totalPages = 4,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          {[...Array(totalPages)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentPage === index && styles.activeDot
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={onNext}
        >
          <Text style={styles.nextButtonText}>{nextText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FF2D55',
  },
  nextButton: {
    backgroundColor: '#FF2D55',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 