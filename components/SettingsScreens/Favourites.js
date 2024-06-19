import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyBookings = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [doctors,setDoctors]=useState([])
  const [tests,setTests]=useState([])
  const [jwt, setJwt] = useState('');

  // Function to fetch doctor and hospital data
  const fetchDoctorAndHospitalData = async (itemId, hospitalId) => {
    setLoading(true);
    try {
      const doctorResponse = await fetch(`https://server.bookmyappointments.in/api/bma/doc/${itemId}`);
      const hospitalResponse = await fetch(`https://server.bookmyappointments.in/api/bma/hospital/hospital/${hospitalId}`);
      
      const doctorData = await doctorResponse.json();
      const hospitalData = await hospitalResponse.json();
      
      setLoading(false);
      return { doctor: doctorData, hospital: hospitalData };
    } catch (error) {
      setLoading(false);
      console.error("Error fetching doctor or hospital data:", error);
      return null;
    }
  };

  // Fetch wishlist items from API
  useEffect(() => {
    const fetchWishlist = async () => {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      try {
        setJwt(jwtToken);
        const response = await fetch('https://server.bookmyappointments.in/api/bma/me/wishlist', {
          method:"GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const responseData = await response.json();
        if (responseData.success) {
          setDoctors(responseData.data.doctors || []);
          setTests(responseData.data.tests || []);
        } else {
          console.error("Error fetching wishlist:", responseData.message);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2BB673" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 20, marginLeft: 5}}>Favourites</Text>
          
          {doctors.map((doctor) => (
            <TouchableOpacity
              key={doctor._id}
              onPress={async () => {
                const { doctor: fetchedDoctor, hospital } = await fetchDoctorAndHospitalData(doctor._id, doctor.hospitalid);
                if (fetchedDoctor && hospital) {
                  navigation.navigate('Return doctor details', { doctor: fetchedDoctor, hospital });
                } else {
                  // Handle error or empty data scenario
                }
              }}
            >
              <View style={styles.card}>
                <Image
                  source={{ uri: "https://example.com/default-image.jpg" }} // Replace with actual image source logic
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{doctor.name}</Text>
                  <Text style={styles.specialist}>{doctor.specialist}</Text>
                  <Text style={styles.study}>{doctor.study}</Text>
                  <Text style={styles.experience}>Experience: {doctor.experience || ''} years</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {tests.map((test) => (
            <TouchableOpacity
              key={test._id}
              onPress={() => {
                navigation.navigate('LabDetails'); // Navigate to lab details directly
              }}
            >
              <View style={styles.card}>
                <Image
                  source={{ uri: "https://example.com/default-image.jpg" }} // Replace with actual image source logic
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{test.name}</Text>
                  <Text style={styles.testName}>{test.testName}</Text>
                  {/* Add other fields specific to tests as needed */}
                </View>
              </View>
            </TouchableOpacity>
          ))}
   
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  specialist: {
    fontSize: 16,
    color: '#333',
  },
  study: {
    fontSize: 14,
    color: '#333',
  },
  experience: {
    fontSize: 14,
    color: '#555',
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default MyBookings;