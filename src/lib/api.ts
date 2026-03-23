// Central server URL used by all network calls.
// Supports multiple configurations for development and production

const LOCALHOST_HOST = "localhost";
const EMULATOR_HOST = "10.0.2.2"; // For Android emulator
const DEVICE_HOST = "172.22.241.185"; // For physical Android device (update as needed)

// Determine SERVER_URL based on environment
function getServerUrl(): string {
  // 1. Check for environment variable (Vercel/production)
  const envUrl = import.meta.env.VITE_SERVER_URL;
  if (envUrl) {
    console.log("Using server URL from environment:", envUrl);
    return envUrl;
  }

  // 2. Check if running in browser (web app)
  if (typeof window !== "undefined") {
    // For web development, use localhost
    return `http://${LOCALHOST_HOST}:3001`;
  }

  // 3. Default to emulator (for APK/mobile)
  return `http://${EMULATOR_HOST}:3001`;
}

export const SERVER_URL = getServerUrl();
