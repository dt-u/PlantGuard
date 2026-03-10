import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TreatmentCard = ({ treatments }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    if (!treatments || !Array.isArray(treatments)) return null;

    const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const getLevelInfo = (level) => {
        switch (level.toLowerCase()) {
            case 'mild': return { label: 'Nhẹ', color: '#10B981', icon: <CheckCircle size={18} color="#10B981" /> };
            case 'moderate': return { label: 'Trung Bình', color: '#F59E0B', icon: <AlertTriangle size={18} color="#F59E0B" /> };
            case 'severe': return { label: 'Nặng', color: '#EF4444', icon: <XCircle size={18} color="#EF4444" /> };
            case 'maintenance': return { label: 'Chăm Sóc', color: '#2E7D32', icon: <CheckCircle size={18} color="#2E7D32" /> };
            default: return { label: level, color: '#6B7280', icon: <Info size={18} color="#6B7280" /> };
        }
    };

    return (
        <View style={styles.container}>
            {treatments.map((item, index) => {
                const info = getLevelInfo(item.level);
                const isExpanded = expandedIndex === index;

                return (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        onPress={() => toggleExpand(index)}
                        style={[
                            styles.card,
                            { borderLeftColor: info.color },
                            isExpanded && styles.expandedCard
                        ]}
                    >
                        <View style={styles.header}>
                            <View style={styles.badgeRow}>
                                <View style={[styles.badge, { backgroundColor: info.color + '15' }]}>
                                    {info.icon}
                                    <Text style={[styles.badgeText, { color: info.color }]}>{info.label}</Text>
                                </View>
                            </View>
                            {isExpanded ? <ChevronUp size={20} color="#9CA3AF" /> : <ChevronDown size={20} color="#9CA3AF" />}
                        </View>

                        <Text style={styles.mainAction} numberOfLines={isExpanded ? 0 : 2}>
                            {item.action}
                        </Text>

                        {isExpanded && (
                            <View style={styles.expandedContent}>
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
                                        <Text style={styles.sectionTitle}>Cách nhận biết</Text>
                                    </View>
                                    <Text style={styles.guideText}>"{item.identification_guide}"</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitleSmall}>Sản phẩm khuyên dùng</Text>
                                    <View style={styles.productBox}>
                                        <Text style={styles.productName}>{item.product || 'N/A'}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        
                        {!isExpanded && (
                            <Text style={styles.tapHint}>Nhấn để xem chi tiết</Text>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 12,
        marginTop: 10,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderLeftWidth: 5,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    expandedCard: {
        borderColor: '#E5E7EB',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    badgeRow: {
        flexDirection: 'row',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 6,
    },
    badgeText: {
        fontSize: 12,
        fontFamily: 'Inter-Bold',
        textTransform: 'uppercase',
    },
    mainAction: {
        fontSize: 15,
        color: '#1F2937',
        fontFamily: 'Inter-SemiBold',
        lineHeight: 22,
    },
    expandedContent: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        gap: 15,
    },
    section: {
        gap: 6,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Inter-Bold',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionTitleSmall: {
        fontSize: 11,
        fontFamily: 'Inter-Bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },
    guideText: {
        fontSize: 14,
        color: '#4B5563',
        fontFamily: 'Inter-Regular',
        fontStyle: 'italic',
        lineHeight: 20,
        backgroundColor: '#F9FAFB',
        padding: 10,
        borderRadius: 8,
    },
    productBox: {
        backgroundColor: '#F0FDF4',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DCFCE7',
    },
    productName: {
        fontSize: 14,
        color: '#166534',
        fontFamily: 'Inter-Bold',
    },
    tapHint: {
        fontSize: 11,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'Inter-Medium',
    }
});

export default TreatmentCard;
