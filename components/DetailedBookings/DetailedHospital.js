import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  SafeAreaView,
  Platform,
  Linking,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { WebView } from 'react-native-webview';

export default function DetailedHospitalBooking({ route, navigation }) {
  const { selectedDate, selectedTime, doctorDetails, hospital } = route.params;
  const [coupon, setCoupon] = useState("");
  const [jwt, setJwt] = useState('');
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log(hospital._id,doctorDetails._id,selectedDate,selectedTime)
      try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        const userData = JSON.parse(await AsyncStorage.getItem("userData"));
        setJwt(jwtToken);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data from AsyncStorage", error);
      }
    };
    fetchUserData();
  }, []);

  const handleApplyCoupon = () => {
    // Apply coupon logic here
  };
  const convertDateFormat = (date) => {
    const [dd, mm, yyyy] = date.split('-');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const hour = parseInt(selectedTime.split(':')[0], 10);
      const session = hour < 12 ? 'morning' : 'evening';
      console.log(hospital._id,doctorDetails._id,selectedDate,selectedTime,session,user.name,user.email,user.number)
      const response = await fetch(
        `https://server.bookmyappointments.in/api/bma/addbooking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            doctorId: doctorDetails._id,
            hospitalId: hospital._id,
            date: convertDateFormat(selectedDate),
            time: selectedTime,
            session:session,
            name: user.name,
            email: user.email,
            phonenumber: user.number,
            amountpaid: 250
          })
        }
      );

      const responseData = await response.json();
      setLoading(false);
      if (response.ok) {
        navigation.replace("Booking Confirmed", { response: responseData });
      } else {
        Alert.alert("Error", responseData.message);
      }
    } catch (error) {
      console.error("Error while booking:", error);
      setLoading(false);
      Alert.alert("Error", "An error occurred while booking.");
    }
  };

  const handleOptionViewPress = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${hospital.address[0].latitude},${hospital.address[0].longitude}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: Platform.OS === "android" ? 0 : 20,
        paddingTop: Platform.OS === "android" ? 60 : 30,
        marginHorizontal: 20,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: "#d9d9d9",
            borderRadius: 5,
            padding: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={{
              uri: "https://imgs.search.brave.com/llw5Me8WgZERr-0oFufqGCziE0oWjCvP9AZIiFf8wyU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9k/b2N0b3Itd2l0aC13/aGl0ZS1yb2JlLXN0/ZXRob3Njb3BlXzE0/NDYyNy00Mzg3OS5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw",
            }}
            style={{ width: 100, height: 100, borderRadius: 5 }}
          />
          <View
            style={{
              marginBottom: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginLeft: 30,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "800" }}>
              {hospital.hospitalName}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "700" }}>
              {doctorDetails.name}
            </Text>
            <Text style={{ fontSize: 14, marginLeft: 5 }}>
              {doctorDetails.study}
            </Text>
          </View>
        </View>
        <View style={{ marginBottom: 20, marginTop: 10 }}>
          <Text>Booking date and time</Text>
          <Text style={{ fontSize: 12, fontWeight: "300" }}>
            Date: {selectedDate}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: "300" }}>
            Time: {selectedTime}
          </Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                flexDirection: "row",
                borderWidth: 1,
                padding: 5,
                borderRadius: 5,
                borderColor: "#d7d7d7",
                alignItems: "center",
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  marginRight: 10,
                }}
                placeholder="Enter coupon code"
                value={coupon}
                onChangeText={setCoupon}
              />
              <TouchableOpacity
                onPress={handleApplyCoupon}
                style={{
                  backgroundColor: "#2BB673",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "white" }}> Apply </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 18,
                marginTop: 10,
                fontWeight: "600",
                width: "100%",
              }}
            >
              50% of Our Profits are used for Orphan Children Health Care
            </Text>
          </View>
        </View>
        <View style={{ marginBottom: 20 }}>
          <View
            style={{
              borderBottomColor: "#d7d7d7",
              borderBottomWidth: 1,
              paddingBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
              Billing Details
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text style={{ fontSize: 16 }}>Consultancy Fee:</Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>₹150</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text style={{ fontSize: 16 }}>Service Fee:</Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>₹100</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Total amount:
            </Text>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#2BB673" }}
            >
              ₹250
            </Text>
          </View>
        </View>
        <View>
          <View style={{ height: 200, marginBottom: 20 }}>
            <WebView
              originWhitelist={['*']}
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <title>Bookmyappointments</title>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
                      <style>
                        #map {
                          height: 100%;
                          width: 100%;
                        }
                        html, body {
                          height: 100%;
                          margin: 0;
                        }
                      </style>
                    </head>
                    <body>
                      <div id="map"></div>
                      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
                      <script>
                        var map = L.map('map').setView([${hospital.address[0].latitude}, ${hospital.address[0].longitude}], 13);
                        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                          attribution: ''
                        }).addTo(map);
                        L.marker([${hospital.address[0].latitude}, ${hospital.address[0].longitude}]).addTo(map)
                          .bindPopup('${hospital.hospitalName}')
                          .openPopup();
                      </script>
                    </body>
                  </html>
                `,
              }}
              style={{ width: "100%", height: "100%" }}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                alignSelf: "center",
                padding: 10,
                backgroundColor: "#2BB673",
                borderRadius: 5,
                margin: 3,
              }}
              onPress={handleOptionViewPress}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>View </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              marginBottom: 20,
              backgroundColor: "#2BB673",
              marginTop: 10,
              borderRadius: 5,
              padding: 10,
              justifyContent: 'center',
              display: 'flex',
              width: 150,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={handleCheckout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff' }}> CheckOut</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
