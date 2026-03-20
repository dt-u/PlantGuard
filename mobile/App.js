import React, { useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Activity, Stethoscope } from 'lucide-react-native';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts, 
  BeVietnamPro_400Regular, 
  BeVietnamPro_500Medium, 
  BeVietnamPro_600SemiBold, 
  BeVietnamPro_700Bold 
} from '@expo-google-fonts/be-vietnam-pro';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import MonitorScreen from './src/screens/MonitorScreen';
import DoctorScreen from './src/screens/DoctorScreen';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

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
    <NavigationContainer onReady={onLayoutRootView}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Trang chủ') return <Home color={color} size={size} />;
            if (route.name === 'Giám sát') return <Activity color={color} size={size} />;
            if (route.name === 'Bác sĩ') return <Stethoscope color={color} size={size} />;
          },
          tabBarActiveTintColor: route.name === 'Giám sát' ? '#3B82F6' : '#2E7D32',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            paddingBottom: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontFamily: 'Vietnam-Medium',
            fontSize: 10,
          }
        })}
      >
        <Tab.Screen name="Trang chủ" component={HomeScreen} />
        <Tab.Screen name="Giám sát" component={MonitorScreen} />
        <Tab.Screen name="Bác sĩ" component={DoctorScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
