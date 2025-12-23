import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.04635541307f4228b66cef0aefe0de71',
  appName: 'Costco Price Tracker',
  webDir: 'dist',
  server: {
    url: 'https://04635541-307f-4228-b66c-ef0aefe0de71.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF'
    }
  }
};

export default config;
