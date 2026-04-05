import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ScreenHeader = ({ 
    title, 
    subtitle, 
    leftElement, 
    rightElement, 
    backgroundColor = 'transparent',
    paddingHorizontal = 20,
    containerStyle,
    titleStyle,
    subtitleStyle
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[
            styles.container, 
            { 
                backgroundColor, 
                paddingTop: insets.top + 15,
                paddingHorizontal,
                paddingBottom: 15
            },
            containerStyle
        ]}>
            <View style={styles.headerLeft}>
                {leftElement || (
                    <View style={styles.titleContainer}>
                        {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
                        {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
                    </View>
                )}
            </View>
            <View style={styles.headerRight}>
                {rightElement}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        zIndex: 100,
    },
    headerLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleContainer: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Vietnam-Bold',
        color: '#111827',
    },
    subtitle: {
        fontSize: 13,
        fontFamily: 'Vietnam-Regular',
        color: '#6B7280',
        marginTop: 2,
    }
});

export default ScreenHeader;
