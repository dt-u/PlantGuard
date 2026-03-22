import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { AlertCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp, Beaker, ShieldCheck, Zap } from 'lucide-react-native';
import { useLanguage } from '../contexts/LanguageContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TreatmentCard = ({ treatments = [], diseaseKey }) => {
    const { t, language } = useLanguage();
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const getSeverityStyles = (level) => {
        const lowerLevel = (level || '').toLowerCase();
        if (lowerLevel.includes('nhẹ') || lowerLevel.includes('mild') || lowerLevel.includes('duy trì') || lowerLevel.includes('maintenance')) {
            return { color: '#10B981', bg: '#F0FDF4', icon: <CheckCircle2 size={18} color="#10B981" />, label: t('treatment.mild') };
        }
        if (lowerLevel.includes('trung bình') || lowerLevel.includes('moderate')) {
            return { color: '#F59E0B', bg: '#FFFBEB', icon: <AlertCircle size={18} color="#F59E0B" />, label: t('treatment.moderate') };
        }
        if (lowerLevel.includes('nặng') || lowerLevel.includes('severe')) {
            return { color: '#EF4444', bg: '#FEF2F2', icon: <XCircle size={18} color="#EF4444" />, label: t('treatment.severe') };
        }
        return { color: '#6B7280', bg: '#F3F4F6', icon: <Zap size={18} color="#6B7280" />, label: level };
    };

    // Helper to get translated treatment item
    const getTranslatedTreatment = (item, index) => {
        if (language === 'vi') return item;

        const diseaseDetails = t(`disease_details.${diseaseKey}`);
        if (typeof diseaseDetails === 'object' && diseaseDetails.treatments) {
            // Find corresponding treatment by level index or level name
            const translatedItem = diseaseDetails.treatments[index] || 
                                 diseaseDetails.treatments.find(tr => tr.level.toLowerCase() === (item.level || '').toLowerCase());
            
            if (translatedItem) {
                return {
                    ...item,
                    identification_guide: translatedItem.identification_guide || item.identification_guide,
                    action: translatedItem.action || item.action,
                    product: translatedItem.product || item.product,
                    level: translatedItem.level || item.level
                };
            }
        }
        return item;
    };

    return (
        <View style={styles.container}>
            {treatments.map((rawItem, index) => {
                const item = getTranslatedTreatment(rawItem, index);
                const isExpanded = expandedIndex === index;
                const severity = getSeverityStyles(item.level || item.severity);

                return (
                    <View key={index} style={[styles.card, isExpanded && styles.expandedCard]}>
                        <TouchableOpacity 
                            style={[styles.header, { backgroundColor: severity.bg }]} 
                            onPress={() => toggleExpand(index)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.headerLeft}>
                                {severity.icon}
                                <Text style={[styles.levelText, { color: severity.color }]}>
                                    {severity.label}
                                </Text>
                            </View>
                            {isExpanded ? <ChevronUp size={20} color="#9CA3AF" /> : <ChevronDown size={20} color="#9CA3AF" />}
                        </TouchableOpacity>

                        <View style={styles.content}>
                            <Text style={styles.actionText} numberOfLines={isExpanded ? 0 : 2}>
                                {item.action || item.name}
                            </Text>
                            
                            {isExpanded && (
                                <View style={styles.details}>
                                    <View style={styles.divider} />
                                    
                                    <View style={styles.detailItem}>
                                        <View style={styles.detailHeader}>
                                            <ShieldCheck size={14} color="#6B7280" />
                                            <Text style={styles.detailLabel}>{t('treatment.id_guide')}</Text>
                                        </View>
                                        <Text style={styles.detailText}>{item.identification_guide || item.description}</Text>
                                    </View>

                                    <View style={styles.detailItem}>
                                        <View style={styles.detailHeader}>
                                            <Beaker size={14} color="#6B7280" />
                                            <Text style={styles.detailLabel}>{t('treatment.product')}</Text>
                                        </View>
                                        <View style={styles.productBadge}>
                                            <Text style={styles.productText}>{item.product}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {!isExpanded && (
                                <Text style={styles.clickHint}>{t('treatment.click_detail')}</Text>
                            )}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { gap: 12 },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    expandedCard: {
        borderColor: '#E5E7EB',
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    levelText: {
        fontSize: 13,
        fontFamily: 'Vietnam-Bold',
        letterSpacing: 0.5,
    },
    content: {
        padding: 16,
    },
    actionText: {
        fontSize: 15,
        fontFamily: 'Vietnam-Bold',
        color: '#1F2937',
        lineHeight: 22,
    },
    clickHint: {
        fontSize: 11,
        fontFamily: 'Vietnam-Medium',
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 12,
    },
    details: {
        marginTop: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 16,
    },
    detailItem: {
        marginBottom: 16,
    },
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    detailLabel: {
        fontSize: 11,
        fontFamily: 'Vietnam-Bold',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailText: {
        fontSize: 13,
        fontFamily: 'Vietnam-Regular',
        color: '#4B5563',
        lineHeight: 18,
        paddingLeft: 20,
    },
    productBadge: {
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        marginLeft: 20,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    productText: {
        fontSize: 13,
        fontFamily: 'Vietnam-Bold',
        color: '#065F46',
    }
});

export default TreatmentCard;