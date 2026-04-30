import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useHistorySync = (onSave, onDelete) => {
    const { user, isAuthenticated, getUserId } = useAuth();
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const onSaveRef = useRef(onSave);
    const onDeleteRef = useRef(onDelete);
    const lastUserIdRef = useRef(null);
    
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000; // 3 seconds

    // Update refs when callbacks change
    useEffect(() => {
        onSaveRef.current = onSave;
        onDeleteRef.current = onDelete;
    }, [onSave, onDelete]);

    const connectWebSocket = useCallback(() => {
        if (!isAuthenticated()) {
            if (wsRef.current) wsRef.current.close(1000, 'User logged out');
            return;
        }

        const userId = getUserId();
        
        // If already connecting or open for the SAME user, don't restart
        if (wsRef.current && 
            (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) &&
            lastUserIdRef.current === userId) {
            return;
        }

        lastUserIdRef.current = userId;
        
        // Clear any existing reconnection timeout
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        // Close existing connection if any
        if (wsRef.current) {
            wsRef.current.close(1000, 'Reconnecting for new session');
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
                    if (data.type === 'save' && onSaveRef.current) {
                        onSaveRef.current(data.record_id);
                    } else if (data.type === 'delete' && onDeleteRef.current) {
                        onDeleteRef.current(data.record_id);
                    }
                }
            } catch (err) {
                console.error('❌ Error parsing websocket message:', err);
            }
        };

        wsRef.current.onclose = (event) => {
            console.log(`❌ WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
            
            // Only reconnect if it was an abnormal closure and user is still logged in
            if (event.code !== 1000 && isAuthenticated() && reconnectAttemptsRef.current < maxReconnectAttempts) {
                reconnectAttemptsRef.current++;
                console.log(`🔄 Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts}) in ${reconnectDelay/1000} seconds...`);
                
                reconnectTimeoutRef.current = setTimeout(() => {
                    connectWebSocket();
                }, reconnectDelay);
            }
        };

        wsRef.current.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
        };
    }, [isAuthenticated, getUserId]);

    useEffect(() => {
        const isAuth = isAuthenticated();
        const userId = getUserId();

        if (isAuth) {
            connectWebSocket();
        } else {
            if (wsRef.current) {
                wsRef.current.close(1000, 'User not authenticated');
                wsRef.current = null;
            }
        }

        return () => {
            // No-op cleanup here, we handle it in connectWebSocket and the final cleanup
        };
    }, [user?.id, isAuthenticated, getUserId, connectWebSocket]);

    // Final cleanup on unmount
    useEffect(() => {
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close(1000, 'Component unmounted');
                wsRef.current = null;
            }
        };
    }, []);
};
