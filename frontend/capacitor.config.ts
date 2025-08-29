import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lifetrack.app',
  appName: 'LifeTrack',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#3b82f6",
      showSpinner: true,
      spinnerColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#3b82f6"
    },
    Keyboard: {
      resize: "body",
      style: "DARK",
      resizeOnFullScreen: true
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;
