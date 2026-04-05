import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../api/config';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const HeaderBell = ({ color = "#1E293B", style }) => {
    const navigation = useNavigation();
    const { user, isAuthenticated } = useAuth();
    const [count, setCount] = useState(0);

    const fetchUnreadCount = async () => {
        if (isAuthenticated() && user?.id) {
            try {
                const response = await axios.get(`${ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT}?user_id=${user.id}`);
                setCount(response.data.count);
            } catch (error) {
                console.error("Error fetching unread count:", error);
            }
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        
        // Polling every 30 seconds for new notifications
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [user, isAuthenticated]);

    return (
        <TouchableOpacity 
            style={[styles.container, style]} 
            onPress={() => navigation.navigate('NotificationCenter')}
            activeOpacity={0.7}
        >
            <View style={styles.iconWrapper}>
                <Bell size={22} color={color} />
                {isAuthenticated() && count > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {count > 9 ? '9+' : count}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 5,
        marginRight: 10,
    },
    iconWrapper: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#EF4444',
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
        borderWidth: 1.5,
        borderColor: '#F8FAFC',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 8,
        fontFamily: 'Vietnam-Bold',
        includeFontPadding: false,
    },
});

export default HeaderBell;
