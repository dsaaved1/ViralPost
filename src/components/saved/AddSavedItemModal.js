import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export const AddSavedItemModal = ({ visible, onClose, onSave }) => {
  const { theme } = useTheme();
  const [itemType, setItemType] = useState('hashtag');
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    
    const newItem = {
      type: itemType,
      name: name.trim(),
      ...(itemType === 'song' && { author: author.trim() }),
    };
    
    onSave(newItem);
    handleClose();
  };

  const handleClose = () => {
    setItemType('hashtag');
    setName('');
    setAuthor('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Add New Item</Text>

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                itemType === 'hashtag' && styles.selectedType,
                { borderColor: theme.border }
              ]}
              onPress={() => setItemType('hashtag')}
            >
              <Ionicons name="hashtag" size={20} color={theme.accent} />
              <Text style={[styles.typeText, { color: theme.text }]}>Hashtag</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                itemType === 'song' && styles.selectedType,
                { borderColor: theme.border }
              ]}
              onPress={() => setItemType('song')}
            >
              <Ionicons name="musical-notes" size={20} color={theme.accent} />
              <Text style={[styles.typeText, { color: theme.text }]}>Song</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.cardBackground,
              color: theme.text,
              borderColor: theme.border,
            }]}
            placeholder={itemType === 'hashtag' ? "Hashtag name" : "Song title"}
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
          />

          {itemType === 'song' && (
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.cardBackground,
                color: theme.text,
                borderColor: theme.border,
              }]}
              placeholder="Artist name"
              placeholderTextColor={theme.textSecondary}
              value={author}
              onChangeText={setAuthor}
            />
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: theme.accent }]}
              onPress={handleSave}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: theme.border }]}
              onPress={handleClose}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // ... (similar modal styles as before) ...
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    width: '45%',
    justifyContent: 'center',
  },
  selectedType: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  typeText: {
    marginLeft: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
}); 