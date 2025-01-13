import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  ActionSheetIOS,
  Platform,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AddSavedItemModal } from '../components/saved/AddSavedItemModal';
import { storageService } from '../services/storageService';
import { useFocusEffect } from '@react-navigation/native';
import { notificationService } from '../services/notificationService';

const formatScheduleDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format time
  const timeString = date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  // Check if it's today or tomorrow
  if (date.toDateString() === today.toDateString()) {
    return { date: 'Today', time: timeString };
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return { date: 'Tomorrow', time: timeString };
  }

  // Format other dates
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dateNum = date.toLocaleDateString('en-US', { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return { date: `${dayName}, ${dateNum}`, time: timeString };
};

const SavedItem = ({ item, onEdit, onDelete, onSchedule }) => {
  const { theme } = useTheme();
  const [notificationEnabled, setNotificationEnabled] = useState(
    item.notificationId ? true : false
  );
  const [globalNotificationsEnabled, setGlobalNotificationsEnabled] = useState(true);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const status = await notificationService.getNotificationStatus();
    setGlobalNotificationsEnabled(status);
  };

  const toggleNotification = async () => {
    try {
      if (!globalNotificationsEnabled) {
        // Show alert that notifications are disabled globally
        Alert.alert(
          "Notifications Disabled",
          "Please enable notifications in Settings to receive reminders",
          [{ text: "OK" }]
        );
        return;
      }

      if (notificationEnabled) {
        // Cancel notification
        if (item.notificationId) {
          await notificationService.cancelNotification(item.notificationId);
          await storageService.updateItem({
            ...item,
            notificationId: null
          });
        }
      } else {
        // Schedule new notification
        const notificationId = await notificationService.scheduleNotification(
          item,
          item.scheduledFor
        );
        if (notificationId) {
          await storageService.updateItem({
            ...item,
            notificationId
          });
        }
      }
      setNotificationEnabled(!notificationEnabled);
    } catch (error) {
      console.error('Error toggling notification:', error);
    }
  };
  
  const showOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Edit', 'Schedule', 'Delete'],
          destructiveButtonIndex: 3,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) onEdit(item);
          if (buttonIndex === 2) onSchedule(item);
          if (buttonIndex === 3) onDelete(item.id);
        }
      );
    }
  };
  
  const scheduleInfo = item.scheduledFor ? formatScheduleDate(item.scheduledFor) : null;
  
  return (
    <View style={[styles.savedItem, { backgroundColor: theme.cardBackground }]}>
      <LinearGradient
        colors={[theme.cardBackground, theme.surface]}
        style={[styles.itemGradient, { opacity: 0.5 }]}
      />
      <View style={styles.itemLeft}>
        <Text style={[styles.itemIcon, { color: theme.accent }]}>
          {item.type === 'hashtag' ? '#' : '♪'}
        </Text>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: theme.text }]}>
            {item.type === 'hashtag' ? `#${item.name}` : item.name}
          </Text>
          {item.type === 'song' && (
            <Text style={[styles.itemAuthor, { color: theme.textSecondary }]}>
              {item.author}
            </Text>
          )}
          {item.description && (
            <Text 
              style={[styles.itemDescription, { color: theme.textSecondary }]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}
          {scheduleInfo && (
            <View style={styles.scheduleContainer}>
              <View style={styles.scheduleInfo}>
                <Text style={[styles.scheduleDate, { color: theme.textSecondary }]}>
                  <Text style={[styles.scheduleDayName, { color: theme.text }]}>
                    {scheduleInfo.date.split(',')[0]}
                  </Text>
                  <Text style={styles.scheduleDateSeparator}>,</Text>
                  {scheduleInfo.date.includes(',') ? scheduleInfo.date.split(',')[1] : ''}
                </Text>
                <Text style={[styles.scheduleTime, { color: theme.accent }]}>
                  {scheduleInfo.time}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={toggleNotification}
                style={styles.notificationButton}
              >
                <Ionicons 
                  name={notificationEnabled ? "notifications" : "notifications-off"}
                  size={16} 
                  color={notificationEnabled ? theme.accent : theme.textSecondary}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={showOptions}>
        <Ionicons 
          name="ellipsis-horizontal" 
          size={20} 
          color={theme.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};

const ScheduleModal = ({ visible, onClose, onSave, item }) => {
  const { theme } = useTheme();
  const [date, setDate] = useState(new Date());

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Schedule Item</Text>
          
          <View style={[styles.datePickerContainer, { backgroundColor: theme.cardBackground }]}>
            <DateTimePicker
              value={date}
              mode="datetime"
              display="spinner"
              onChange={(event, selectedDate) => {
                setDate(selectedDate || date);
              }}
              textColor={theme.text}
              style={{ backgroundColor: 'transparent' }}
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: theme.accent }]}
              onPress={() => {
                onSave(item.id, date);
                onClose();
              }}
            >
              <Text style={[styles.modalButtonText, { color: '#fff' }]}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton, { borderColor: theme.border }]}
              onPress={onClose}
            >
              <Text style={[styles.modalButtonText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const EditModal = ({ visible, onClose, onSave, item, isNew = false }) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const MAX_DESCRIPTION_LENGTH = 90;

  useEffect(() => {
    if (item && !isNew) {
      setName(item.name || '');
      setDescription(item.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [item, isNew]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      ...item,
      name: name.trim(),
      description: description.trim(),
    });
    onClose();
    setTimeout(() => {
      setName('');
      setDescription('');
    }, 100);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        onClose();
        setName('');
        setDescription('');
      }}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {isNew ? 'Add New Hashtag' : `Edit ${item?.type === 'hashtag' ? 'Hashtag' : 'Song'}`}
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Name</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.cardBackground,
                    color: theme.text,
                    borderColor: theme.border,
                  }]}
                  value={name}
                  onChangeText={setName}
                  placeholder={`Enter ${item?.type === 'hashtag' ? 'hashtag' : 'song'} name`}
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Description</Text>
                  <Text style={[styles.characterCount, { color: theme.textSecondary }]}>
                    {description.length}/{MAX_DESCRIPTION_LENGTH}
                  </Text>
                </View>
                <TextInput
                  style={[styles.input, styles.descriptionInput, { 
                    backgroundColor: theme.cardBackground,
                    color: theme.text,
                    borderColor: theme.border,
                  }]}
                  value={description}
                  onChangeText={(text) => {
                    if (text.length <= MAX_DESCRIPTION_LENGTH) {
                      setDescription(text);
                    }
                  }}
                  placeholder="Add a description (optional)"
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  numberOfLines={2}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, { backgroundColor: theme.accent }]}
                  onPress={handleSave}
                >
                  <Text style={[styles.modalButtonText, { color: '#fff' }]}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton, { borderColor: theme.border }]}
                  onPress={() => {
                    onClose();
                    setName('');
                    setDescription('');
                  }}
                >
                  <Text style={[styles.modalButtonText, { color: theme.text }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const CollapsibleSection = ({ title, isExpanded, onToggle, children, isEmpty }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.section}>
      <TouchableOpacity 
        style={[styles.sectionHeader, { borderBottomColor: theme.border }]} 
        onPress={onToggle}
      >
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
        <Ionicons 
          name={isExpanded ? 'chevron-down' : 'chevron-forward'}
          size={20} 
          color={theme.textSecondary} 
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.sectionContent}>
          {isEmpty ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No {title.toLowerCase()} items
            </Text>
          ) : children}
        </View>
      )}
    </View>
  );
};

const AddButton = ({ onSave }) => {
  const { theme } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSave = (newItem) => {
    onSave({
      type: 'hashtag', // Default type
      ...newItem,
    });
    setShowAddModal(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: theme.accent }]}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      <EditModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSave}
        item={{ type: 'hashtag' }} // Pass empty item with default type
        isNew={true} // Add this prop to differentiate between edit and add
      />
    </>
  );
};

export const SavedScreen = () => {
  const { theme } = useTheme();
  const [unscheduledExpanded, setUnscheduledExpanded] = useState(true);
  const [scheduledExpanded, setScheduledExpanded] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [unscheduledItems, setUnscheduledItems] = useState([]);
  const [scheduledItems, setScheduledItems] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [globalNotificationsEnabled, setGlobalNotificationsEnabled] = useState(true);
  
  useEffect(() => {
    loadSavedItems();
  }, []);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const status = await notificationService.getNotificationStatus();
    setGlobalNotificationsEnabled(status);
  };

  const loadSavedItems = async () => {
    const items = await storageService.getSavedItems();
    setUnscheduledItems(items.unscheduled);
    
    // Sort scheduled items
    const now = new Date();
    const sortedScheduled = items.scheduled.sort((a, b) => {
      const dateA = new Date(a.scheduledFor);
      const dateB = new Date(b.scheduledFor);
      return dateA - dateB;
    });

    // Separate past and upcoming events
    const pastItems = sortedScheduled.filter(item => new Date(item.scheduledFor) < now);
    const upcomingItems = sortedScheduled.filter(item => new Date(item.scheduledFor) >= now);
    
    // Put past items at the bottom
    setScheduledItems([...upcomingItems, ...pastItems]);
  };

  const handleDeleteItem = async (itemId, isScheduled = false) => {
    try {
      await storageService.deleteItem(itemId, isScheduled);
      await loadSavedItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSchedulePress = (item) => {
    setSelectedItem(item);
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = (itemId, date) => {
    handleSchedule(itemId, date);
    setShowScheduleModal(false);
  };

  const handleSaveEdit = async (editedItem) => {
    try {
      await storageService.updateItem(editedItem);
      await loadSavedItems();
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const handleSaveNewItem = async (newItem) => {
    try {
      const savedItem = await storageService.saveItem({
        ...newItem,
        id: Date.now().toString(),
        type: 'hashtag',
        createdAt: new Date().toISOString()
      });
      
      setUnscheduledItems(prev => [...prev, savedItem]);
    } catch (error) {
      console.error('Error saving new item:', error);
    }
  };

  const handleSchedule = async (itemId, date) => {
    try {
      // Get the item being updated
      const item = [...unscheduledItems, ...scheduledItems].find(i => i.id === itemId);
      if (!item) return;

      // If item was previously scheduled, cancel old notification
      if (item.notificationId) {
        await notificationService.cancelNotification(item.notificationId);
      }

      // Try to schedule notification (will return null if notifications are disabled)
      const notificationId = await notificationService.scheduleNotification(item, date);
      
      // Update item with new schedule and notification status
      const updatedItem = {
        ...item,
        scheduledFor: date.toISOString(),
        notificationId
      };

      // Update the item in storage
      await storageService.updateItem(updatedItem);
      
      // Reload all items to refresh the lists
      await loadSavedItems();
    } catch (error) {
      console.error('Error scheduling item:', error);
    }
  };

  // Add this effect to reload items when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadSavedItems();
    }, [])
  );

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'hashtag':
        return <SavedItem item={item} onEdit={handleEdit} onDelete={handleDeleteItem} onSchedule={handleSchedulePress} />;
      case 'song':
        return (
          <View style={[styles.savedItem, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.itemContent}>
              <Image 
                source={{ uri: item.cover }} 
                style={styles.songCover}
                defaultSource={require('../assets/images/default-cover.jpeg')}
              />
              <View style={styles.itemInfo}>
                <Text style={[styles.itemTitle, { color: theme.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
                  {item.author}
                </Text>
              </View>
            </View>
            {renderItemActions(item)}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Saved</Text>
        </View>
        
        <ScrollView style={styles.content}>
          <CollapsibleSection 
            title="Unscheduled" 
            isExpanded={unscheduledExpanded}
            onToggle={() => setUnscheduledExpanded(!unscheduledExpanded)}
            isEmpty={unscheduledItems.length === 0}
          >
            {unscheduledItems.map(item => (
              <SavedItem key={item.id} item={item} onEdit={handleEdit} onDelete={handleDeleteItem} onSchedule={handleSchedulePress} />
            ))}
          </CollapsibleSection>

          <CollapsibleSection 
            title="Scheduled" 
            isExpanded={scheduledExpanded}
            onToggle={() => setScheduledExpanded(!scheduledExpanded)}
            isEmpty={scheduledItems.length === 0}
          >
            {scheduledItems.map(item => (
              <SavedItem key={item.id} item={item} onEdit={handleEdit} onDelete={handleDeleteItem} onSchedule={handleSchedulePress} />
            ))}
          </CollapsibleSection>
        </ScrollView>

        <AddButton onSave={handleSaveNewItem} />

        <ScheduleModal
          visible={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          onSave={handleSchedule}
          item={selectedItem}
        />

        <EditModal
          visible={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingItem(null);
          }}
          onSave={handleSaveEdit}
          item={editingItem}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  sectionContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 20,
  },
  savedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 16,
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 70,
  },
  itemGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    fontSize: 20,
    fontWeight: '600',
    width: 24,
    textAlign: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  itemAuthor: {
    fontSize: 13,
    marginTop: 2,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scheduleInfo: {
    fontSize: 11,
    marginTop: 6,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  characterCount: {
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  descriptionInput: {
    minHeight: 50,
    maxHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  itemDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleDate: {
    fontSize: 11,
    marginRight: 6,
    opacity: 0.8,
  },
  scheduleDayName: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  scheduleDateSeparator: {
    marginHorizontal: 2,
    opacity: 0.5,
  },
  scheduleTime: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  notificationButton: {
    padding: 4,
    marginLeft: 4,
  },
  datePickerContainer: {
    borderRadius: 12,
    marginVertical: 16,
    padding: 8,
  },
  songCover: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  }
}); 