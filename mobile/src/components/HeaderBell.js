import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const HeaderBell = ({ color = "#1E293B", badgeCount = 2, style }) => {
    const navigation = useNavigation();
    const { isAuthenticated } = useAuth();

    return (
        <TouchableOpacity 
            style={[styles.container, style]} 
            onPress={() => navigation.navigate('NotificationCenter')}
            activeOpacity={0.7}
        >
            <View style={styles.iconWrapper}>
                <Bell size={22} color={color} />
                {isAuthenticated() && badgeCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {badgeCount > 9 ? '9+' : badgeCount}
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
