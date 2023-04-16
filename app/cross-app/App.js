import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { LogBox } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CustomStatusBar from "./src/components/layouts/CustomStatusBar";
import Main from "./src/modules";
import { store } from "./src/app/store";
import COLORS from "./src/constants/colors";

LogBox.ignoreAllLogs();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.PRIMARY_COLOR,
    background: COLORS.PRIMARY_COLOR,
    text: COLORS.WHITE_COLOR,
  },
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor="yellow" />
      <Provider store={store}>
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={Main} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}
