import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notifications for production
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

export const notificationService = {
  async checkPermissions() {
    try {
      if (!Device.isDevice) return false;

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      return existingStatus === 'granted';
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  },

  async scheduleNotification(item, scheduledFor) {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) return null;

      // Schedule notification 5 minutes before
      const notificationDate = new Date(scheduledFor);
      notificationDate.setMinutes(notificationDate.getMinutes() - 5);

      if (notificationDate <= new Date()) return null;

      const message = item.type === 'hashtag' 
        ? `Time to post with #${item.name}!`
        : `Time to create content with "${item.name}"!`;

      // Configure channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('scheduled', {
          name: 'Scheduled Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF2D55',
          sound: true,
        });
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Scheduled Post Reminder',
          body: message,
          sound: true,
          priority: 'high',
          data: { itemId: item.id },
          badge: 1,
          ...(Platform.OS === 'android' && { channelId: 'scheduled' }),
        },
        trigger: {
          date: notificationDate,
          seconds: 1,
        },
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  },

  async cancelNotification(notificationId) {
    try {
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }
}; 