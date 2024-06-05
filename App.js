import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./components/LoginScreen/Login";
import Register from "./components/LoginScreen/Register";
import { TouchableOpacity } from "react-native";
import OtpScreen from "./components/LoginScreen/OtpScreen";
import OtpScreenLogin from "./components/LoginScreen/OtpScreenLogin";
import HomeScreen from "./components/Home";
import HospitalDetail from "./components/DetailedViews/HospitalDetail";
import LabDetail from "./components/DetailedViews/LabDetail";
import DetailedDoctors from "./components/DetailedLabsDoctors/DetailedDoctors";
import DetailedLabs from "./components/DetailedLabsDoctors/DetailedLabs";
import DetailedHospitalBooking from "./components/DetailedBookings/DetailedHospital";
import DetailedLabBooking from "./components/DetailedBookings/DetailedLab";
import { FontAwesome } from "@expo/vector-icons";
import Success from "./components/Success";
import MyBookings from "./components/SettingsScreens/MyBookings";
import Favourites from "./components/SettingsScreens/Favourites";
import Help from "./components/SettingsScreens/HelpSupport";
import Medical from "./components/SettingsScreens/MedicalReports";
import HospitalCategories from "./components/CategoriesViews/HospitalCategories";
import LabCategories from "./components/CategoriesViews/LabCategories";
import HospitalScreen from "./components/HospitalLabScreens/HospitalScreen";
import LabScreen from "./components/HospitalLabScreens/LabsScreen";
import Ho from "./components/UserScreens/HomeScreen";
import Se from "./components/UserScreens/SettingsScreen";
import * as SplashScreen from "expo-splash-screen";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // Prevent the splash screen from automatically hiding
    SplashScreen.preventAutoHideAsync();

    // You can optionally delay hiding the splash screen to display it for a specific duration
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 3000); // Adjust the duration as needed
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="OtpLogin"
          component={OtpScreenLogin}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="HospitalScreens"
          component={HospitalScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="LabScreens"
          component={LabScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Otp"
          component={OtpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Ho"
          component={Ho}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Se"
          component={Se}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="HospitalDetails"
          component={HospitalDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LabDetails"
          component={LabDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailedDoctors"
          component={DetailedDoctors}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailedLabs"
          component={DetailedLabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailedHospitalBooking"
          component={DetailedHospitalBooking}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="My bookings"
          component={MyBookings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Favourites"
          component={Favourites}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="My medical reports"
          component={Medical}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Help and Support"
          component={Help}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailedLabBooking"
          component={DetailedLabBooking}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HospitalCategories"
          component={HospitalCategories}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LabCategories"
          component={LabCategories}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Booking Confirmed"
          component={Success}
          options={{
            gestureEnabled: false,
            headerTitle: "Booking Confirmed", 
            headerBackVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
