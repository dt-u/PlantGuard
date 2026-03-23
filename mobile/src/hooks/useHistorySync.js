import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { WS_BASE_URL } from '../api/config';

export const useHistorySync = (onSave, onDelete) => {
    const { user, isAuthenticated, getUserId } = useAuth();
    const ws = useRef(null);

    useEffect(() => {
        if (!isAuthenticated()) return;

        const userId = getUserId();
        if (!userId) return; // Không kết nối nếu chưa có userId

        // Sử dụng WS_BASE_URL từ config thay vì tự tạo
        const wsUrl = `${WS_BASE_URL}/ws/${userId}`;

        console.log('Connecting to History Sync:', wsUrl);
        ws.current = new WebSocket(wsUrl);
        ws.current.onopen = () => {
            console.log('Connected to History Sync WebSocket (Mobile)');
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.action === 'history_updated') {
                    if (data.type === 'save' && onSave) {
                        onSave(data.record_id);
                    } else if (data.type === 'delete' && onDelete) {
                        onDelete(data.record_id);
                    }
                }
            } catch (err) {
                console.error('Error parsing websocket message:', err);
            }
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.current.onclose = () => {
            console.log('Disconnected from History Sync WebSocket (Mobile)');
        };

        return () => {
            if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
                ws.current.close();
            }
        };
    }, [user, isAuthenticated, onSave, onDelete]);
};
