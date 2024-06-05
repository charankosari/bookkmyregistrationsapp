import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Entypo } from "@expo/vector-icons";
export default function App({navigation}) {
  const hospitals = [
    {
      hospitalName: "City Hospital",
      image:
        "https://www.apolloinformationcentre.com/wp-content/uploads/2019/09/hyderabad.jpg",
      areaName: "Secunderabad",
      categories: ["Dermatology", "Cardiology"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      hospitalName: "Pradhana Hospital",
      image:
        "https://www.apolloinformationcentre.com/wp-content/uploads/2019/09/hyderabad.jpg",
      areaName: "Bhupalpalle",
      categories: ["Dermatology", "Cardiology"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      hospitalName: "Unity Hospital",
      image:
        "https://www.apolloinformationcentre.com/wp-content/uploads/2019/09/hyderabad.jpg",
      areaName: "Banjara Hills",
      categories: ["Neurology", "Orthopedics"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      hospitalName: "Metro Clinic",
      image:
        "https://www.apolloinformationcentre.com/wp-content/uploads/2019/09/hyderabad.jpg",
      areaName: "Ameerpet",
      categories: ["ENT", "Ophthalmology"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      hospitalName: "Global Heart Institute",
      image:
        "https://www.apolloinformationcentre.com/wp-content/uploads/2019/09/hyderabad.jpg",
      areaName: "Gachibowli",
      categories: ["Cardiology", "Internal Medicine"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      hospitalName: "Evergreen Hospital",
      image:
        "https://www.apolloinformationcentre.com/wp-content/uploads/2019/09/hyderabad.jpg",
      areaName: "Madhapur",
      categories: ["Pediatrics", "Gynecology"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
  ];
  const hyderabadCities = [
    { id: 0, name: "None" },
    { id: 1, name: "Ameerpet" },
    { id: 2, name: "Banjara Hills" },
    { id: 3, name: "Begumpet" },
    { id: 4, name: "Gachibowli" },
    { id: 5, name: "Hitech City" },
    { id: 6, name: "Jubilee Hills" },
    { id: 7, name: "Kukatpally" },
    { id: 8, name: "Madhapur" },
    { id: 9, name: "Manikonda" },
    { id: 10, name: "Mehdipatnam" },
    { id: 11, name: "Nampally" },
    { id: 12, name: "Secunderabad" },
    { id: 13, name: "Somajiguda" },
    { id: 14, name: "Srinagar Colony" },
    { id: 15, name: "Tarnaka" },
    { id: 16, name: "Uppal" },
    { id: 17, name: "Vanasthalipuram" },
    { id: 18, name: "Yousufguda" },
    { id: 19, name: "Abids" },
    { id: 20, name: "Himayat Nagar" },
  ];
  useEffect(() => {
    const getLocationPermissionAndFetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
      if (status === "granted") {
        try {
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);

          const address = await Location.reverseGeocodeAsync({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });

          if (address && address.length > 0) {
            setCity(address[0].city);
          }
        } catch (error) {
          console.error("Error getting location:", error);
        }
      }
    };

    getLocationPermissionAndFetchLocation();
  }, []);


  const [searchText, setSearchText] = useState("");
  const [locationPermission, setLocationPermission] = useState(null);
  const [city, setCity] = useState(null);
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("Set Location");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHospitals, setFilteredHospitals] = useState(hospitals);
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredHospitals(hospitals);
      console.log(hospitals);
    } else {
      const filtered = hospitals.filter(
        (hospital) =>
          hospital.hospitalName.toLowerCase().includes(text.toLowerCase()) ||
          hospital.areaName.toLowerCase().includes(text.toLowerCase()) ||
          hospital.categories.some((category) =>
            category.toLowerCase().includes(text.toLowerCase())
          )
      );
      setFilteredHospitals(filtered);
    }
  };

  const handleSearchSubmit = () => {
    console.log("Search Query:", searchQuery);
  };
  const handleOptionPress = (option) => {
    console.log(option, "item");
    if (option.name) {
      setSelectedLocation(option.name);
    } else {
      setSelectedLocation(option);
    }
    setSearchText("");
    setModalVisible(false);
  };


  const handleSetLocation = () => {
    setModalVisible(true);
  };
  const filteredOptions = hyderabadCities.filter((option) =>
    option.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const HospitalContainer = ({ hospital }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("HospitalCategories", { hospital });
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
          borderRadius: 10,
          marginHorizontal: 10,
          padding: 10,
          marginBottom: 10,
        }}
      >
        <Image
          source={{ uri: hospital.image }}
          style={{ width: 90, height: 90, borderRadius: 10, marginRight: 10 }}
        />
        <View style={{ flex: 1, marginLeft: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
            {hospital.hospitalName}
          </Text>
          <Text style={{ fontSize: 16, color: "gray" }}>
            {hospital.areaName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        marginVertical: 5,
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            paddingHorizontal: 10,
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 10,
          }}
        >
          <TextInput
            style={{ flex: 1, paddingVertical: 10 }}
            placeholder="Search"
            onChangeText={handleSearch}
            value={searchQuery}
          />
          <TouchableOpacity onPress={handleSearchSubmit}>
            <AntDesign
              style={{ marginRight: 10 }}
              name="search1"
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleSetLocation}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 10,
            marginBottom: 10,
            marginTop: 5,
          }}
        >
          <AntDesign name="enviromento" size={28} color="black" />
          <Text> {selectedLocation} </Text>
        </TouchableOpacity>
      </View>

      {/* _____________its for location modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView
          style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <TextInput
              style={{
                flex: 1,
                height: 40,
                marginLeft: 20,
                marginRight: 20,
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 20,
                paddingHorizontal: 15,
                marginRight: 10,
                color: "#333",
              }}
              placeholder="Search..."
              placeholderTextColor="#666"
              onChangeText={(text) => setSearchText(text)}
              value={searchText}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#333",
                  marginRight: 20,
                }}
              >
                <Entypo name="cross" size={26} color="#333" />
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={[city, ...filteredOptions]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  marginLeft: 20,
                  marginRight: 20,
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#e5e5e5",
                }}
                onPress={() => handleOptionPress(item)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "#333",
                    flex: 1,
                  }}
                >
                  {index === 0
                    ? item + " (Your current Location)"
                    : item.name
                    ? item.name
                    : item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
      {selectedLocation === "Set Location" || selectedLocation === "None"
        ? filteredHospitals.map((hospital, index) => (
            <HospitalContainer key={index} hospital={hospital} />
          ))
        : filteredHospitals
            .filter((hospital) => hospital.areaName === selectedLocation)
            .map((hospital, index) => (
              <HospitalContainer key={index} hospital={hospital} />
            ))}
    </View>
  );
}