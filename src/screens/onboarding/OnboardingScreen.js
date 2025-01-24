import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BeforeAfterView } from '../../components/onboarding/BeforeAfterView';
import { StatsView } from '../../components/onboarding/StatsView';
import { TrendingsDemoView } from '../../components/onboarding/TrendingsDemoView';
import { SchedulingDemoView } from '../../components/onboarding/SchedulingDemoView';

const { width } = Dimensions.get('window');

export const OnboardingScreen = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showingAfterImage, setShowingAfterImage] = useState(false);
  const totalPages = 4;
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentPage === 0 && !showingAfterImage) {
      setShowingAfterImage(true);
    } else if (currentPage < totalPages - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentPage + 1,
        animated: true,
      });
      setCurrentPage(currentPage + 1);
      setShowingAfterImage(false);
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(newIndex);
  };

  const renderItem = ({ index }) => {
    return (
      <View style={styles.slide}>
        {(() => {
          switch (index) {
            case 0:
              return <BeforeAfterView showAfterImage={showingAfterImage} />;
            case 1:
              return <StatsView />;
            case 2:
              return <TrendingsDemoView />;
            case 3:
              return <SchedulingDemoView />;
            default:
              return null;
          }
        })()}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (currentPage === 0 && showingAfterImage) {
            setShowingAfterImage(false);
          } else if (currentPage > 0) {
            flatListRef.current?.scrollToIndex({
              index: currentPage - 1,
              animated: true,
            });
            setCurrentPage(currentPage - 1);
            setShowingAfterImage(false);
          } else {
            navigation.goBack();
          }
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={[...Array(totalPages)]}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
      />

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
  flatList: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
  },
  slide: {
    width: width,
    flex: 1,
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