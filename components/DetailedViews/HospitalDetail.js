import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import Doctorpng from "../../assets/doctor.png";
import { AirbnbRating } from "react-native-ratings";
import moment from "moment";

const HospitalDetailScreen = ({ navigation, route }) => {
  const { hospital, option } = route.params;
  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(
        `https://server.bookmyappointments.in/api/bma/user/doctors/${hospital._id}`
      );
      const data = await response.json();
      setDoctors(data.hospital.doctors);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  const hasFutureBookings = (bookingids) => {
    const today = moment().startOf('day');
    return Object.keys(bookingids).some(date => moment(date, "DD-MM-YYYY").isSameOrAfter(today));
  };

  const filteredDoctorsList = (searchText ? filteredDoctors : doctors).filter(
    (doctor) =>
      doctor.specialist &&
      doctor.specialist.includes(option.categoryName) &&
      hasFutureBookings(doctor.bookingsids)
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: Platform.OS === "android" ? 0 : 20,
        paddingTop: Platform.OS === "android" ? 40 : 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 10,
          paddingLeft: 20,
        }}
      >
        {hospital.hospitalName}
      </Text>
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

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          size="large"
          color="#000"
        />
      ) : (
        <ScrollView>
          <View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: 5,
                display: "flex",
              }}
            >
              <View style={{ width: "100%", height: "100%" }}>
                <Text
                  style={{
                    marginLeft: 20,
                    marginBottom: 10,
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  Selected Category : {option.categoryName}
                </Text>
                {filteredDoctorsList.length === 0 ? (
                  <Text
                    style={{
                      marginLeft: 20,
                      marginBottom: 10,
                      fontSize: 18,
                      color: "#ff0000",
                    }}
                  >
                    No doctors available at the moment
                  </Text>
                ) : (
                  filteredDoctorsList.map((doctor) => (
                    <TouchableOpacity
                      key={doctor._id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#D9D9D9",
                        marginHorizontal: 20,
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
                        navigation.navigate("DetailedDoctors", {
                          doctor,
                          hospital,
                        });
                      }}
                    >
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 5,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={{ uri: doctor.image }}
                          style={{ width: 60, height: 60, borderRadius: 5,objectFit:'contain' }}
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
                            {doctor.name}{" "}
                            <Text style={{ fontSize: 12 }}>
                              ({doctor.study})
                            </Text>
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <AirbnbRating
                            count={5}
                            size={24}
                            defaultRating={4}
                            showRating={false}
                            isDisabled={true}
                          />
                          <View
                            style={{
                              position: "absolute",
                              top: -25,
                              right: 20,
                            }}
                          >
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HospitalDetailScreen;
