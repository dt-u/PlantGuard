import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    Image, 
    TouchableOpacity, 
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import axios from 'axios';
import { ENDPOINTS, API_BASE_URL } from '../api/config';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useDiseaseTranslator } from '../hooks/useDiseaseTranslator';
import { useHistorySync } from '../hooks/useHistorySync';
import { ArrowLeft, Calendar, ChevronRight, AlertCircle, Trash2 } from 'lucide-react-native';

const HistoryScreen = ({ navigation }) => {
    const { user } = useAuth();
    const { language, t } = useLanguage();
    const { translateDiseaseName } = useDiseaseTranslator();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const content = {
        vi: {
            title: "Lịch sử chẩn đoán",
            empty_title: "Chưa có lịch sử",
            empty_subtitle: "Các kết quả chẩn đoán của bạn sẽ xuất hiện tại đây",
            confidence: "Độ tin cậy"
        },
        en: {
            title: "Diagnosis History",
            empty_title: "No History Yet",
            empty_subtitle: "Your diagnosis results will appear here",
            confidence: "Confidence"
        }
    }[language] || {
        title: "Diagnosis History",
        empty_title: "No History Yet",
        empty_subtitle: "Your diagnosis results will appear here",
        confidence: "Confidence"
    };

    // Sync remote updates
    useHistorySync(
        () => {
            fetchHistory();
        },
        (deletedId) => {
            setHistory(prev => prev.filter(item => item.id !== deletedId));
        }
    );

    const fetchHistory = async () => {
        if (!user) return;
        
        try {
            const response = await axios.get(`${ENDPOINTS.HISTORY_LIST}?user_id=${user.id}`);
            // Check if response.data.data exists (API returns {success, data, total, message})
            if (response.data && response.data.data) {
                setHistory(response.data.data);
            } else if (Array.isArray(response.data)) {
                setHistory(response.data);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(ENDPOINTS.HISTORY_DELETE(id));
            setHistory(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting history item:', error);
        }
    };

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

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.historyCard}
            onPress={() => navigation.navigate('DiagnosisDetail', { diagnosis: item })}
            activeOpacity={0.7}
        >
            <Image 
                source={{ uri: item.image_url.startsWith('http') ? item.image_url : `${API_BASE_URL}${item.image_url}` }} 
                style={styles.cardImage} 
            />
            <View style={styles.cardInfo}>
                <Text style={styles.diseaseName} numberOfLines={1}>
                    {translateDiseaseName(item.disease_slug || item.disease_name, item.disease_name)}
                </Text>
                <View style={styles.dateContainer}>
                    <Calendar size={12} color="#94A3B8" />
                    <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
                </View>
                <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>{content.confidence}: {(item.confidence * 100).toFixed(1)}%</Text>
                </View>
            </View>
            <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteItem(item.id)}
            >
                <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color="#1E293B" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{content.title}</Text>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#2E7D32" />
                </View>
            ) : history.length === 0 ? (
                <View style={styles.centerContainer}>
                    <AlertCircle size={48} color="#CBD5E1" />
                    <Text style={styles.emptyTitle}>{content.empty_title}</Text>
                    <Text style={styles.emptySubtitle}>{content.empty_subtitle}</Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={item => item.id || item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E7D32']} />
                    }
                />
            )}
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
    listContent: {
        padding: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    historyCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardImage: {
        width: 70,
        height: 70,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
    },
    cardInfo: {
        flex: 1,
        marginLeft: 14,
    },
    diseaseName: {
        fontSize: 16,
        fontFamily: 'Vietnam-Bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    dateText: {
        fontSize: 12,
        fontFamily: 'Vietnam-Medium',
        color: '#94A3B8',
        marginLeft: 4,
    },
    confidenceBadge: {
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    confidenceText: {
        fontSize: 10,
        fontFamily: 'Vietnam-Bold',
        color: '#2E7D32',
    },
    deleteButton: {
        padding: 10,
    },
    emptyTitle: {
        fontSize: 18,
        fontFamily: 'Vietnam-Bold',
        color: '#475569',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        fontFamily: 'Vietnam-Regular',
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default HistoryScreen;
