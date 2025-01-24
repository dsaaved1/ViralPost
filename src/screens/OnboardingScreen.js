import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BeforeAfterView } from '../components/onboarding/BeforeAfterView';
import { StatsView } from '../components/onboarding/StatsView';
import { TrendingsDemoView } from '../components/onboarding/TrendingsDemoView';
import { SchedulingDemoView } from '../components/onboarding/SchedulingDemoView';

export const OnboardingScreen = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 4;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const renderCurrentView = () => {
    switch (currentPage) {
      case 0:
        return <BeforeAfterView />;
      case 1:
        return <StatsView />;
      case 2:
        return <TrendingsDemoView />;
      case 3:
        return <SchedulingDemoView />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
          } else {
            navigation.goBack();
          }
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentView()}
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
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentPage === totalPages - 1 ? 'Get Started' : 'Continue'}
          </Text>
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
    flexGrow: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
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