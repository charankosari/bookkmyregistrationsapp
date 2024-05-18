import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  SafeAreaView,
  Platform,
  StyleSheet,
  Linking ,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, { Marker } from 'react-native-maps';


export default function DetailedHospitalBooking({ route, navigation }) {
  const { selectedDate, selectedTime, doctorDetails,hospital } = route.params;
  const [coupon, setCoupon] = useState("");

  const handleApplyCoupon = () => {
    // Implement coupon logic here

  };

  const handleCheckout = () => {
    // Implement checkout logic here
    navigation.navigate('Booking Confirmed')
  };
  const handleOptionViewPress = () => {
    
    const url = `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`;
    Linking.openURL(url);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
            ...styles.section,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: 30,
          }}
        >
          <Text style={{ fontSize: 16,fontWeight:800 }}>
            {hospital.hospitalName}
          </Text>
          <Text style={{ fontSize: 14,fontWeight:700 }}>
            {doctorDetails.name}
          </Text>
          <Text style={{ fontSize: 14, marginLeft: 5 }}>
            {doctorDetails.study}{" "}
          </Text>
        </View>
      </View>
      <View style={{ ...styles.section, marginTop: 10 }}>
        <Text>Booking date and time</Text>
        <Text style={{fontSize: 12, fontWeight: "300" }}>
          Date:
          <Text style={{fontSize: 12, fontWeight: "300" }}>
            {selectedDate}-05-2024
          </Text>
        </Text>
        <Text style={{fontSize: 12, fontWeight: "300" }}>
          Date:
          <Text style={{fontSize: 12, fontWeight: "300" }}>
            {selectedTime}
          </Text>
        </Text>
      </View>
      <View style={styles.section}>
        <View style={styles.section}>
          <View style={styles.inputSection}>
            <TextInput
              style={styles.input}
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
          <Text style={{fontSize:18,marginTop:10,fontWeight:600,width:'100%'}}>
            
            50% of Our Profits are used for Orphan Children Health Care
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <View style={{borderBottomColor:'#d7d7d7',borderBottomWidth:1,paddingBottom:10}}>
        <Text style={styles.heading}>Billing Details</Text>
        <View style={styles.billingRow}>
          <Text style={styles.billingItem}>Consultancy Fee:</Text>
          <Text style={styles.billingValue}>₹150</Text>
        </View>
        <View style={styles.billingRow}>
          <Text style={styles.billingItem}>Service Fee:</Text>
          <Text style={styles.billingValue}>₹100</Text>
        </View>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total amount:</Text>
          <Text style={styles.totalValue}>₹250</Text>
        </View>
      </View>
      <View>
      <MapView
        style={{width:'100%',height:200}}
        initialRegion={{
       
          latitude:  17.442252,
          longitude:78.496971,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        mapType="default"
      >
        <Marker
          coordinate={{ latitude: hospital.latitude, longitude:hospital.longitude}}
          title="Marker Title"
          description="Marker Description"
        />
      </MapView>
      <TouchableOpacity
        style={{
          position: "absolute",
          right:0,
          top:0,
          alignSelf: "center",
          padding: 10,
          backgroundColor: "#2BB673",
          borderRadius: 5,
          margin:3
        }}
        onPress={handleOptionViewPress}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>View </Text>
      </TouchableOpacity>
      </View>
      <View style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
      <View style={{...styles.section,backgroundColor:'#2BB673',marginTop:10,borderRadius:5,width:150}}>
        <Button title="Checkout" onPress={handleCheckout} color="#fff" />
      </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "android" ? 60 : 30,
    marginHorizontal:20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  
  billingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  billingItem: {
    fontSize: 16,
  },
  billingValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2BB673",
  },
  inputSection: {
    flexDirection: "row",
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    borderColor: "#d7d7d7",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
