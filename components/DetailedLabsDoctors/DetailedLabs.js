import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import DoctorPng from "../../assets/doctor.png";
import { AirbnbRating } from "react-native-ratings";

const DetailedDoctors = ({ route, navigation }) => {
  const { option, hospital } = route.params;
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayTimes, setSelectedDayTimes] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(true);
  const [test, setTest] = useState(null);

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
      try {
        const response = await fetch(
          `https://server.bookmyappointments.in/api/bma/user/labs/${hospital._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = await response.json();
        console.log(responseData);

        if (response.ok) {
          const tests = responseData.hospital.tests;
          console.log(tests, option);
          const filteredTest = tests.find(
            (test) => test.name === option.categoryName
          );
          console.log(filteredTest);
          setTest(filteredTest);

          if (filteredTest) {
            const dates = Object.keys(filteredTest.bookingsids);
            const formattedDates = dates.map((date) => {
              const dayData = filteredTest.bookingsids[date];
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
                date,
                day: new Date(date).toLocaleDateString("en-GB", {
                  weekday: "long",
                }),
                morningAvailable,
                eveningAvailable,
                morningTimes,
                eveningTimes,
              };
            });

            setWeekDates(formattedDates);

            // Fetch wishlist and check if the test is in the wishlist
            const fetchWishlist = async () => {
              try {
                const token = await AsyncStorage.getItem('jwtToken');
                if (!token) {
                  console.log('No token found');
                  return;
                }

                const wishlistResponse = await fetch('https://server.bookmyappointments.in/api/bma/me/wishlist', {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });

                if (!wishlistResponse.ok) {
                  throw new Error('Network response was not ok');
                }

                const wishlistData = await wishlistResponse.json();
                const wishlistTests = wishlistData.data.tests;

                const isFavourite = wishlistTests.some(item => item._id === filteredTest._id);
                setIsFavorite(isFavourite);
              } catch (error) {
                console.error('Error fetching wishlist:', error);
              } finally {
                setFavoriteLoading(false);
              }
            };

            fetchWishlist();
          } else {
            Alert.alert("Error", "Selected test not found.");
          }
        } else {
          Alert.alert("Error", responseData.message);
        }
      } catch (error) {
        console.error("Error fetching doctor timings:", error);
        Alert.alert(
          "Error",
          "An error occurred while fetching doctor timings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorTimings();
  }, [hospital._id, option]);

  const handleFavouritePress = async () => {
    try {
      setFavoriteLoading(true);
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      console.log(test);
      const response = await fetch(
        `https://server.bookmyappointments.in/api/bma/me/wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            type: "test",
            testId: test._id,
          }),
        }
      );

      const responseData = await response.json();
      console.log(responseData);

      if (response.ok) {
        Alert.alert("Success", responseData.message);
        setIsFavorite(!isFavorite); // Toggle favorite status
      } else {
        Alert.alert("Error", responseData.message);
      }
    } catch (error) {
      console.error("Error adding doctor to favorites:", error);
      Alert.alert("Error", "An error occurred while adding to favorites.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleDayPress = (day) => {
    // Reset selected time when a new day is selected
    setSelectedDay(day);
    setSelectedDayTimes(day);
    setSelectedTime(null);
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
    if (!morningTimes || !eveningTimes) {
      return null; // Return nothing if timings are not available
    }

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
    if (!weekDates || weekDates.length === 0) {
      return (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text>No available slots at the moment</Text>
        </View>
      );
    }

    return (
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: 20,
          marginTop: 20,
        }}
        scrollEventThrottle={16}
      >
        {weekDates.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={{
              alignItems: "center",
              marginHorizontal: 5,
              backgroundColor: selectedDay === day ? "#2BB673" : "#fff",
              padding: 10,
              borderRadius: 10,
              borderWidth: 1,
              marginBottom: 10,
              borderColor: "#ccc",
              shadowColor: "#000",
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
      navigation.navigate("DetailedLabBooking", {
       selectedDate: selectedDay.date,
        selectedTime: selectedTime.time,
        testDetails: test,
        hospital,
      });
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2BB673" />
      </View>
    );
  }

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
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
            >
              {hospital.hospitalName.charAt(0).toUpperCase() +
                hospital.hospitalName.slice(1)}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
              {test.name.charAt(0).toUpperCase() + test.name.slice(1)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleFavouritePress}
            style={{
              marginRight: 20,
              marginBottom: 30,
              alignItems: "center",
              justifyContent: "center",
              width: 50,
              height: 50,
            }}
            disabled={favoriteLoading} // Disable button while loading
          >
            {favoriteLoading ? (
              <ActivityIndicator size="small" color="#2BB673" />
            ) : (
              <FontAwesome
                name={isFavorite ? "heart" : "heart-o"}
                style={{
                  fontSize: 24,
                  color: isFavorite ? "red" : "gray",
                }}
              />
            )}
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
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 0,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{ fontSize: 16, fontWeight: "500", width: 110 }}
                    >
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
        {selectedDay && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
              backgroundColor: "#e6f7f2",
              padding: 10,
              marginLeft: 20,
              marginRight: 20,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#333",
                marginRight: 10,
              }}
            >
              Selected Date:{" "}
              <Text style={{ color: "#2BB673" }}>{selectedDay.date}</Text>
            </Text>
            {selectedTime && (
              <Text style={{ fontSize: 12, fontWeight: "bold", color: "#333" }}>
                Selected Time:{" "}
                <Text style={{ color: "#2BB673" }}>{selectedTime.time}</Text>
              </Text>
            )}
          </View>
        )}

        <WeekDetails weekDates={weekDates} />

        {selectedDayTimes && (
          <TimeDetails
            morningTimes={selectedDayTimes.morningTimes}
            eveningTimes={selectedDayTimes.eveningTimes}
          />
        )}
        <View style={{ display: "flex", alignItems: "center" }}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailedDoctors;
