import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notifications to only show at the exact scheduled time
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

const notificationService = {
  activeTimers: new Map(),

  requestPermissions: async () => {
    if (!Device.isDevice) {
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  },

  async checkPermissions() {
    if (!Device.isDevice) return false;
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  },

  async scheduleNotification(item, scheduledFor) {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) return null;

      const scheduledTime = new Date(scheduledFor);
      const now = new Date();

      if (scheduledTime <= now) {
        console.log('Cannot schedule for past time');
        return null;
      }

      // Generate a unique ID for this notification
      const notificationId = `${item.id}_${scheduledTime.getTime()}`;

      // Clear any existing timer for this item
      if (this.activeTimers.has(notificationId)) {
        clearInterval(this.activeTimers.get(notificationId));
      }

      // Create the message
      const message = item.type === 'hashtag' 
        ? `Time to post with #${item.name}!`
        : `Time to create content with the song "${item.name}"!`;

      // Set up Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF2D55',
        });
      }

      // Create an interval that checks every second
      const timer = setInterval(async () => {
        const currentTime = new Date();
        if (currentTime.getTime() >= scheduledTime.getTime()) {
          // Time to show notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Scheduled Post Reminder',
              body: message,
              sound: true,
              priority: 'high',
              badge: 1,
            },
            trigger: null, // Show immediately when time matches
          });

          // Clear the interval
          clearInterval(timer);
          this.activeTimers.delete(notificationId);
        }
      }, 1000);

      // Store the timer reference
      this.activeTimers.set(notificationId, timer);

      console.log(`Notification scheduled for: ${scheduledTime.toLocaleString()}`);
      return notificationId;

    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  },

  async cancelNotification(notificationId) {
    if (notificationId) {
      // Clear the interval if it exists
      if (this.activeTimers.has(notificationId)) {
        clearInterval(this.activeTimers.get(notificationId));
        this.activeTimers.delete(notificationId);
      }
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  }
};

export default notificationService; 