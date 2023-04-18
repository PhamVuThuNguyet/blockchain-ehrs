import React from "react";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import AccessControl from "./screens/AccessControl";
import AccessHistory from "./screens/AccessHistory";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import Header from "../../components/layouts/Header";
import COLORS from "../../constants/colors";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const tabScreenOptions = ({ route }) => ({
    headerShown: true,
    tabBarStyle: {
      paddingHorizontal: 5,
      paddingTop: 0,
      backgroundColor: COLORS.BOTTOM_BAR_COLOR,
      position: "absolute",
      borderTopWidth: 0,
      shadowOffset: {
        width: 10,
        height: -5,
      },
      shadowOpacity: 0.35,
      shadowRadius: 16.0,
    },
  });

  const options = {
    tabBarShowLabel: false,
  };

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={({ navigation, route }) => ({
          ...options,
          header: (props) => <Header navigation={navigation} title="Home" />,
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <Icon
              color={
                focused
                  ? COLORS.BOTTOM_BAR_FOCUSED_ICON_COLOR
                  : COLORS.BOTTOM_BAR_ICON_COLOR
              }
              name={focused ? "home" : "home-outline"}
              size={26}
              type="ionicon"
            />
          ),
        })}
      />
      <Tab.Screen
        name="AccessControl"
        component={AccessControl}
        options={({ navigation, route }) => ({
          ...options,
          header: (props) => (
            <Header navigation={navigation} title="ACCESS CONTROL" />
          ),
          tabBarLabel: "Access Control",
          tabBarIcon: ({ focused }) => (
            <Icon
              color={
                focused
                  ? COLORS.BOTTOM_BAR_FOCUSED_ICON_COLOR
                  : COLORS.BOTTOM_BAR_ICON_COLOR
              }
              name={focused ? "account-box" : "account-box-outline"}
              size={28}
              type="material-community"
            />
          ),
        })}
      />
      <Tab.Screen
        name="AccessHistory"
        component={AccessHistory}
        options={({ navigation, route }) => ({
          ...options,
          tabBarLabel: "Access History",
          header: (props) => (
            <Header navigation={navigation} title="ACCESS HISTORY" />
          ),
          tabBarIcon: ({ focused }) => (
            <Icon
              color={
                focused
                  ? COLORS.BOTTOM_BAR_FOCUSED_ICON_COLOR
                  : COLORS.BOTTOM_BAR_ICON_COLOR
              }
              name={focused ? "notifications" : "notifications-outline"}
              size={26}
              type="ionicon"
            />
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={({ navigation, route }) => ({
          ...options,
          header: (props) => <Header navigation={navigation} title="PROFILE" />,
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <Icon
              color={
                focused
                  ? COLORS.BOTTOM_BAR_FOCUSED_ICON_COLOR
                  : COLORS.BOTTOM_BAR_ICON_COLOR
              }
              name={focused ? "person-circle" : "person-circle-outline"}
              size={26}
              type="ionicon"
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
}
