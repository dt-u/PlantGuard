import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Leaf, Eye, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nông Nghiệp</Text>
        <Text style={[styles.title, styles.greenText]}>Thông Minh</Text>
        <Text style={styles.subtitle}>
          PlantGuard bảo vệ mùa màng của bạn bằng AI. Phát hiện bệnh sớm và giám sát đồng ruộng thời gian thực.
        </Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('Giám sát')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
            <Eye color="#1E88E5" size={32} />
          </View>
          <Text style={styles.cardTitle}>Chế độ Giám sát</Text>
          <Text style={styles.cardDesc}>Phân tích Drone footage phát hiện cây bị stress và các điểm nóng trên cánh đồng lớn.</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.footerText}>Bắt đầu Giám sát</Text>
            <ArrowRight color="#1E88E5" size={16} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Bác sĩ')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
            <Leaf color="#2E7D32" size={32} />
          </View>
          <Text style={styles.cardTitle}>Bác sĩ Cây trồng</Text>
          <Text style={styles.cardDesc}>Chẩn đoán bệnh trực tiếp qua ảnh lá và nhận ngay phác đồ điều trị chi tiết.</Text>
          <View style={styles.cardFooter}>
            <Text style={[styles.footerText, { color: '#2E7D32' }]}>Chẩn đoán ngay</Text>
            <ArrowRight color="#2E7D32" size={16} />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 44,
  },
  greenText: {
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 15,
    maxWidth: 300,
  },
  grid: {
    width: '100%',
    gap: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 20,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E88E5',
  }
});

export default HomeScreen;
