import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_ITEMS_KEY = '@saved_items';

const defaultSavedItems = {
  unscheduled: [],
  scheduled: []
};

export const storageService = {
  async getSavedItems() {
    try {
      const saved = await AsyncStorage.getItem(SAVED_ITEMS_KEY);
      return saved ? JSON.parse(saved) : defaultSavedItems;
    } catch (error) {
      console.error('Error getting saved items:', error);
      return defaultSavedItems;
    }
  },

  async saveSavedItems(items) {
    try {
      await AsyncStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving items:', error);
    }
  },

  async saveItem(item) {
    try {
      const savedItems = await this.getSavedItems();
      const newItem = {
        ...item,
        id: Date.now().toString(), // Generate unique ID
        createdAt: new Date().toISOString(),
      };
      
      savedItems.unscheduled.push(newItem);
      await AsyncStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(savedItems));
      return newItem;
    } catch (error) {
      console.error('Error saving item:', error);
      throw error;
    }
  },

  async scheduleItem(itemId, scheduledFor) {
    try {
      const savedItems = await this.getSavedItems();
      const itemIndex = savedItems.unscheduled.findIndex(item => item.id === itemId);
      
      if (itemIndex !== -1) {
        const item = savedItems.unscheduled[itemIndex];
        savedItems.unscheduled.splice(itemIndex, 1);
        savedItems.scheduled.push({
          ...item,
          scheduledFor: scheduledFor.toISOString(),
        });
        
        await AsyncStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(savedItems));
      }
    } catch (error) {
      console.error('Error scheduling item:', error);
      throw error;
    }
  },

  async deleteItem(itemId, isScheduled = false) {
    try {
      const savedItems = await this.getSavedItems();
      const arrayKey = isScheduled ? 'scheduled' : 'unscheduled';
      
      savedItems[arrayKey] = savedItems[arrayKey].filter(item => item.id !== itemId);
      await AsyncStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(savedItems));
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },

  async updateItem(updatedItem) {
    try {
      const savedItems = await this.getSavedItems();
      
      // Find and update item in either unscheduled or scheduled arrays
      if (updatedItem.scheduledFor) {
        // Remove from unscheduled if it exists there
        savedItems.unscheduled = savedItems.unscheduled.filter(
          item => item.id !== updatedItem.id
        );
        
        // Update in scheduled array
        const scheduledIndex = savedItems.scheduled.findIndex(
          item => item.id === updatedItem.id
        );
        
        if (scheduledIndex !== -1) {
          savedItems.scheduled[scheduledIndex] = updatedItem;
        } else {
          savedItems.scheduled.push(updatedItem);
        }
      } else {
        // Remove from scheduled if it exists there
        savedItems.scheduled = savedItems.scheduled.filter(
          item => item.id !== updatedItem.id
        );
        
        // Update in unscheduled array
        const unscheduledIndex = savedItems.unscheduled.findIndex(
          item => item.id === updatedItem.id
        );
        
        if (unscheduledIndex !== -1) {
          savedItems.unscheduled[unscheduledIndex] = updatedItem;
        } else {
          savedItems.unscheduled.push(updatedItem);
        }
      }

      await this.saveSavedItems(savedItems);
      return updatedItem;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  async saveHashtag(hashtag) {
    try {
      const savedItems = await this.getSavedItems();
      const existingIndex = savedItems.unscheduled.findIndex(
        item => item.id === hashtag.id && item.type === 'hashtag'
      );

      if (existingIndex === -1) {
        savedItems.unscheduled = [...savedItems.unscheduled, hashtag];
        await this.saveSavedItems(savedItems);
      }
    } catch (error) {
      console.error('Error saving hashtag:', error);
      throw error;
    }
  },

  async removeHashtag(hashtagId) {
    try {
      const savedItems = await this.getSavedItems();
      savedItems.unscheduled = savedItems.unscheduled.filter(
        item => !(item.id === hashtagId && item.type === 'hashtag')
      );
      await this.saveSavedItems(savedItems);
    } catch (error) {
      console.error('Error removing hashtag:', error);
      throw error;
    }
  },

  async saveSong(song) {
    try {
      const savedItems = await this.getSavedItems();
      const newSong = {
        id: song.id,
        type: 'song',
        name: song.title,
        author: song.author,
        cover: song.cover,
        createdAt: new Date().toISOString()
      };
      
      savedItems.unscheduled.push(newSong);
      await this.saveSavedItems(savedItems);
      return newSong;
    } catch (error) {
      console.error('Error saving song:', error);
      throw error;
    }
  },

  async removeSong(songId) {
    try {
      const savedItems = await this.getSavedItems();
      savedItems.unscheduled = savedItems.unscheduled.filter(
        item => !(item.type === 'song' && item.id === songId)
      );
      await this.saveSavedItems(savedItems);
    } catch (error) {
      console.error('Error removing song:', error);
      throw error;
    }
  }
}; 