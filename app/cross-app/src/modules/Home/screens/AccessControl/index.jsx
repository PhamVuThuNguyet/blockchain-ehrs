import React from "react";
import { Text } from "react-native";
import Request from "./screens/Request";
import Revoke from "./screens/Revoke";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import COLORS from "@src/constants/colors";

const Tab = createMaterialTopTabNavigator();

export default function AccessControl() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14, color: COLORS.WHITE_COLOR },
        tabBarIndicatorStyle: { backgroundColor: COLORS.BLUE_COLOR, height: 3 },
        tabBarStyle: { backgroundColor: COLORS.PRIMARY_COLOR },
      }}
    >
      <Tab.Screen name="Request" component={Request} />
      <Tab.Screen name="Revoke" component={Revoke} />
    </Tab.Navigator>
  );
}
