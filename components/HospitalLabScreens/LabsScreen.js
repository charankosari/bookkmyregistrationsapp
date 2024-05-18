import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { Entypo } from "@expo/vector-icons";
export default function App() {
  const labs = [
    {
      labName: "Sunrise Diagnostics",
      image:
        "https://cdn.pixabay.com/photo/2017/10/04/09/55/laboratory-2815631_960_720.jpg",
      areaName: "Hitech City",
      categories: ["Blood Test", "Pathology"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      labName: "charan Diagnostics",
      image:
        "https://cdn.pixabay.com/photo/2017/10/04/09/55/laboratory-2815631_960_720.jpg",
      areaName: "Hitech City",
      categories: ["diabetes test"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      labName: "Rainbow Imaging Center",
      image:
        "https://cdn.pixabay.com/photo/2017/10/04/09/55/laboratory-2815631_960_720.jpg",
      areaName: "Jubilee Hills",
      categories: ["MRI Scan", "CT Scan"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      labName: "LifeCare Diagnostic Services",
      image:
        "https://cdn.pixabay.com/photo/2017/10/04/09/55/laboratory-2815631_960_720.jpg",
      areaName: "Kukatpally",
      categories: ["X-ray", "Ultrasound"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      labName: "Star Path Labs",
      image:
        "https://cdn.pixabay.com/photo/2017/10/04/09/55/laboratory-2815631_960_720.jpg",
      areaName: "Manikonda",
      categories: ["Blood Test", "Pathology"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      labName: "Vital Diagnostics",
      image:
        "https://cdn.pixabay.com/photo/2017/10/04/09/55/laboratory-2815631_960_720.jpg",
      areaName: "Nampally",
      categories: ["Radiology", "Ultrasound"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      labName: "HealthPoint Diagnostics",
      image:
        "https://cdn.pixabay.com/photo/2017/10/04/09/55/laboratory-2815631_960_720.jpg",
      areaName: "Somajiguda",
      categories: ["MRI Scan", "CT Scan"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      labName: "City Lab",
      image:
        "https://cdn.pixabay.com/photo/2017/10/04/09/55/laboratory-2815631_960_720.jpg",
      areaName: "Secunderabad",
      categories: ["Blood Test", "Pathology"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      labName: "Pradhana Lab",
      image:
        "https://cdn.pixabay.com/photo/2017/10/04/09/55/laboratory-2815631_960_720.jpg",
      areaName: "Bhupalpalle",
      categories: ["Blood Test", "Pathology"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      labName: "Unity Diagnostic Center",
      image:
        "https://cdn.pixabay.com/photo/2017/10/04/09/55/laboratory-2815631_960_720.jpg",
      areaName: "Banjara Hills",
      categories: ["Radiology", "Ultrasound"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      labName: "Metro Diagnostic Services",
      image:
        "https://cdn.pixabay.com/photo/2017/10/04/09/55/laboratory-2815631_960_720.jpg",
      areaName: "Ameerpet",
      categories: ["MRI Scan", "CT Scan"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      labName: "Global Path Labs",
      image:
        "https://cdn.pixabay.com/photo/2017/10/04/09/55/laboratory-2815631_960_720.jpg",
      areaName: "Gachibowli",
      categories: ["Blood Test", "Pathology"],
      latitude: 17.442252,
      longitude: 78.496971,
    },
    {
      labName: "Evergreen Diagnostic Center",
      image:
        "https://cdn.pixabay.com/photo/2017/10/04/09/55/laboratory-2815631_960_720.jpg",
      areaName: "Madhapur",
      categories: ["X-ray", "EKG"],
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
    getLocationPermission();
  }, []);

  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [locationPermission, setLocationPermission] = useState(null);
  const [city, setCity] = useState(null);
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("Set Location");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLabs, setfilteredLabs] = useState(labs);
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setfilteredLabs(labs);
    } else {
      const filtered = labs.filter(
        (lab) =>
          lab.labName.toLowerCase().includes(text.toLowerCase()) ||
          lab.areaName.toLowerCase().includes(text.toLowerCase()) ||
          lab.categories.some((category) =>
            category.toLowerCase().includes(text.toLowerCase())
          )
      );
      setfilteredLabs(filtered);
    }
  };

  const handleSearchSubmit = () => {
    console.log("Search Query:", searchQuery);
  };
  const handleOptionPress = (option) => {
    // console.log(option,"item")
    if (option.name) {
      setSelectedLocation(option.name);
    } else {
      setSelectedLocation(option);
    }
    setSearchText("");
    setModalVisible(false);
  };

  const getLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === "granted");
    if (status === "granted") {
      getLocation();
    }
  };

  const getLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (address && address.length > 0) {
        setCity(address[0].city);
        console.log(address[0].city);
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };
  const handleSetLocation = () => {
    setModalVisible(true);
  };
  const filteredOptions = hyderabadCities.filter((option) =>
    option.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const HospitalContainer = ({ lab }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("LabCategories", { lab });
      }}
    >
      <View style={styles.hospitalContainer}>
        <Image source={{ uri: lab.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.hospitalName}>{lab.labName}</Text>
          <Text style={styles.areaName}>{lab.areaName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 10,
        }}
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInputt}
            placeholder="Search"
            onChangeText={handleSearch}
            value={searchQuery}
          />
          <TouchableOpacity onPress={handleSearchSubmit}>
            <AntDesign
              style={styles.searchIcon}
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
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#666"
              onChangeText={(text) => setSearchText(text)}
              value={searchText}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>
                <Entypo name="cross" size={26} color="#333" />
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={[city, ...filteredOptions]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.customOptionBox}
                onPress={() => handleOptionPress(item)}
              >
                <Text style={styles.customCategoryName}>
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
        ? filteredLabs.map((lab, index) => (
            <HospitalContainer key={index} lab={lab} />
          ))
        : filteredLabs
            .filter((lab) => lab.areaName === selectedLocation)
            .map((lab, index) => <HospitalContainer key={index} lab={lab} />)}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  hospitalContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  areaName: {
    fontSize: 16,
    color: "gray",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  searchInputt: {
    flex: 1,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  //modal styles
  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  searchInput: {
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
  },
  closeButton: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginRight: 20,
  },
  customCategoryName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  customOptionBox: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
});
