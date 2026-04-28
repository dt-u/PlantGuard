import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import axios from 'axios';
import { ENDPOINTS } from '../api/config';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    // Get the token specifically for Expo
    // projectId is automatically retrieved from app.json
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId || Constants?.easConfig?.projectId;
    
    token = (await Notifications.getExpoPushTokenAsync({
        projectId: projectId
    })).data;
    console.log('Expo Push Token:', token);
  }

  return token;
};

export const registerTokenWithBackend = async (userId, token) => {
    try {
        await axios.post(ENDPOINTS.NOTIFICATIONS_REGISTER_PUSH, {
            user_id: userId,
            token: token
        });
        console.log('Push token registered with backend');
    } catch (error) {
        console.error('Error registering push token with backend:', error);
    }
};

export const unregisterTokenWithBackend = async (userId, token) => {
    try {
        await axios.post(ENDPOINTS.NOTIFICATIONS_UNREGISTER_PUSH, {
            user_id: userId,
            token: token
        });
        console.log('Push token unregistered from backend');
    } catch (error) {
        console.error('Error unregistering push token from backend:', error);
    }
};
