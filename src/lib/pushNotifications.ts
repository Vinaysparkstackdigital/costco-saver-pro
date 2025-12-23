import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

export const isPushNotificationsAvailable = () => {
  return Capacitor.isNativePlatform();
};

export const registerPushNotifications = async () => {
  if (!isPushNotificationsAvailable()) {
    console.log('Push notifications not available on web');
    return null;
  }

  try {
    // Request permission
    let permStatus = await PushNotifications.checkPermissions();
    
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    
    if (permStatus.receive !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }

    // Register for push notifications
    await PushNotifications.register();

    // Listen for registration success
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
      // Store token for later use
      localStorage.setItem('pushToken', token.value);
    });

    // Listen for registration errors
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    // Listen for push notifications
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ' + JSON.stringify(notification));
    });

    // Listen for notification actions
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed: ' + JSON.stringify(notification));
    });

    return true;
  } catch (error) {
    console.error('Error registering push notifications:', error);
    return null;
  }
};

export const sendLocalPriceDropNotification = async (
  itemName: string,
  originalPrice: number,
  currentPrice: number,
  savings: number
) => {
  if (!isPushNotificationsAvailable()) {
    console.log('Local notifications not available on web');
    return;
  }

  try {
    // Request permission for local notifications
    const permStatus = await LocalNotifications.requestPermissions();
    
    if (permStatus.display !== 'granted') {
      console.log('Local notification permission not granted');
      return;
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now(),
          title: '💰 Price Drop Alert!',
          body: `${itemName} dropped from $${originalPrice.toFixed(2)} to $${currentPrice.toFixed(2)}. Save $${savings.toFixed(2)}!`,
          schedule: { at: new Date(Date.now() + 1000) },
          sound: 'default',
          actionTypeId: 'PRICE_DROP',
          extra: {
            itemName,
            originalPrice,
            currentPrice,
            savings
          }
        }
      ]
    });

    console.log('Local notification scheduled for:', itemName);
  } catch (error) {
    console.error('Error sending local notification:', error);
  }
};

export const checkAndNotifyPriceDrops = async (
  items: Array<{
    item_name: string;
    purchase_price: number;
    current_price: number;
  }>
) => {
  for (const item of items) {
    if (item.current_price < item.purchase_price) {
      const savings = item.purchase_price - item.current_price;
      await sendLocalPriceDropNotification(
        item.item_name,
        item.purchase_price,
        item.current_price,
        savings
      );
    }
  }
};
