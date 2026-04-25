import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useHistorySync = (onSave, onDelete) => {
    const { user, isAuthenticated, getUserId } = useAuth();
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000; // 3 seconds

    const connectWebSocket = () => {
        if (!isAuthenticated()) return;

        const userId = getUserId();
        
        // Clear any existing reconnection timeout
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        // Close existing connection if any
        if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
            wsRef.current.close();
        }

        // Create new WebSocket connection
        const wsUrl = `ws://127.0.0.1:8000/ws/${userId}`;
        console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);
        
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
            console.log('✅ Connected to History Sync WebSocket');
            reconnectAttemptsRef.current = 0; // Reset reconnection attempts
        };

        wsRef.current.onmessage = (event) => {
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
                console.error('❌ Error parsing websocket message:', err);
            }
        };

        wsRef.current.onclose = (event) => {
            console.log(`❌ WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
            
            // Attempt to reconnect if not explicitly closed and user is still authenticated
            if (event.code !== 1000 && isAuthenticated && reconnectAttemptsRef.current < maxReconnectAttempts) {
                reconnectAttemptsRef.current++;
                console.log(`🔄 Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts}) in ${reconnectDelay/1000} seconds...`);
                
                reconnectTimeoutRef.current = setTimeout(() => {
                    connectWebSocket();
                }, reconnectDelay);
            } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
                console.log('❌ Max reconnection attempts reached. Stopping reconnection attempts.');
            }
        };

        wsRef.current.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
        };
    };

    useEffect(() => {
        if (isAuthenticated()) {
            connectWebSocket();
        }

        return () => {
            // Cleanup on unmount
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
                wsRef.current.close(1000, 'Component unmounted');
            }
        };
    }, [user, isAuthenticated, onSave, onDelete]);

    // Reconnect when user changes
    useEffect(() => {
        if (isAuthenticated()) {
            connectWebSocket();
        }
    }, [getUserId()]);
};
