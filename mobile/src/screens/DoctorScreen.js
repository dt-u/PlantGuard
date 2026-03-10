import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Camera, AlertCircle, RefreshCw, Cross, Hospital, CheckCircle, Info } from 'lucide-react-native';
import { API_BASE_URL, ENDPOINTS } from '../api/config';
import TreatmentCard from '../components/TreatmentCard';

const { width } = Dimensions.get('window');

const DoctorScreen = () => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            handleUpload(result.assets[0]);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Quyền truy cập bị từ chối', 'Ứng dụng cần quyền truy cập camera để chụp ảnh.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            handleUpload(result.assets[0]);
        }
    };

    const handleUpload = async (fileAsset) => {
        setLoading(true);
        setResult(null);
        setImage(fileAsset.uri);

        const formData = new FormData();
        formData.append('file', {
            uri: fileAsset.uri,
            name: 'photo.jpg',
            type: 'image/jpeg',
        });

        try {
            const response = await axios.post(ENDPOINTS.DIAGNOSE, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(response.data);
        } catch (err) {
            console.error(err);
            Alert.alert('Lỗi', 'Không thể kết nối với máy chủ. Vui lòng kiểm tra địa chỉ IP trong config.js');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setImage(null);
        setResult(null);
    };

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Bác Sĩ Cây Trồng</Text>
                <Text style={styles.subtitle}>Chẩn đoán sức khỏe lá cây tức thì bằng công nghệ AI chuyên sâu.</Text>
            </View>

            {!image && !loading && (
                <View style={styles.uploadSection}>
                    <TouchableOpacity style={styles.mainUploadBtn} onPress={takePhoto}>
                        <View style={styles.iconCircle}>
                            <Camera color="#FFFFFF" size={32} />
                        </View>
                        <Text style={styles.btnTextLarge}>Chụp ảnh lá cây</Text>
                        <Text style={styles.btnSubtext}>Phân tích trực tiếp từ camera</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryUploadBtn} onPress={pickImage}>
                        <Text style={styles.btnTextSmall}>Chọn ảnh từ thư viện</Text>
                    </TouchableOpacity>
                </View>
            )}

            {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#2E7D32" />
                    <Text style={styles.loaderText}>Đang phân tích cấu trúc lá và mầm bệnh...</Text>
                </View>
            )}

            {result && (
                <View style={styles.resultSection}>
                    {/* Analysis Summary Card */}
                    <View style={styles.analysisCard}>
                        <View style={styles.imageWrapper}>
                            <Image source={{ uri: `${API_BASE_URL}${result.image_url}` }} style={styles.analyzedImage} />
                            <View style={styles.imageOverlay}>
                                <Text style={styles.overlayText}>HÌNH ẢNH CHẨN ĐOÁN</Text>
                            </View>
                        </View>
                        
                        <View style={styles.infoContainer}>
                            <Text style={styles.labelSmall}>KẾT QUẢ NHẬN DIỆN AI</Text>
                            <Text style={styles.diseaseName}>{result.disease.common_name}</Text>
                            
                            <View style={styles.confidenceRow}>
                                <View style={styles.progressBarContainer}>
                                    <View style={[styles.progressFill, { width: `${result.confidence * 100}%` }]} />
                                </View>
                                <Text style={styles.confidencePercentage}>{(result.confidence * 100).toFixed(1)}%</Text>
                            </View>

                            <View style={styles.techDetails}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>MÔ TẢ BỆNH LÝ</Text>
                                    <Text style={styles.descriptionText}>"{result.disease.description}"</Text>
                                </View>

                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>DẤU HIỆU NHẬN BIẾT</Text>
                                    <View style={styles.symptomsList}>
                                        {result.disease.symptoms.map((s, i) => (
                                            <View key={i} style={styles.symptomItem}>
                                                <CheckCircle size={14} color="#2E7D32" />
                                                <Text style={styles.symptomText}>{s}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.resetBtn} onPress={reset}>
                                <RefreshCw color="#6B7280" size={16} />
                                <Text style={styles.resetBtnText}>Kiểm tra lá khác</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Treatment Section */}
                    <View style={[styles.treatmentSection, { borderTopColor: result.disease.is_healthy ? '#2E7D32' : '#F56565' }]}>
                        <View style={styles.treatmentHeader}>
                            {result.disease.is_healthy ? (
                                <>
                                    <Cross color="#2E7D32" size={24} />
                                    <Text style={[styles.treatmentTitle, { color: '#2E7D32' }]}>Kế hoạch Chăm sóc</Text>
                                </>
                            ) : (
                                <>
                                    <Hospital color="#F56565" size={24} />
                                    <Text style={[styles.treatmentTitle, { color: '#F56565' }]}>Phác đồ Điều trị Hệ thống</Text>
                                </>
                            )}
                        </View>
                        <TreatmentCard treatments={result.disease.treatments} />
                    </View>

                    {/* Enhanced Disclaimer */}
                    <View style={styles.disclaimerCard}>
                        <View style={styles.disclaimerHeader}>
                            <View style={styles.warningCircle}>
                                <Info color="#92400E" size={16} />
                            </View>
                            <Text style={styles.disclaimerTitle}>KHUYẾN CÁO CHUYÊN MÔN</Text>
                        </View>
                        <Text style={styles.disclaimerBody}>
                            Kỹ thuật này dựa trên mô hình học sâu (Deep Learning). Kết quả có thể biến động tùy theo chất lượng ảnh và giống cây.{"\n\n"}
                            <Text style={styles.disclaimerBold}>Vui lòng tham vấn chuyên gia trước khi áp dụng hóa chất bảo vệ thực vật diện rộng.</Text>
                        </Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
        backgroundColor: '#F3F4F6',
    },
    header: {
        marginBottom: 25,
    },
    title: {
        fontSize: 32,
        fontFamily: 'Inter-Bold',
        color: '#111827',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        fontFamily: 'Inter-Regular',
        color: '#6B7280',
        marginTop: 6,
        lineHeight: 22,
    },
    uploadSection: {
        marginTop: 20,
        gap: 16,
    },
    mainUploadBtn: {
        backgroundColor: '#2E7D32',
        borderRadius: 28,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    btnTextLarge: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: 'Inter-Bold',
    },
    btnSubtext: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        marginTop: 4,
    },
    secondaryUploadBtn: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    btnTextSmall: {
        color: '#374151',
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
    },
    loaderContainer: {
        marginTop: 80,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 40,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    loaderText: {
        marginTop: 20,
        color: '#374151',
        fontSize: 15,
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
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
        fontFamily: 'Inter-Bold',
        letterSpacing: 1,
    },
    infoContainer: {
        padding: 24,
    },
    labelSmall: {
        fontSize: 11,
        fontFamily: 'Inter-Bold',
        color: '#9CA3AF',
        letterSpacing: 1,
        marginBottom: 6,
    },
    diseaseName: {
        fontSize: 26,
        fontFamily: 'Inter-Bold',
        color: '#111827',
        lineHeight: 32,
    },
    confidenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 15,
        marginBottom: 25,
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
        fontFamily: 'Inter-Bold',
        color: '#10B981',
    },
    techDetails: {
        gap: 20,
        marginBottom: 25,
    },
    detailItem: {
        gap: 8,
    },
    detailLabel: {
        fontSize: 12,
        fontFamily: 'Inter-Bold',
        color: '#374151',
        opacity: 0.5,
    },
    descriptionText: {
        fontSize: 15,
        color: '#4B5563',
        fontFamily: 'Inter-Medium',
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
        fontFamily: 'Inter-Regular',
    },
    resetBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 14,
        marginTop: 10,
    },
    resetBtnText: {
        fontSize: 15,
        color: '#4B5563',
        fontFamily: 'Inter-SemiBold',
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
        fontFamily: 'Inter-Bold',
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
        fontFamily: 'Inter-Bold',
        color: '#92400E',
        letterSpacing: 0.5,
    },
    disclaimerBody: {
        fontSize: 13,
        color: '#92400E',
        lineHeight: 19,
        fontFamily: 'Inter-Regular',
        opacity: 0.8,
    },
    disclaimerBold: {
        fontFamily: 'Inter-Bold',
        textDecorationLine: 'underline',
    }
});

export default DoctorScreen;
