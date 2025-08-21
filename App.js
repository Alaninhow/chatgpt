import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { theme } from './src/ui';

import LoginScreen from './src/screens/LoginScreen';
import ForgotPassword from './src/screens/ForgotPassword';
import SignUp from './src/screens/SignUp';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: theme.colors?.bg ?? theme.colors?.background ?? DarkTheme.colors.background,
    card:       theme.colors?.bg ?? theme.colors?.background ?? DarkTheme.colors.card,
    primary:    theme.colors?.primary ?? DarkTheme.colors.primary,
    text:       theme.colors?.text ?? DarkTheme.colors.text,
    border:     theme.colors?.border ?? DarkTheme.colors.border,
    notification: theme.colors?.primary ?? DarkTheme.colors.notification,
  },
};

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar barStyle="light-content" backgroundColor={navTheme.colors.background} />
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
