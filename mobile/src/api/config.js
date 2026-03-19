import Constants from 'expo-constants';

/**
 * BACKEND API CONFIGURATION
 */

// Lấy IP động từ Expo (hoạt động tốt khi chạy máy ảo hoặc LAN)
const getHostUri = () => {
    if (Constants.expoConfig && Constants.expoConfig.hostUri) {
        return Constants.expoConfig.hostUri.split(':')[0];
    }
    return "192.168.1.100"; // Fallback
};

export const LOCAL_IP = getHostUri();

export const API_BASE_URL = `http://${LOCAL_IP}:8000`;
export const WS_BASE_URL = `ws://${LOCAL_IP}:8000`;

export const ENDPOINTS = {
    DIAGNOSE: `${API_BASE_URL}/api/doctor/diagnose`,
    ANALYZE_VIDEO: `${API_BASE_URL}/api/monitor/analyze`,
    WS_LIVE: `${WS_BASE_URL}/api/monitor/ws/live`
};
