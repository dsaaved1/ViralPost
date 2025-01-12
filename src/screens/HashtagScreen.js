import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_HASHTAGS_KEY = '@saved_hashtags';

// Add to your component
const [savedHashtags, setSavedHashtags] = useState(new Set());

useEffect(() => {
  loadSavedHashtags();
}, []);

const loadSavedHashtags = async () => {
  try {
    const saved = await AsyncStorage.getItem(SAVED_HASHTAGS_KEY);
    if (saved) {
      setSavedHashtags(new Set(JSON.parse(saved)));
    }
  } catch (error) {
    console.error('Error loading saved hashtags:', error);
  }
};

const handleHashtagLongPress = async (item) => {
  try {
    const newSavedHashtags = new Set(savedHashtags);
    
    if (savedHashtags.has(item.id)) {
      newSavedHashtags.delete(item.id);
      // Show toast or notification
      Toast.show({
        type: 'info',
        text1: 'Hashtag removed from saved',
      });
    } else {
      newSavedHashtags.add(item.id);
      // Show toast or notification
      Toast.show({
        type: 'success',
        text1: 'Hashtag saved!',
      });
    }
    
    setSavedHashtags(newSavedHashtags);
    await AsyncStorage.setItem(
      SAVED_HASHTAGS_KEY,
      JSON.stringify([...newSavedHashtags])
    );
  } catch (error) {
    console.error('Error saving hashtag:', error);
  }
};

const handleHashtagPress = (hashtag) => {
  // Open hashtag link
  Linking.openURL(`https://www.tiktok.com/tag/${hashtag}`);
}; 