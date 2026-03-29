import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sparkstack.costcosaver',
  appName: 'Cost Saver',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      style: 'dark', // dark status bar text on light background
      backgroundColor: '#FFFBFE', // Match app background
      overlaysWebView: false // Don't overlay the web content
    },
    SafeArea: {
      enabled: true
    }
  }
};

export default config;
