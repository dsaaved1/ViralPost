import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export const FilterModal = ({ 
  visible, 
  onClose, 
  selectedCountry,
  selectedIndustry,
  selectedSort,
  onSelectCountry,
  onSelectIndustry,
  onSelectSort,
  type,
  showCountry = false,
  showIndustry = false,
  showSort = false,
  onPremiumPress,
  isPro = false
}) => {
  const { theme } = useTheme();
  const [tempCountry, setTempCountry] = React.useState(selectedCountry);
  const [tempIndustry, setTempIndustry] = React.useState(selectedIndustry);
  const [tempSort, setTempSort] = React.useState(selectedSort);

  React.useEffect(() => {
    if (visible) {
      setTempCountry(selectedCountry);
      setTempIndustry(selectedIndustry);
      setTempSort(selectedSort);
    }
  }, [visible, selectedCountry, selectedIndustry, selectedSort]);

  const ALL_COUNTRIES = [
    { id: 'AU', name: 'Australia' },
    { id: 'BR', name: 'Brazil' },
    { id: 'CA', name: 'Canada' },
    { id: 'FR', name: 'France' },
    { id: 'DE', name: 'Germany' },
    { id: 'ID', name: 'Indonesia' },
    { id: 'JP', name: 'Japan' },
    { id: 'MY', name: 'Malaysia' },
    { id: 'MX', name: 'Mexico' },
    { id: 'PH', name: 'Philippines' },
    { id: 'ES', name: 'Spain' },
    { id: 'GB', name: 'United Kingdom' },
    { id: 'US', name: 'United States' }
  ];

  const INDUSTRY_OPTIONS = [
    { id: 'allCategories', name: 'All Categories' },
    { id: 'apparel', name: 'Apparel & Accessories' },
    { id: 'beauty', name: 'Beauty & Personal Care' },
    { id: 'education', name: 'Education' },
    { id: 'entertainment', name: 'News & Entertainment' },
    { id: 'financial', name: 'Financial Services' },
    { id: 'food', name: 'Food & Beverage' },
    { id: 'games', name: 'Games' },
    { id: 'sports', name: 'Sports & Outdoor' },
    { id: 'tech', name: 'Tech & Electronics' },
    { id: 'travel', name: 'Travel' },
    { id: 'vehicle', name: 'Vehicle & Transportation' },
  ];

  const SORT_OPTIONS = [
    { id: 'hot', name: 'Hot' },
    { id: 'likes', name: 'Likes' },
    { id: 'comments', name: 'Comments' },
    { id: 'shares', name: 'Shares' },
  ];

  const getAboutText = () => {
    switch (type) {
      case 'hashtags':
        return "Filter hashtags by country and industry to find the most relevant trends for your content. Metrics (posts, views) represent usage from the last 7 days.";
      case 'songs':
        return "Find trending songs by country to discover what's popular in different regions. We update our song rankings multiple times per day.";
      case 'videos':
        return "Discover what's going viral right now. Our algorithm aggregates and ranks videos multiple times throughout the day based on engagement metrics like views, likes, shares, and comments.";
      default:
        return "";
    }
  };

  const handleApply = () => {
    if (showCountry) {
      onSelectCountry(tempCountry);
    }
    if (showIndustry) {
      onSelectIndustry(tempIndustry);
    }
    if (showSort) {
      onSelectSort(tempSort);
    }
    onClose();
  };

  const handleCountrySelect = (countryId) => {
    setTempCountry(countryId);
    if (type === 'hashtags') {
      setTempIndustry(null); // Clear industry when country is selected
    }
  };

  const handleIndustrySelect = (industryId) => {
    if (industryId !== 'allCategories' && !isPro) {
      onPremiumPress();
      return;
    }
    
    setTempIndustry(industryId);
    if (type === 'hashtags') {
      setTempCountry(null); // Clear country when industry is selected
    }
  };

  const handleSortSelect = (sortId) => {
    if ((sortId === 'comments' || sortId === 'shares') && !isPro) {
      onPremiumPress();
      return;
    }
    
    setTempSort(sortId);
  };

  const renderIndustryOption = (industry) => {
    const isSelected = tempIndustry === industry.id;
    const isLocked = !isPro && industry.id !== 'allCategories';

    return (
      <TouchableOpacity
        key={industry.id}
        style={[
          styles.option,
          isSelected && styles.selectedOption,
          { 
            backgroundColor: isSelected ? theme.accent : theme.surface,
            opacity: isLocked ? 0.8 : 1
          }
        ]}
        onPress={() => handleIndustrySelect(industry.id)}
      >
        <View style={styles.optionContent}>
          <Text style={[
            styles.optionText,
            { color: isSelected ? '#fff' : theme.text }
          ]}>
            {industry.name}
          </Text>
          {isLocked && (
            <Ionicons 
              name="lock-closed" 
              size={14} 
              color={isSelected ? '#fff' : theme.text}
              style={styles.lockIcon}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSortOption = (sort) => {
    const isSelected = tempSort === sort.id;
    const isLocked = !isPro && (sort.id === 'comments' || sort.id === 'shares');

    return (
      <TouchableOpacity
        key={sort.id}
        style={[
          styles.option,
          isSelected && styles.selectedOption,
          { 
            backgroundColor: isSelected ? theme.accent : theme.surface,
            opacity: isLocked ? 0.8 : 1
          }
        ]}
        onPress={() => handleSortSelect(sort.id)}
      >
        <View style={styles.optionContent}>
          <Text style={[
            styles.optionText,
            { color: isSelected ? '#fff' : theme.text }
          ]}>
            {sort.name}
          </Text>
          {isLocked && (
            <Ionicons 
              name="lock-closed" 
              size={14} 
              color={isSelected ? '#fff' : theme.text}
              style={styles.lockIcon}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Social Network</Text>
          <View style={styles.socialNetwork}>
            <Ionicons 
              name="logo-tiktok" 
              size={24} 
              color={theme.text}
              style={styles.tiktokIcon}
            />
          </View>
          {showCountry && (
            <>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Country</Text>
              <View style={styles.optionsContainer}>
                {ALL_COUNTRIES.map((country) => (
                  <TouchableOpacity
                    key={country.id}
                    style={[
                      styles.option,
                      tempCountry === country.id && styles.selectedOption,
                      { backgroundColor: tempCountry === country.id ? theme.accent : theme.surface }
                    ]}
                    onPress={() => handleCountrySelect(country.id)}
                  >
                    <Text style={[
                      styles.optionText,
                      { color: tempCountry === country.id ? '#fff' : theme.text }
                    ]}>
                      {country.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
           </>
            )}

          {showSort && (
            <>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Sort by <Text style={styles.regionText}>(United States)</Text>
              </Text>
              <View style={styles.optionsContainer}>
                {SORT_OPTIONS.map(sort => renderSortOption(sort))}
              </View>
            </>
          )}

          {showIndustry && (
            <>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Category <Text style={styles.regionText}>(All regions)</Text>
              </Text>
              <View style={styles.optionsContainer}>
                {INDUSTRY_OPTIONS.map(industry => renderIndustryOption(industry))}
              </View>
            </>
          )}

          <Text style={[styles.sectionTitle, { color: theme.text }]}>About Our Data</Text>
          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
          {getAboutText()}
          </Text>
        </ScrollView>

        <TouchableOpacity
          style={[styles.applyButton, { backgroundColor: theme.accent }]}
          onPress={handleApply}
        >
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
  },
  applyButton: {
    margin: 16,
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  socialNetwork: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tiktokIcon: {
    marginRight: 8,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    color: '#8E8E93',
  },
  regionText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#8E8E93', // A lighter gray color
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 4,
  },
  lockIcon: {
    marginLeft: 8,
  },
}); 