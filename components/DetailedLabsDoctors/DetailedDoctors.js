import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import DoctorPng from "../../assets/doctor.png";
import moment from "moment";
const DetailedDoctors = ({ route ,navigation}) => {
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const { doctor, hospital } = route.params;
  const [selectedRating, setSelectedRating] = useState(null);
  const ratings = [
    { id: 1, name: "Nikitha Apte", rating: "⭐⭐⭐", comment: "Great doctor!" },
    {
      id: 2,
      name: "John Doe",
      rating: "⭐⭐⭐⭐",
      comment: "Very knowledgeable.",
    },
    { id: 3, name: "Nikitha Apte", rating: "⭐⭐⭐", comment: "Great doctor!" },
    {
      id: 4,
      name: "John Doe",
      rating: "⭐⭐⭐⭐",
      comment: "Very knowledgeable.",
    },
    { id: 5, name: "Nikitha Apte", rating: "⭐⭐⭐", comment: "Great doctor!" },
    {
      id: 6,
      name: "John Doe",
      rating: "⭐⭐⭐⭐",
      comment: "Very knowledgeable.",
    },
  ];

  useEffect(() => {
    const getWeekDates = () => {
      const today = moment();
      const endOfWeek = moment(today).add(6, "days");

      const dates = [];
      let currentDate = moment(today);

      while (currentDate.isSameOrBefore(endOfWeek, "day")) {
        dates.push({
          day: currentDate.format("dddd"),
          date: currentDate.format("DD"),
        });
        currentDate.add(1, "day");
      }

      setWeekDates(dates);
    };

    getWeekDates();
  }, []);

  useEffect(() => {
    if (weekDates.length > 0) {
      setSelectedDay(weekDates[0]);
    }
  }, [weekDates]);
  const times = [
    { id: 1, time: "10AM" },
    { id: 2, time: "11AM" },
    { id: 5, time: "2PM" },
    { id: 6, time: "3PM" },
  ];
  const [selectedTime, setSelectedTime] = useState(times[0]);

  const handleDayPress = (day) => {
    setSelectedDay(day);
  };
  const handleTimePress = (time) => {
    setSelectedTime(time);
  };

  const handleRatingPress = (rating) => {
    setSelectedRating(rating);
  };
  const TimeDetails = ({ times }) => {
    return (
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: 22,
          marginTop: 20,
        }}
      >
        {times.map((time) => (
          <TouchableOpacity
            key={time.id}
            style={{
              alignItems: "center",
              marginHorizontal: 5,
              backgroundColor:
                selectedTime && selectedTime.id === time.id
                  ? "#2BB673"
                  : "#D9D9D9",
              padding: 5,
              borderRadius: 5,
            }}
            onPress={() => handleTimePress(time)}
          >
            <Text
              style={{
                fontSize: 16,
                color:
                  selectedTime && selectedTime.id === time.id
                    ? "white"
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
              marginHorizontal: 10,
              backgroundColor: selectedDay === day ? "#2BB673" : "#D9D9D9",
              padding: 5,
              borderRadius: 5,
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
    navigation.navigate("DetailedHospitalBooking", {
      selectedDate: selectedDay.date,
      selectedTime: selectedTime.time,
      doctorDetails: doctor,
      hospital,
    });
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
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
            {doctor.name}
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>{doctor.study}</Text>
          <FontAwesome
            name={doctor.favourite ? "heart" : "heart-o"}
            style={{
              fontSize: 24,
              position: "absolute",
              top: 20,
              right: 20,
              color: doctor.favourite ? "red" : "gray",
            }}
          />
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
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>
                      {rating.name}
                    </Text>
                    <Text>{rating.rating}</Text>
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
        <TimeDetails times={times} />
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
