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
  import moment from 'moment'
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { FontAwesome } from "@expo/vector-icons";
  import DoctorPng from "../../assets/doctor.png";
  import { AirbnbRating } from "react-native-ratings";

  const DetailedDoctors = ({ route, navigation }) => {
    const { doctor, hospital } = route.params;
    const [weekDates, setWeekDates] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedDayTimes, setSelectedDayTimes] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedRating, setSelectedRating] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favoriteLoading, setFavoriteLoading] = useState(true);
    const [today,setToday]=useState(moment().format() )

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
            `https://server.bookmyappointments.in/api/bma/doc/${doctor._id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const responseData = await response.json();

          if (response.ok) {
            const dates = Object.keys(responseData.doctor.bookingsids);
            const formattedDates = dates.map((date) => {
              const dayData = responseData.doctor.bookingsids[date];
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
    }, [doctor._id]);

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
            console.log(today)
            const isDoctorFavorite = responseData.data.doctors.some(
              (item) => item._id === doctor._id
            );
            setIsFavorite(isDoctorFavorite);
            setFavoriteLoading(false)
            console.log(doctor.image)
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
        setFavoriteLoading(true);
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(
          `https://server.bookmyappointments.in/api/bma/me/wishlist/${doctor._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({
              type: "doctor", 
            }),
          }
        );

        const responseData = await response.json();

        if (response.ok) {
          Alert.alert("Success", responseData.message);
          setIsFavorite(!isFavorite); 
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
    const filterTodayTimes = (times) => {
      const now = moment();
      return times.filter((time) => {
        const slotTime = moment(time.time, "HH:mm");
        return slotTime.isAfter(now)
      });
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
    
      // Function to filter dates based on time criteria
      const filterDatesByTime = (dates) => {
        const currentDate = moment();
        return dates.reduce((filteredDates, day) => {
          const isToday = moment(`${day.date}-${day.month}-${day.year}`, 'DD-MM-YYYY').isSame(currentDate, 'day');
          if (!isToday) {
            filteredDates.push(day);
          } else {
            const allTimes = [...day.morningTimes, ...day.eveningTimes];
            const hasValidTime = allTimes.some(time => moment(time, 'HH:mm').isSameOrAfter(currentDate, 'minute'));
            if (hasValidTime) {
              filteredDates.push(day);
            }
          }
          return filteredDates;
        }, []);
      };
    
      const filteredWeekDates = filterDatesByTime(weekDates);
    
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
          {filteredWeekDates.map((day, index) => (
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
        navigation.navigate("DetailedHospitalBooking", {
          selectedDate: selectedDay.date,
          selectedTime: selectedTime.time,
          doctorDetails: doctor,
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
              source={{ uri: doctor.image }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 10,
                objectFit:'contain'
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
                {doctor.name}
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                {doctor.study}
              </Text>
            </View>
            <TouchableOpacity
    onPress={handleFavouritePress}
    style={{
      marginRight: 20,
      marginBottom: 30,
      alignItems: 'center',
      justifyContent: 'center',
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
          

          <WeekDetails weekDates={weekDates} />

          {selectedDayTimes && (
            <TimeDetails
            morningTimes={
              moment(selectedDay.date, 'DD-MM-YYYY').isSame(moment(), 'day')
                ? filterTodayTimes(selectedDayTimes.morningTimes)
                : selectedDayTimes.morningTimes
            }
            eveningTimes={
              moment(selectedDay.date, 'DD-MM-YYYY').isSame(moment(), 'day')
                ? filterTodayTimes(selectedDayTimes.eveningTimes)
                : selectedDayTimes.eveningTimes
            }
            />
          )}
          {selectedDay && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 20,
                backgroundColor: "#e6f7f2",
                padding: 10,
                marginLeft:20,
                marginRight:20,
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
