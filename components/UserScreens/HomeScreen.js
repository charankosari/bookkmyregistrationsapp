import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import HospitalScreen from "../HospitalLabScreens/HospitalScreen";
import LabsScreen from "../HospitalLabScreens/LabsScreen";
import { useRoute } from "@react-navigation/native";
const HomeScreen = ({navigation}) => {
  const route=useRoute();
  const {user}=route.params;
  const [selectedCategory, setSelectedCategory] = useState("hospitals");
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? 40 : 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Hi {user.name} </Text>
      </View>
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              borderRadius: 10,
              borderBottomWidth: 1,
              borderTopWidth: 1,
              borderColor: "#ccc",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 10,
              borderLeftWidth: 1,
              backgroundColor:
                selectedCategory === "hospitals" ? "#2BB673" : "transparent",
              borderTopRightRadius: selectedCategory === "hospitals" ? 0 : 10,
              borderBottomRightRadius:
                selectedCategory === "hospitals" ? 0 : 10,
            }}
            onPress={() => handleCategorySelect("hospitals")}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: selectedCategory === "hospitals" ? "#fff" : "#000",
              }}
            >
              Hospitals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              borderRadius:10,
              borderBottomWidth: 1,
              borderTopWidth: 1,
              borderColor: "#ccc",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 10,
              borderRightWidth: 1,
              backgroundColor:selectedCategory === "labs" ? "#2BB673" : "transparent",
              borderTopLeftRadius: selectedCategory === "labs" ? 0 : 10,
              borderBottomLeftRadius: selectedCategory === "labs" ? 0 : 10,
            }}
            onPress={() => handleCategorySelect("labs")}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: selectedCategory === "labs" ? "#fff" : "#000",
              }}
            >
              Labs
            </Text>
          </TouchableOpacity>
        </View>
          {selectedCategory === "hospitals" ? (
          <HospitalScreen navigation={navigation} />
        ) : (
          <LabsScreen navigation={navigation} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
  