import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyBookings = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [jwt, setJwt] = useState('');
  const fetchDoctorAndHospitalData = async (itemId, hospitalId) => {
    setLoading(true)
    try {
      const doctorResponse = await fetch(`https://server.bookmyappointments.in/api/bma/doc/${itemId}`);
      const doctorData = await doctorResponse.json();
  
      const hospitalResponse = await fetch(`https://server.bookmyappointments.in/api/bma/hospital/hospital/${hospitalId}`);
      const hospitalData = await hospitalResponse.json();
  setLoading(false)
      return { doctor: doctorData, hospital: hospitalData };
    } catch (error) {
      setLoading(false)
      console.error("Error fetching doctor or hospital data:", error);
      return null;
    }
  };
  

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        setJwt(jwtToken);
        const response = await fetch('https://server.bookmyappointments.in/api/bma/me/wishlist', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const responseData = await response.json();
        if (response.ok) {
          setWishlist(responseData.data);
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
          {wishlist.map((item) => (
           <TouchableOpacity
           key={item._id}
  onPress={async () => {
    const { doctor, hospital } = await fetchDoctorAndHospitalData(item._id, item.hospitalid);
    if (doctor && hospital) {
      navigation.navigate('Return doctor details', { doctor, hospital });
    } else {
    }
  }}
         >
              <View style={styles.card}>
                <Image
                  source={{ uri: "https://imgs.search.brave.com/llw5Me8WgZERr-0oFufqGCziE0oWjCvP9AZIiFf8wyU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9k/b2N0b3Itd2l0aC13/aGl0ZS1yb2JlLXN0/ZXRob3Njb3BlXzE0/NDYyNy00Mzg3OS5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw" }}
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.specialist}>{item.specialist}</Text>
                  <Text style={styles.study}>{item.study}</Text>
                  <Text style={styles.experience}>Experience: {item.experience} years</Text>
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
  },
  study: {
    fontSize: 14,
    color: '#333',
  },
  experience: {
    fontSize: 14,
    color: '#555',
  },
});

export default MyBookings;
