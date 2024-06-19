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

import image1 from '../../assets/icons/image1.png'
import image2 from '../../assets/icons/image2.png'
import image3 from '../../assets/icons/image3.png'
import image4 from '../../assets/icons/image4.png'
import image5 from '../../assets/icons/image5.png'
import image6 from '../../assets/icons/image6.png'

export default function HospitalCategories({ navigation, route }) {
  const categoryImages = {
    "Blood test": image1,
    "Dental Care": image2,
    "Homeopathy": image3,
    "Ayurveda": image4,
    "Mental Wellness": image5,
    "Physiotherapy": image6,
  };
  const { hospital } = route.params;
  const options = hospital.category.map((category, index) => ({
    id: index + 1,
    icon: categoryImages[category.types] || image1,
    categoryName: category.types,
  }));

  const handleOptionPress = (option) => {
    navigation.push("DetailedLabs", { option, hospital });
  };
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: Platform.OS === "android" ? 20 : 0,
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
        {hospital.hospitalName}
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
                  backgroundColor: "#fff",
                  width: "70%",
                  height: 60,
                  borderRadius: 5,
                }}
              >
                <Image
                  source={option.icon}
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
