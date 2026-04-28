import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * AUTO-DETECTION CONFIGURATION
 */

const getHostUri = () => {
    // 1. Tổng hợp tất cả các nguồn có thể chứa IP từ Expo
    const hostUri = Constants.expoConfig?.hostUri || 
                    Constants.manifest2?.extra?.expoGo?.debuggerHost || 
                    Constants.manifest?.debuggerHost || 
                    Constants.linkingUri || 
                    Constants.experienceUrl;
    
    // 2. Nếu tìm thấy hostUri, bóc tách lấy IP (loại bỏ protocol và port)
    if (hostUri) {
        // Regex để tìm dải IP (4 nhóm số cách nhau bởi dấu chấm)
        const ipMatch = hostUri.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
        if (ipMatch && ipMatch[1] !== '127.0.0.1') {
            return ipMatch[1];
        }
    }

    // 3. Fallback cho Emulator/Simulator nếu là môi trường Dev
    if (__DEV__) {
        if (Platform.OS === 'android') {
            return "10.0.2.2"; // Android Emulator
        }
        return "localhost"; // iOS Simulator
    }
    
    // 4. Fallback cuối cùng nếu mọi thứ thất bại
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
    WS_LIVE: (userId) => `${WS_BASE_URL}/api/monitor/ws/live/${userId}`,
    
    // Doctor
    DIAGNOSE: `${API_BASE_URL}/api/doctor/diagnose`,
    
    // History
    HISTORY_LIST: `${API_BASE_URL}/api/history/list`,
    HISTORY_SAVE: `${API_BASE_URL}/api/history/save`,
    HISTORY_DELETE: (id) => `${API_BASE_URL}/api/history/${id}`,

    // Routine
    ROUTINE_LIST: `${API_BASE_URL}/api/routine`,
    ROUTINE_DETAIL: (id) => `${API_BASE_URL}/api/routine/${id}`,
    ROUTINE_CREATE: `${API_BASE_URL}/api/routine/save`,
    ROUTINE_GENERATE: `${API_BASE_URL}/api/routine/generate`,
    ROUTINE_UPDATE_EVENT: (id, eventIndex) => `${API_BASE_URL}/api/routine/${id}/events/${eventIndex}`,
    ROUTINE_UPDATE_SETTINGS: (id) => `${API_BASE_URL}/api/routine/${id}/settings`,
    ROUTINE_DELETE: (id) => `${API_BASE_URL}/api/routine/${id}`,

    // Notifications
    NOTIFICATIONS_LIST: `${API_BASE_URL}/api/notifications/`,
    NOTIFICATIONS_UNREAD_COUNT: `${API_BASE_URL}/api/notifications/unread-count`,
    NOTIFICATIONS_MARK_READ: (id) => `${API_BASE_URL}/api/notifications/${id}/read`,
    NOTIFICATIONS_READ_ALL: `${API_BASE_URL}/api/notifications/read-all`,
    NOTIFICATIONS_CLEAR: `${API_BASE_URL}/api/notifications/clear`,
    NOTIFICATIONS_REGISTER_PUSH: `${API_BASE_URL}/api/notifications/register-push-token`,
    NOTIFICATIONS_UNREGISTER_PUSH: `${API_BASE_URL}/api/notifications/unregister-push-token`,
    WS_NOTIFICATIONS: (userId) => `${WS_BASE_URL}/ws/${userId}`
};
