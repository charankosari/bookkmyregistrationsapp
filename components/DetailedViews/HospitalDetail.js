import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import Doctorpng from "../../assets/doctor.png";
import { FontAwesome } from "@expo/vector-icons";

const HospitalDetailScreen = ({ navigation, route }) => {
  const { hospital, option } = route.params;
  const [searchText, setSearchText] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  

  const doctors = [
    {
      id: 1,
      name: "Dr. John Doe",
      rating: 4,
      study: "MBBS",
      favourite: true,
      categories: ["General Physician"],
    },
    {
      id: 2,
      name: "Dr. Sarah Smith",
      rating: 3,
      study: "MD",
      favourite: false,
      categories: ["General Physician", "Neurology"],
    },
    {
      id: 3,
      name: "Dr. Michael Johnson",
      rating: 5,
      study: "MBBS",
      favourite: true,
      categories: ["General Physician", "Dermatology"],
    },
    {
      id: 4,
      name: "Dr. Emily Brown",
      rating: 4,
      study: "MD",
      favourite: false,
      categories: ["General Physician", "Cardiology"],
    },
    {
      id: 5,
      name: "Dr. David Wilson",
      rating: 5,
      study: "MBBS",
      favourite: true,
      categories: [
        "General Physician",
        "Cardiology",
        "Neurology",
        "Dermatology",
        "Pharmacy",
      ],
    },
  ];
  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{hospital.hospitalName} </Text>
      <TextInput
        style={{
          width: "auto",
          padding: 10,
          marginHorizontal: 20,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 20,
          paddingHorizontal: 15,
          color: "#333",
          marginBottom: 10,
        }}
        placeholder="Search..."
        placeholderTextColor="#666"
        onChangeText={handleSearch}
      />
      <ScrollView>
        <View>
          <View style={styles.optionsContainer}>
            <View style={{ width: "100%", height: "100%" }}>
            <Text style={{marginLeft:20,marginBottom:10,fontSize:14,fontWeight:'500'}}>Selected Category : {option.categoryName}</Text>
            {(searchText ? filteredDoctors : doctors)
                .filter((doctor) =>
                  doctor.categories.includes(option.categoryName)
                )
                .map((doctor) => (
                  <TouchableOpacity
                    key={doctor.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#D9D9D9",
                      marginHorizontal:20,
                      borderRadius: 10,
                      padding: 10,
                      marginBottom: 20,
                      elevation: 4,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    }}
                    onPress={() => {
                      navigation.navigate("DetailedDoctors", { doctor,hospital });
                    }}
                  >
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 5,
                        backgroundColor: "#fff",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={Doctorpng}
                        style={{ width: 50, height: 50, borderRadius: 5 }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        marginLeft: 10,
                      }}
                    >
                      <View
                        style={{
                          marginBottom: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          {doctor.name}  <Text style={{fontSize:12}}>({doctor.study})</Text>
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        {[...Array(doctor.rating)].map((_, index) => (
                          <Text
                            key={index}
                            style={{
                              marginRight: 5,
                              fontSize: 14,
                              color: "#666",
                            }}
                          >
                            ⭐
                          </Text>
                        ))}
                       
                        <View
                          style={{ position: "absolute", top: -10, right: 20 }}
                        >
                          <FontAwesome
                            name="heart"
                            size={24}
                            color={doctor.favourite ? "red" : "#666"}
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 5,
    display: "flex",
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
  customImageContainer: {
    marginRight: 10,
  },
  customImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  customCategoryName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
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


  plusText: {
    fontSize: 20,
    color: "#333",
    paddingTop: 5,
  },
});

export default HospitalDetailScreen;
