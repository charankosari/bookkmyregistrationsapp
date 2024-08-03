import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from 'expo-clipboard';
import { CodeField, Cursor } from "react-native-confirmation-code-field";

const OtpScreen = ({ navigation }) => {
  const route = useRoute();
  const { userId } = route.params;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  useEffect(() => {
    const checkClipboardForOtp = async () => {
      const clipboardContent = await Clipboard.getStringAsync();
      if (/\d{4}/.test(clipboardContent)) {
        const otpArray = clipboardContent.split("").slice(0, 4);
        setOtp(otpArray);
      }
    };

    const interval = setInterval(checkClipboardForOtp, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyNow = async () => {
    setLoading(true);
    const otpNumber = Number(otp.join(""));
    const url = "https://server.bookmyappointments.in/api/bma/verifyotp";
    const payload = { userid: userId, otp: otpNumber };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      const responseData = JSON.parse(responseText);

      if (responseData.success) {
        await AsyncStorage.setItem("jwtToken", responseData.jwtToken);
        await AsyncStorage.removeItem("number");
        navigation.replace("HomeScreen");
      } else {
        Alert.alert("Error", responseData.message || "Otp doesnt match or expired");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const response = await fetch("https://server.bookmyappointments.in/api/bma/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: await AsyncStorage.getItem("number") }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "OTP has been resent");
        setTimer(30); // Reset the timer
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP, please try again");
    } finally {
      setResendLoading(false);
    }
  };

  const renderCustomCell = ({ index, symbol, isFocused }) => (
    <View
      key={index}
      style={{
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isFocused ? "#2BB673" : "#FFFFFF",
        borderWidth: 1,
        borderColor: isFocused ? "#2BB673" : "#000000",
        borderRadius: 10,
        margin: 10,
      }}
    >
      <Text style={{ fontSize: 24, color: isFocused ? "#FFFFFF" : "#000000" }}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        We have sent you the code
      </Text>
      <CodeField
        value={otp.join('')}
        onChangeText={(text) => setOtp(text.split('').slice(0, 4))}
        cellCount={4}
        rootStyle={{ marginBottom: 20 }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCustomCell}
      />
      <TouchableOpacity
        style={{
          backgroundColor: loading ? "#ccc" : "#2BB673",
          paddingHorizontal: 20,
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          paddingVertical: 10,
          borderRadius: 5,
          width: '60%',
          marginBottom: 20,
        }}
        onPress={handleVerifyNow}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={{ color: "white", alignItems: "center", fontSize: 18 }}>
            Verify Now
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          paddingHorizontal: 20,
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          paddingVertical: 10,
          borderRadius: 5,
          width: '60%',
        }}
        onPress={handleResendOtp}
        disabled={resendLoading || timer > 0}
      >
        {resendLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={{ color: resendLoading || timer > 0 ? "red" : "#2BB673", alignItems: "center", fontSize: 18 }}>
            Resend OTP {timer > 0 && `(${timer}s)`}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default OtpScreen;