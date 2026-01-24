import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f76eb38a4ca24b9cbcdf334f8b48335a',
  appName: 'diagnostic-whisperer',
  webDir: 'dist',
  server: {
    url: 'https://f76eb38a-4ca2-4b9c-bcdf-334f8b48335a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Geolocation: {
      // Request high accuracy location
    },
    Motion: {
      // Enable motion detection
    }
  }
};

export default config;
