import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Activity, Stethoscope, User } from 'lucide-react-native';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts, 
  BeVietnamPro_400Regular, 
  BeVietnamPro_500Medium, 
  BeVietnamPro_600SemiBold, 
  BeVietnamPro_700Bold 
} from '@expo-google-fonts/be-vietnam-pro';

// Context
import { AuthProvider } from './src/contexts/AuthContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import MonitorScreen from './src/screens/MonitorScreen';
import DoctorScreen from './src/screens/DoctorScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import DiagnosisDetailScreen from './src/screens/DiagnosisDetailScreen';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Trang chủ') return <Home color={color} size={size} />;
          if (route.name === 'Giám sát') return <Activity color={color} size={size} />;
          if (route.name === 'Bác sĩ') return <Stethoscope color={color} size={size} />;
          if (route.name === 'Tài khoản') return <User color={color} size={size} />;
        },
        tabBarActiveTintColor: route.name === 'Giám sát' ? '#3B82F6' : '#2E7D32',
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
      <Tab.Screen name="Trang chủ" component={HomeScreen} />
      <Tab.Screen name="Giám sát" component={MonitorScreen} />
      <Tab.Screen name="Bác sĩ" component={DoctorScreen} />
      <Tab.Screen name="Tài khoản" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

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
    <AuthProvider>
      <NavigationContainer onReady={onLayoutRootView}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="DiagnosisDetail" component={DiagnosisDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
