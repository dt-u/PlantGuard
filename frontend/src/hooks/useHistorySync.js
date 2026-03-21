import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useHistorySync = (onSave, onDelete) => {
    const { user, isAuthenticated, getUserId } = useAuth();

    useEffect(() => {
        if (!isAuthenticated()) return;

        const userId = getUserId();
        // Determine WebSocket URL based on standard API base URL
        const wsUrl = `ws://127.0.0.1:8000/ws/${userId}`;
        
        let ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('Connected to History Sync WebSocket');
        };

        ws.onmessage = (event) => {
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

        ws.onclose = () => {
            console.log('Disconnected from History Sync WebSocket');
            // Basic reconnect logic could go here if needed
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    }, [user, isAuthenticated, onSave, onDelete]);
};
