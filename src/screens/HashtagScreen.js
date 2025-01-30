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

