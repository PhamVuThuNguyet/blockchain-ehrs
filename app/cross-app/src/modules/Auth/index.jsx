import React, { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/core';
import LoginScreen from './screens/Login';

const AuthStack = createNativeStackNavigator();

export default function AuthStackNagivation() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name='Login'
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
    </AuthStack.Navigator>
  );
}