import { View, Text, SafeAreaView } from "react-native";
import React from "react";

const MyBookings = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "black",
          }}
        >
          My Bookings
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default MyBookings;
