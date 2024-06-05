import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRoute } from "@react-navigation/native";
import Default from "../../assets/default.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
const SettingsScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const route=useRoute();
  const {user}=route.params;

  const handleImageUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.canceled === true) {
      return;
    }

    setProfileImage(pickerResult.uri);
  };

  const handleEditProfile = () => {
    // console.log("hello");
  };

  const handleSignOut = () => {
    AsyncStorage.removeItem("jwtToken");
    navigation.push("Login");

  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? 40 : 30,
        marginHorizontal: 20,
      }}
    >
      <View>
        <TouchableOpacity
          onPress={handleImageUpload}
          style={{
            alignItems: "center",
            marginBottom: 20,
            display: "flex",
            marginTop:40,
            flexDirection: "row",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <Image
            source={profileImage ? { uri: profileImage } : Default}
            style={{
              width: 100,
              height: 100,
              resizeMode: "cover",
              borderRadius: 50,
            }}
          />
          <View
            style={{
              alignItems: "center",
              marginBottom: 20,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", marginRight: 10 }}>
              {user.name}
            </Text>
            <TouchableOpacity onPress={handleEditProfile}>
              <Text style={{ color: "blue", fontSize: 16 }}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Options */}
        <TouchableOpacity
          style={{
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          }}
          onPress={() => {
            navigation.navigate("My bookings");
          }}
        >
          <Text style={{ fontSize: 18 }}>My Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          }}
          onPress={() => {
            navigation.navigate("Favourites");
          }}
        >
          <Text style={{ fontSize: 18 }}>Favourites</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          }}
          onPress={() => {
            navigation.navigate("My medical reports");
          }}
        >
          <Text style={{ fontSize: 18 }}>My Medical Records</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          }}
          onPress={() => {
            navigation.navigate("Help and Support");
          }}
        >
          <Text style={{ fontSize: 18 }}>Help and Support</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            marginTop: 20,
            backgroundColor: "red",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
