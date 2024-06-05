import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

const Success = ({ navigation }) => {
  const handleNavigateHome = () => {
    navigation.push("HomeScreen");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <Image
        source={require("../assets/bookingconfirmed.png")}
        style={{ width: 200, height: 200, marginBottom: 20 }}
      />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Booking Confirmed!
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Booking ID:56465</Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        Thanks for choosing us.
      </Text>
      <TouchableOpacity
        onPress={handleNavigateHome}
        style={{ backgroundColor: "#2BB673", padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Go Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Success;
