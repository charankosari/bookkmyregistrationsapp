import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
const RegisterScreen = ({navigation}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phoneNumber) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://server.bookmyappointments.in/api/bma/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, number: phoneNumber }),
      });

      const data = await response.json();

      if (response.status === 200) {
        navigation.replace("Otp", { number: data.number });
      } else {
        console.log(data)
        Alert.alert("Error", data.error || "Registration failed");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to register, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
          }}
        >
          <Text style={{ fontSize: 36, marginBottom: 24 }}>Register </Text>
          <View style={{ width: "100%", marginBottom: 24 }}>
            <TextInput
              placeholder="Name"
              style={{
                height: 40,
                borderColor: "#ccc",
                borderBottomWidth: 1,
                marginBottom: 12,
                paddingHorizontal: 8,
                fontSize: 16,
              }}
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
            <TextInput
              placeholder="Email"
              style={{
                height: 40,
                borderColor: "#ccc",
                borderBottomWidth: 1,
                marginBottom: 12,
                paddingHorizontal: 8,
                fontSize: 16,
              }}
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              style={{
                height: 40,
                borderColor: "#ccc",
                borderBottomWidth: 1,
                marginBottom: 12,
                paddingHorizontal: 8,
                fontSize: 16,
              }}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={handleRegister}
              style={{
                backgroundColor: loading ? "#ccc" : "#4CAF50",
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: 4,
                alignItems: "center",
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>
                  Send OTP
                </Text>
              )}
            </TouchableOpacity>
            <Text
              style={{
                marginTop: 24,
                fontSize: 16,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Already have an account?{" "}
              <Text
                onPress={() => navigation.push("Login")}
                style={{ color: "#4CAF50", textDecorationLine: "underline" }}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
