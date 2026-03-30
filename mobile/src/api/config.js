import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * AUTO-DETECTION CONFIGURATION
 */

const getHostUri = () => {
    // 1. Ưu tiên lấy IP từ Expo (Đây là cách chính xác nhất cho điện thoại thật chạy Expo Go)
    const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost || Constants.manifest?.debuggerHost;
    
    if (hostUri && !hostUri.includes('localhost') && !hostUri.includes('127.0.0.1')) {
        return hostUri.split(':')[0];
    }

    // 2. Nếu không lấy được từ Expo (vùng dev đặc biệt), mới dùng fallback cho Emulator/Simulator
    if (__DEV__) {
        if (Platform.OS === 'android') {
            return "10.0.2.2"; // Chỉ dành cho Android Emulator
        }
        return "localhost"; // Chỉ dành cho iOS Simulator
    }
    
    // 3. Fallback cuối cùng nếu mọi thứ thất bại
    return "192.168.1.100"; 
};

export const LOCAL_IP = getHostUri();

export const API_BASE_URL = `http://${LOCAL_IP}:8000`;
export const WS_BASE_URL = `ws://${LOCAL_IP}:8000`;

export const ENDPOINTS = {
    // Auth
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    UPDATE_PROFILE: (id) => `${API_BASE_URL}/api/auth/users/${id}`,
    
    // Monitor
    ANALYZE_VIDEO: `${API_BASE_URL}/api/monitor/analyze`,
    WS_LIVE: `${WS_BASE_URL}/api/monitor/ws/live`,
    
    // Doctor
    DIAGNOSE: `${API_BASE_URL}/api/doctor/diagnose`,
    
    // History
    HISTORY_LIST: `${API_BASE_URL}/api/history/list`,
    HISTORY_SAVE: `${API_BASE_URL}/api/history/save`,
    HISTORY_DELETE: (id) => `${API_BASE_URL}/api/history/${id}`
};
