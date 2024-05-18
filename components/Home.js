import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./UserScreens/HomeScreen";
import SettingsScreen from "./UserScreens/SettingsScreen";

const Tab = createBottomTabNavigator();

const MainScreen = () => {
  
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Settings") {
              iconName = "person";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#2BB673",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            display: "flex",
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false, 
          }}
        />
        <Tab.Screen name="Settings" component={SettingsScreen}  options={{
            headerShown: false, 
          }} />
      </Tab.Navigator>
    </>
  );
};

export default MainScreen;
