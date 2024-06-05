import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Doctorpng from "../../assets/doctor.png";
export default function HospitalCategories({ navigation, route }) {
  const { hospital } = route.params;
  const options = [
    { id: 1, icon: "user", categoryName: "General Physician" },
    { id: 2, icon: "heart", categoryName: "Cardiology" },
    { id: 3, icon: "eye", categoryName: "Ophthalmology" },
    { id: 4, icon: "scissor", categoryName: "Surgery" },
    { id: 5, icon: "medicinebox", categoryName: "Pharmacy" },
    { id: 6, icon: "dashboard", categoryName: "Radiology" },
    { id: 7, icon: "user", categoryName: "Dermatology" },
    { id: 8, icon: "heart", categoryName: "Pediatrics" },
    { id: 9, icon: "eye", categoryName: "Optometry" },
    { id: 10, icon: "scissor", categoryName: "Orthopedics" },
    { id: 11, icon: "medicinebox", categoryName: "Neurology" },
    { id: 12, icon: "dashboard", categoryName: "Endocrinology" },
    { id: 13, icon: "user", categoryName: "Gastroenterology" },
    { id: 14, icon: "heart", categoryName: "Hematology" },
    { id: 15, icon: "eye", categoryName: "Urology" },
  ];
  const handleOptionPress = (option) => {
    navigation.push("HospitalDetails", { option, hospital });
  };
  return (
    <SafeAreaView
      style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingHorizontal: 20,
          paddingTop: Platform.OS === "android" ? 50 : 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 10,
          marginLeft: 10,
          paddingLeft: 20,
        }}
      >
        {hospital.hospitalName}{" "}
      </Text>
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 5,
            display: "flex",
          }}
        >
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: "30%",
                height: 140,
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
                marginLeft: 7,
              }}
              onPress={() => handleOptionPress(option)}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#2BB673",
                  width: "70%",
                  height: 60,
                  borderRadius: 5,
                }}
              >
                <Image
                  source={Doctorpng}
                  style={{ width: 50, height: 50, borderRadius: 5 }}
                />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  textAlign: "center",
                  height: 40,
                }}
              >
                {option.categoryName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
