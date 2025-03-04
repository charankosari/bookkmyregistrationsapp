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
  Alert,
  ScrollView,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import * as Location from "expo-location";
import image1 from "../../assets/icons/image1.png";
import image2 from "../../assets/icons/image2.png";
import image3 from "../../assets/icons/image3.png";
import image4 from "../../assets/icons/image4.png";
import image5 from "../../assets/icons/image5.png";
import image6 from "../../assets/icons/image6.png";

const categoryImages = {
  "General Physician": image1,
  "Dental Care": image2,
  "Homeopathy": image3,
  "Ayurveda": image4,
  "Mental Wellness": image5,
  "Physiotherapy": image6,
};
export default function App({ navigation }) {
  const [hospitals, setHospitals] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);
  const [city, setCity] = useState(null);
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("Set Location");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHospitals, setFilteredHospitals] = useState(hospitals);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const processHospitals = (data) => {
    const doctorMap = new Map();
    const allSpecialists = new Set();
    data.c.forEach((doctorData) => {
      const doctor = doctorData.doctor;
      const hasBookings = Object.keys(doctor.bookingsids || {}).length > 0;
      if (hasBookings) {
        doctorMap.set(doctor._id, doctor);
        allSpecialists.add(doctor.specialist)
      }
    });
    
    const updatedHospitals = data.hospitals
      .filter(hospital => hospital.role === "hospital")
      .map(hospital => {
        const updatedDoctors = hospital.doctors
          .map(doc => {
            const doctor = doctorMap.get(doc.doctorid);
            return {
              ...doc,
              doctor: doctor || null
            };
          })
          .filter(doc => doc.doctor !== null);
        const updatedCategories = Array.from(new Set([ ...allSpecialists]))
          .map(specialist => ({ types: specialist }));
        return updatedDoctors.length > 0
          ? {
              ...hospital,
              doctors: updatedDoctors,
              category: updatedCategories,
            }
          : null;
      })
      .filter(hospital => hospital !== null);
      setCategories(Array.from(allSpecialists));

    return updatedHospitals;
  };
  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/admin/getallhospitalsrem"
      );
      const data = await response.json();
      if (response.ok) {
        const processedHospitals = processHospitals(data);
        setHospitals(processedHospitals);
        setFilteredHospitals(processedHospitals);
        
      } else {
        Alert.alert("Error", "Failed to fetch hospitals data");
      }
    } catch (error) {
      console.error("Error fetching hospitals data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHospitals();
  }, []);
  

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
            setCity(address[0].district);
          }
        } catch (error) {
          console.error("Error getting location:", error);
        }
      }
    };

    getLocationPermissionAndFetchLocation();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    applyFilters(text, selectedCategory,location);
  };

  const handleCategoryChange = (category) => {
    const newCategory = category === selectedCategory ? null : category;
    setSelectedCategory(newCategory);
    applyFilters(searchQuery, newCategory,location);
  };
  const applyFilters = (text, categories, location) => {
    let filtered = hospitals;
    const lowercasedText = text?.trim().toLowerCase() || "";
    const safeCategories = Array.isArray(categories) ? categories : [];
    const safeLocation = (typeof location === 'string' ? location.trim().toLowerCase() : '');


    if (lowercasedText) {
      filtered = filtered.filter((hospital) => {
        const { hospitalName = "", address = [], category = [] } = hospital;
        const isCategoryMatch =
          Array.isArray(category) &&
          category.some(
            (cat) =>
              typeof cat === "object" &&
              cat.types &&
              cat.types.toLowerCase().includes(lowercasedText)
          );
  
        return (
          hospitalName.toLowerCase().includes(lowercasedText) ||
          (address[0]?.city && address[0].city.toLowerCase().includes(lowercasedText)) ||
          isCategoryMatch
        );
      });
    }
  
    // Filter by categories
    if (safeCategories.length > 0) {
      filtered = filtered.filter((hospital) =>
        hospital.category?.some((cat) => safeCategories.includes(cat.types)) ?? false
      );
    }
  
    // Filter by location
    if (safeLocation && safeLocation !== "set location" && safeLocation !== "none") {
      filtered = filtered.filter(
        (hospital) => hospital.address[0]?.city?.toLowerCase() === safeLocation
      );
    }
  
    setFilteredHospitals(filtered);
  };
  
  
  
  

  const handleSearchSubmit = () => {
  };

  const handleOptionPress = (option) => {
    if (option.name) {
      setSelectedLocation(option.name);
      applyFilters(searchQuery, selectedCategory, option.name);
    } else {
      setSelectedLocation(option);
      applyFilters(searchQuery, selectedCategory, option);
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
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 10,
            overflow: "hidden",
            marginRight: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            {hospital.image[0] !==''? (
            <Image
              source={{ uri: hospital.image[0] }}
              style={{ width: "100%", height: "100%", borderRadius: 10 }}
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#ccc",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 36, fontWeight: "bold" }}>
                {hospital.hospitalName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1, marginLeft: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
            {hospital.hospitalName}
          </Text>
          <Text style={{ fontSize: 16, color: "gray" }}>
            {hospital.address[0].city}
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

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 10, paddingBottom: 10 }}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCategoryChange(category)}
              style={{
                marginRight: 10,
                alignItems: "center",
              }}
            >
              <Image
                source={categoryImages[category] || image1}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  borderWidth: selectedCategory === category ? 2 : 0,
                  borderColor:
                    selectedCategory === category ? "#000" : "transparent",
                }}
              />

              <Text
                style={{ marginTop: 5, textAlign: "center", marginVertical: 5 }}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
                onPress={() => {
                  if (index !== 0 || item) {
                    handleOptionPress(item);
                  }
                }}
                disabled={index === 0 && !item}
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
                    ? item
                      ? item + " (Your current Location)"
                      : "Getting your location"
                    : item.name
                    ? item.name
                    : item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>

   
      {selectedLocation === "Set Location" || selectedLocation === "None" ? (
  filteredHospitals.length > 0 ? (
    filteredHospitals.map((hospital, index) => (
      <HospitalContainer key={index} hospital={hospital} />
    ))
  ) : (
    <Text
      style={{
        textAlign: "center",
        marginTop: 5,
        fontSize: 16,
        color: "red",
        marginBottom: 10,
      }}
    >
      No hospitals found for your search.
    </Text>
  )
) : (
  filteredHospitals.filter(
    (hospital) => hospital.address[0].city === selectedLocation
  ).length > 0 ? (
    filteredHospitals
      .filter((hospital) => hospital.address[0].city === selectedLocation)
      .map((hospital, index) => (
        <HospitalContainer key={index} hospital={hospital} />
      ))
  ) : (
    <>
      <Text
        style={{
          textAlign: "center",
          marginTop: 5,
          fontSize: 16,
          color: "red",
          marginBottom: 15,
        }}
      >
        Sorry, we cannot find any hospitals in your area.
      </Text>
      <View
        style={{
          borderBottomColor: "#495057",
          borderBottomWidth: 2,
          marginHorizontal: 10,
          marginBottom: 15,
        }}
      />
      {filteredHospitals.map((hospital, index) => (
        <HospitalContainer key={index} hospital={hospital} />
      ))}
    </>
  )
)}


    </View>
  );
}
