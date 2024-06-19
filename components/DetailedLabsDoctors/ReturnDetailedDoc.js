import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import DoctorPng from "../../assets/doctor.png";
import moment from "moment";
import { AirbnbRating } from 'react-native-ratings'; 

const DetailedDoctors = ({ route, navigation }) => {
  const { doctor, hospital } = route.params;
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDaytimes, setSelectedDaytimes] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const ratings = [
    { id: 1, name: "Nikitha Apte", rating: 3, comment: "Great doctor!" },
    { id: 2, name: "John Doe", rating: 4, comment: "Very knowledgeable." },
    { id: 3, name: "Nikitha Apte", rating: 3, comment: "Great doctor!" },
    { id: 4, name: "John Doe", rating: 4, comment: "Very knowledgeable." },
    { id: 5, name: "Nikitha Apte", rating: 3, comment: "Great doctor!" },
    { id: 6, name: "John Doe", rating: 4, comment: "Very knowledgeable." },
  ];

  useEffect(() => {
    const fetchDoctorTimings = async () => {
     
      const dates = Object.keys(doctor.doctor.bookingsids);
      const weekDates = dates.map((date) => {
        const dayData = doctor.doctor.bookingsids[date];
        const morningAvailable = dayData.morning.some(
          (slot) => !slot.bookingId
        );
        const eveningAvailable = dayData.evening.some(
          (slot) => !slot.bookingId
        );
        const morningTimes = dayData.morning.map((slot) => ({
          id: slot.time,
          time: slot.time,
          bookingId: slot.bookingId,
        }));
        const eveningTimes = dayData.evening.map((slot) => ({
          id: slot.time,
          time: slot.time,
          bookingId: slot.bookingId,
        }));
        return {
          date: date,
          day: moment(date).format("dddd"),
          morningAvailable: morningAvailable,
          eveningAvailable: eveningAvailable,
          morningTimes: morningTimes,
          eveningTimes: eveningTimes,
        };
      });
      setWeekDates(weekDates);
    };

    fetchDoctorTimings();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");

        const response = await fetch(
          `https://server.bookmyappointments.in/api/bma/me/wishlist`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        const responseData = await response.json();

        if (response.ok) {
          const isDoctorFavorite = responseData.data.some(
            (item) => item._id === doctor.doctor._id
          );
          setIsFavorite(isDoctorFavorite);
        } else {
          Alert.alert("Error", responseData.message);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        Alert.alert("Error", "An error occurred while fetching the wishlist.");
      }
    };

    fetchWishlist();
  }, [doctor._id]);

  const handleFavouritePress = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      // console.log(doctor.doctor._id);
      const response = await fetch(
        `https://server.bookmyappointments.in/api/bma/me/wishlist/${doctor.doctor._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const responseData = await response.json();
      // console.log(responseData);

      if (response.ok) {
        Alert.alert("Success", responseData.message);
        setIsFavorite(!isFavorite); // Toggle favorite status
      } else {
        Alert.alert("Error", responseData.message);
      }
    } catch (error) {
      console.error("Error adding doctor to favorites:", error);
      Alert.alert("Error", "An error occurred while adding to favorites.");
    }
  };

  const handleDayPress = (day) => {
    setSelectedDay(day);
    setSelectedDaytimes(day);
    setSelectedTime(null); // Reset selected time when a new day is selected
    // console.log(doctor.timings);
  };

  const handleTimePress = (time) => {
    if (time.bookingId) {
      Alert.alert(
        "Slot Booked",
        "This slot is already booked. Please select another time."
      );
    } else {
      setSelectedTime(time);
    }
  };

  const handleRatingPress = (rating) => {
    setSelectedRating(rating);
  };

  const TimeDetails = ({ morningTimes, eveningTimes }) => {
    const allTimes = [...morningTimes, ...eveningTimes];

    return (
      <ScrollView
        horizontal={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: 22,
          marginTop: 20,
        }}
      >
        {allTimes.map((time) => (
          <TouchableOpacity
            key={time.id}
            style={{
              alignItems: "center",
              marginHorizontal: 5,
              backgroundColor:
                selectedTime && selectedTime.id === time.id
                  ? "#2BB673"
                  : time.bookingId
                  ? "#D9D9D9"
                  : "#ffffff",
              padding: 10,
              borderRadius: 10,
              borderWidth: 1,
              marginBottom: 10,
              borderColor: "#ccc", // Border color
              shadowColor: "#000", // Shadow color
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={() => handleTimePress(time)}
            disabled={time.bookingId}
          >
            <Text
              style={{
                fontSize: 16,
                color:
                  selectedTime && selectedTime.id === time.id
                    ? "white"
                    : time.bookingId
                    ? "gray"
                    : "black",
              }}
            >
              {time.time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const WeekDetails = ({ weekDates }) => {
    return (
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: 20,
          marginTop: 20,
        }}
      >
        {weekDates.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={{
              alignItems: "center",
              marginHorizontal: 5,
              backgroundColor:
                selectedDay === day ? "#2BB673" : "#fff",
              padding: 10,
              borderRadius: 10,
              borderWidth: 1,
              marginBottom: 10,
              borderColor: "#ccc", // Border color
              shadowColor: "#000", // Shadow color
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={() => handleDayPress(day)}
          >
            <Text
              style={{
                fontSize: 16,
                color: selectedDay === day ? "white" : "black",
              }}
            >
              {day.day.slice(0, 3)}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: selectedDay === day ? "white" : "black",
              }}
            >
              {day.date}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const handleBookNow = () => {
    if (!selectedDay || !selectedTime) {
      Alert.alert("Error", "Please select a date and time.");
    } else {
      navigation.navigate("DetailedHospitalBooking", {
        selectedDate: selectedDay.date,
        selectedTime: selectedTime.time,
        doctorDetails: doctor.doctor,
        hospital:hospital.hosp,
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? 40 : 20,
      }}
    >
      <ScrollView>
        <View
          style={{
            alignItems: "center",
            padding: 5,
            backgroundColor: "#f0f0f0",
            borderRadius: 10,
            display: "flex",
            flexDirection: "row",
            margin: 20,
          }}
        >
          <Image
            source={DoctorPng}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              flex: 1,
              marginLeft: 20,
            }}
          >
            <Text
              style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}
            >
              {doctor.doctor.name}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              {doctor.doctor.study}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleFavouritePress}
            style={{ marginRight: 20, marginBottom: 30 }}
          >
            <FontAwesome
              name={isFavorite ? "heart" : "heart-o"}
              style={{
                fontSize: 24,
                color: isFavorite ? "red" : "gray",
              }}
            />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 18, paddingLeft: 20, fontWeight: "500" }}>
          Ratings
        </Text>
        <ScrollView style={{ height: 270, width: "100%", padding: 20 }}>
          {ratings.map((rating) => (
            <View key={rating.id}>
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 20,
                  borderBottomColor: "#a5a58d",
                  borderBottomWidth: 1,
                  paddingVertical: 10,
                  alignItems: "center",
                }}
                onPress={() => handleRatingPress(rating)}
              >
                <Image source={DoctorPng} style={{ height: 40, width: 40 }} />
                <View style={{ display: "flex", flexDirection: "column" }}>
                  <View style={{ flexDirection: "row", gap: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: "500", width: 110 }}>
                      {rating.name}
                    </Text>
                    <AirbnbRating
                      count={5}
                      defaultRating={rating.rating}
                      size={24}
                      showRating={false}
                      isDisabled={true}
                    />
                  </View>
                  {selectedRating && selectedRating.id === rating.id && (
                    <Text
                      style={{
                        paddingLeft: 0,
                        paddingTop: 5,
                        marginBottom: 10,
                      }}
                    >
                      {rating.comment}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <WeekDetails weekDates={weekDates} />
        {selectedDaytimes && (
          <TimeDetails
            morningTimes={selectedDay.morningTimes}
            eveningTimes={selectedDay.eveningTimes}
          />
        )}

        <TouchableOpacity
          onPress={handleBookNow}
          style={{
            alignItems: "center",
            backgroundColor: "#2BB673",
            width: "40%",
            padding: 10,
            borderRadius: 5,
            marginTop: 20,
            marginLeft: 27,
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            Book Now
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailedDoctors;
