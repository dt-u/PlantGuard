import React, { useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './src/api/navigation';
import { Home, Activity, Stethoscope, User } from 'lucide-react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { 
  useFonts, 
  BeVietnamPro_400Regular, 
  BeVietnamPro_500Medium, 
  BeVietnamPro_600SemiBold, 
  BeVietnamPro_700Bold 
} from '@expo-google-fonts/be-vietnam-pro';

// Context
import { AuthProvider } from './src/contexts/AuthContext';
import { NotificationProvider, useNotifications } from './src/contexts/NotificationContext';
import { LanguageProvider, useLanguage } from './src/contexts/LanguageContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import MonitorScreen from './src/screens/MonitorScreen';
import DoctorScreen from './src/screens/DoctorScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import DiagnosisDetailScreen from './src/screens/DiagnosisDetailScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import PrivacySettingsScreen from './src/screens/PrivacySettingsScreen';
import AppSettingsScreen from './src/screens/AppSettingsScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import SystemNotificationsScreen from './src/screens/SystemNotificationsScreen';
import CareRoutinesScreen from './src/screens/CareRoutinesScreen';
import RoutineDetailScreen from './src/screens/RoutineDetailScreen';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const { t } = useLanguage();
  const { unreadCount } = useNotifications();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name;
          let icon;
          
          if (iconName === 'Trang chủ' || iconName === 'Home') icon = <Home color={color} size={size} />;
          if (iconName === 'Giám sát' || iconName === 'Monitor') icon = <Activity color={color} size={size} />;
          if (iconName === 'Bác sĩ' || iconName === 'Doctor') icon = <Stethoscope color={color} size={size} />;
          if (iconName === 'Tài khoản' || iconName === 'Account') icon = <User color={color} size={size} />;

          if (iconName === 'Tài khoản' || iconName === 'Account') {
            return (
              <View style={{ width: size, height: size }}>
                {icon}
                {unreadCount > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            );
          }
          return icon;
        },
        tabBarActiveTintColor: (route.name === 'Giám sát' || route.name === 'Monitor') ? '#3B82F6' : '#2E7D32',
        tabBarInactiveTintColor: '#94A3B8',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 8,
          height: 65,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
        },
        tabBarLabelStyle: {
          fontFamily: 'Vietnam-Medium',
          fontSize: 10,
          marginBottom: 4,
        }
      })}
    >
      <Tab.Screen 
        name="Trang chủ" 
        component={HomeScreen} 
        options={{ tabBarLabel: t('tabs.home') }}
      />
      <Tab.Screen 
        name="Giám sát" 
        component={MonitorScreen} 
        options={{ tabBarLabel: t('tabs.monitor') }}
      />
      <Tab.Screen 
        name="Bác sĩ" 
        component={DoctorScreen} 
        options={{ tabBarLabel: t('tabs.doctor') }}
      />
      <Tab.Screen 
        name="Tài khoản" 
        component={ProfileScreen} 
        options={{ tabBarLabel: t('tabs.profile') }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#EF4444',
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontFamily: 'Vietnam-Bold',
    includeFontPadding: false,
  },
});

export default function App() {
  const [fontsLoaded] = useFonts({
    'Vietnam-Regular': BeVietnamPro_400Regular,
    'Vietnam-Medium': BeVietnamPro_500Medium,
    'Vietnam-SemiBold': BeVietnamPro_600SemiBold,
    'Vietnam-Bold': BeVietnamPro_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <NavigationContainer ref={navigationRef} onReady={onLayoutRootView}>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MainTabs" component={TabNavigator} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="History" component={HistoryScreen} />
                <Stack.Screen name="DiagnosisDetail" component={DiagnosisDetailScreen} />
                <Stack.Screen name="Notifications" component={NotificationSettingsScreen} />
                <Stack.Screen name="NotificationCenter" component={SystemNotificationsScreen} />
                <Stack.Screen name="Privacy" component={PrivacySettingsScreen} />
                <Stack.Screen name="AppSettings" component={AppSettingsScreen} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                <Stack.Screen name="CareRoutines" component={CareRoutinesScreen} />
                <Stack.Screen name="RoutineDetail" component={RoutineDetailScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
