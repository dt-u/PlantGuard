import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = ({ text }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={styles.text}>{text || "Đang xử lý..."}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    text: {
        marginTop: 15,
        fontSize: 16,
        color: '#2E7D32',
        fontFamily: 'Vietnam-SemiBold',
    }
});

export default Loader;
