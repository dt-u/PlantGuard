import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Linking } from 'react-native';
import { ArrowLeft, Calendar, CheckCircle, Info, Cross, Hospital } from 'lucide-react-native';
import { API_BASE_URL } from '../api/config';
import TreatmentCard from '../components/TreatmentCard';
import { useLanguage } from '../contexts/LanguageContext';
import { useDiseaseTranslator } from '../hooks/useDiseaseTranslator';

const { width } = Dimensions.get('window');

const DiagnosisDetailScreen = ({ route, navigation }) => {
    const { diagnosis } = route.params;
    const { t } = useLanguage();
    const { translateDiseaseName, translateDescription, translateSymptoms, translateTreatments } = useDiseaseTranslator();

    const openPurchaseLink = (treatment) => {
        const targetUrl = treatment.affiliate_url || 
                         `https://shopee.vn/search?keyword=${encodeURIComponent(treatment.search_fallback_keyword || treatment.product_name || treatment.product || treatment.name)}`;
        
        Linking.canOpenURL(targetUrl).then(supported => {
            if (supported) {
                Linking.openURL(targetUrl);
            }
        });
    };

    if (!diagnosis) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color="#1E293B" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('history.detail_title') || 'Chi tiết chẩn đoán'}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.resultSection}>
                    {/* Analysis Summary Card */}
                    <View style={styles.analysisCard}>
                        <View style={styles.imageWrapper}>
                            <Image 
                                source={{ uri: diagnosis.image_url.startsWith('http') ? diagnosis.image_url : `${API_BASE_URL}${diagnosis.image_url}` }} 
                                style={styles.analyzedImage} 
                            />
                            <View style={styles.imageOverlay}>
                                <Text style={styles.overlayText}>{t('doctor.analysis_result').toUpperCase()}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.infoContainer}>
                            <View style={styles.dateRow}>
                                <Calendar size={14} color="#94A3B8" />
                                <Text style={styles.dateText}>{formatDate(diagnosis.created_at)}</Text>
                            </View>

                            <Text style={styles.labelSmall}>{t('doctor.analysis_result').toUpperCase()}</Text>
                            <Text style={styles.diseaseName}>
                                {translateDiseaseName(diagnosis.disease_slug || diagnosis.disease_name, diagnosis.disease_name)}
                            </Text>
                            
                            <View style={styles.confidenceRow}>
                                <View style={styles.progressBarContainer}>
                                    <View style={[styles.progressFill, { width: `${diagnosis.confidence * 100}%` }]} />
                                </View>
                                <Text style={styles.confidencePercentage}>{(diagnosis.confidence * 100).toFixed(1)}%</Text>
                            </View>

                            <View style={styles.techDetails}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>{t('doctor.description').toUpperCase()}</Text>
                                    <Text style={styles.descriptionText}>
                                        "{translateDescription(diagnosis.disease_slug || diagnosis.disease_name, diagnosis.description)}"
                                    </Text>
                                </View>

                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>{t('doctor.symptoms').toUpperCase()}</Text>
                                    <View style={styles.symptomsList}>
                                        {translateSymptoms(diagnosis.disease_slug || diagnosis.disease_name, diagnosis.symptoms || []).map((s, i) => (
                                            <View key={i} style={styles.symptomItem}>
                                                <CheckCircle size={14} color="#2E7D32" />
                                                <Text style={styles.symptomText}>{s}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Treatment Section */}
                    <View style={[styles.treatmentSection, { borderTopColor: diagnosis.is_healthy ? '#2E7D32' : '#F56565' }]}>
                        <View style={styles.treatmentHeader}>
                            {diagnosis.is_healthy ? (
                                <>
                                    <Cross color="#2E7D32" size={24} />
                                    <Text style={[styles.treatmentTitle, { color: '#2E7D32' }]}>{t('doctor.care_plan')}</Text>
                                </>
                            ) : (
                                <>
                                    <Hospital color="#F56565" size={24} />
                                    <Text style={[styles.treatmentTitle, { color: '#F56565' }]}>{t('doctor.treatment_plan')}</Text>
                                </>
                            )}
                        </View>
                        <TreatmentCard 
                            treatments={translateTreatments(diagnosis.disease_slug || diagnosis.disease_name, diagnosis.treatments || [])} 
                            diseaseKey={diagnosis.disease_slug || diagnosis.disease_name}
                            onBuyPress={openPurchaseLink}
                            imageUrl={diagnosis.image_url.startsWith('http') ? diagnosis.image_url : `${API_BASE_URL}${diagnosis.image_url}`}
                        />
                    </View>

                    {/* Enhanced Disclaimer */}
                    <View style={styles.disclaimerCard}>
                        <View style={styles.disclaimerHeader}>
                            <View style={styles.warningCircle}>
                                <Info color="#92400E" size={16} />
                            </View>
                            <Text style={styles.disclaimerTitle}>{t('doctor.recommendation').toUpperCase()}</Text>
                        </View>
                        <Text style={styles.disclaimerBody}>
                            {t('doctor.recommendation_desc')}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Vietnam-Bold',
        color: '#1E293B',
        marginLeft: 16,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    resultSection: {
        gap: 20,
    },
    analysisCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    imageWrapper: {
        width: '100%',
        height: 220,
        position: 'relative',
    },
    analyzedImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F3F4F6',
    },
    imageOverlay: {
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: 'rgba(17, 24, 39, 0.7)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    overlayText: {
        color: '#10B981',
        fontSize: 10,
        fontFamily: 'Vietnam-Bold',
        letterSpacing: 1,
    },
    infoContainer: {
        padding: 24,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    dateText: {
        fontSize: 13,
        fontFamily: 'Vietnam-Medium',
        color: '#94A3B8',
    },
    labelSmall: {
        fontSize: 11,
        fontFamily: 'Vietnam-Bold',
        color: '#9CA3AF',
        letterSpacing: 1,
        marginBottom: 6,
    },
    diseaseName: {
        fontSize: 26,
        fontFamily: 'Vietnam-Bold',
        color: '#111827',
        lineHeight: 32,
    },
    confidenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 15,
        marginBottom: 20,
    },
    progressBarContainer: {
        flex: 1,
        height: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#10B981',
    },
    confidencePercentage: {
        fontSize: 16,
        fontFamily: 'Vietnam-Bold',
        color: '#10B981',
    },
    techDetails: {
        gap: 20,
    },
    detailItem: {
        gap: 8,
    },
    detailLabel: {
        fontSize: 12,
        fontFamily: 'Vietnam-Bold',
        color: '#374151',
        opacity: 0.5,
    },
    descriptionText: {
        fontSize: 15,
        color: '#4B5563',
        fontFamily: 'Vietnam-Medium',
        fontStyle: 'italic',
        lineHeight: 22,
        borderLeftWidth: 3,
        borderLeftColor: '#10B98120',
        paddingLeft: 12,
    },
    symptomsList: {
        gap: 8,
    },
    symptomItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    symptomText: {
        fontSize: 14,
        color: '#4B5563',
        fontFamily: 'Vietnam-Regular',
    },
    treatmentSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        borderTopWidth: 6,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    treatmentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    treatmentTitle: {
        fontSize: 22,
        fontFamily: 'Vietnam-Bold',
    },
    disclaimerCard: {
        backgroundColor: '#FFFBEB',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    disclaimerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    warningCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    disclaimerTitle: {
        fontSize: 12,
        fontFamily: 'Vietnam-Bold',
        color: '#92400E',
        letterSpacing: 0.5,
    },
    disclaimerBody: {
        fontSize: 13,
        color: '#92400E',
        lineHeight: 19,
        fontFamily: 'Vietnam-Regular',
        opacity: 0.8,
    },
    disclaimerBold: {
        fontFamily: 'Vietnam-Bold',
        textDecorationLine: 'underline',
    }
});

export default DiagnosisDetailScreen;
