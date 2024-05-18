import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./components/LoginScreen/Login";
import Register from "./components/LoginScreen/Register";
import { TouchableOpacity } from "react-native";
import OtpScreen from "./components/LoginScreen/OtpScreen";
import HomeScreen from "./components/Home";
import HospitalDetail from "./components/DetailedViews/HospitalDetail";
import LabDetail from "./components/DetailedViews/LabDetail";
import DetailedDoctors from "./components/DetailedLabsDoctors/DetailedDoctors";
import DetailedLabs from "./components/DetailedLabsDoctors/DetailedLabs";
import DetailedHospitalBooking from "./components/DetailedBookings/DetailedHospital";
import DetailedLabBooking from "./components/DetailedBookings/DetailedLab";
import { FontAwesome } from '@expo/vector-icons';
import Success from "./components/Success";
import MyBookings from "./components/SettingsScreens/MyBookings";
import Favourites from "./components/SettingsScreens/Favourites";
import Help from "./components/SettingsScreens/HelpSupport";
import Medical from "./components/SettingsScreens/MedicalReports";
import HospitalCategories from "./components/CategoriesViews/HospitalCategories";
import LabCategories from "./components/CategoriesViews/LabCategories";
const Stack = createStackNavigator();

export default function App( ) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
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
  options={({ navigation }) => ({
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate("HomeScreen")} 
        style={{ marginLeft: 10 }}
      >
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
    ),
  })}
/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
