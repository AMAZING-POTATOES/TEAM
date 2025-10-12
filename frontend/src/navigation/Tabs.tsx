import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FridgeScreen from '../screens/FridgeScreen';
import RecipeScreen from '../screens/RecipeScreen';
import BoardScreen from '../screens/BoardScreen';
import MyPageScreen from '../screens/MyPageScreen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 6, backgroundColor: '#F8FAF7' },
      tabBarActiveTintColor: '#31C553',
      tabBarInactiveTintColor: '#8C8C8C',
    }}>
      <Tab.Screen name="냉장고" component={FridgeScreen}
        options={{ tabBarIcon: () => <Text>🌡️</Text> }} />
      <Tab.Screen name="레시피" component={RecipeScreen}
        options={{ tabBarIcon: () => <Text>🍲</Text> }} />
      <Tab.Screen name="게시판" component={BoardScreen}
        options={{ tabBarIcon: () => <Text>📝</Text> }} />
      <Tab.Screen name="마이페이지" component={MyPageScreen}
        options={{ tabBarIcon: () => <Text>👤</Text> }} />
    </Tab.Navigator>
  );
}
