/**
 * BACKEND API CONFIGURATION
 */

// Thay thế bằng IP của máy tính bạn
export const LOCAL_IP = "192.168.5.101"; 

export const API_BASE_URL = `http://${LOCAL_IP}:8000`;
export const WS_BASE_URL = `ws://${LOCAL_IP}:8000`;

export const ENDPOINTS = {
    DIAGNOSE: `${API_BASE_URL}/api/doctor/diagnose`,
    ANALYZE_VIDEO: `${API_BASE_URL}/api/monitor/analyze`,
    WS_LIVE: `${WS_BASE_URL}/api/monitor/ws/live`
};
