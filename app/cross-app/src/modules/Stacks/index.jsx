import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Text } from 'react-native';
import Home from "../Home";
import { View, Text, Image, ScrollView, TextInput } from "react-native";

const Stack = createNativeStackNavigator();

export default function RootStackNagivation() {
  const dispatch = useDispatch();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'yellow' } }}>
      <Stack.Screen name="HomeStack" component={Home} />
    </Stack.Navigator>
  );
}
