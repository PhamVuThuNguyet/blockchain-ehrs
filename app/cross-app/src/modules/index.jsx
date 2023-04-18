import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RootScreen from "./Stacks";
import LoginScreen from "./Auth";

import AppLoading from "expo-app-loading";

const Stack = createNativeStackNavigator();

export default function Main() {
  const dispatch = useDispatch();

  const { isAuth } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);

  async function getIsLoggedIn() {
    const state = await AsyncStorage.getItem('@isLoggedIn');
    const isLoggedIn = state === 'true';
    if (isLoggedIn) {
      const userInfo = await AsyncStorage.getItem('@user');
      const user = userInfo ? JSON.parse(userInfo) : {};
      dispatch(login(user));
    }
  }
  
  if (isLoading) {
    return (
      <AppLoading
        startAsync={getIsLoggedIn}
        onFinish={() => setIsLoading(false)}
        onError={console.warn}
      />
    );
  } else {
    return (
      <>
        {/* <ExitApp /> */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuth ? (
            <Stack.Screen name="Root" component={RootScreen} />
          ) : (
            <Stack.Screen name="Auth" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </>
    );
  }
}
