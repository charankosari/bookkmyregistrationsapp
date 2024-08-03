import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Doctorpng from '../../assets/doctor.png';

const MyBookings = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [tests, setTests] = useState([]);
  const [jwt, setJwt] = useState('');

  const capitalizeFirstLetter = (string) => {
    if (!string) return ''; 
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const fetchDoctorAndHospitalData = async (itemId, hospitalId) => {
    try {
      const [doctorResponse, hospitalResponse] = await Promise.all([
        fetch(`https://server.bookmyappointments.in/api/bma/doc/${itemId}`),
        fetch(`https://server.bookmyappointments.in/api/bma/hospital/hospital/${hospitalId}`)
      ]);

      const [doctorData, hospitalData] = await Promise.all([
        doctorResponse.json(),
        hospitalResponse.json()
      ]);

      return { doctor: doctorData.doctor, hospital: hospitalData.hosp };
    } catch (error) {
      console.error("Error fetching doctor or hospital data:", error);
      return null;
    }
  };

  const fetchWishlist = async () => {
    const jwtToken = await AsyncStorage.getItem("jwtToken");
    setJwt(jwtToken);
    try {
      const response = await fetch('https://server.bookmyappointments.in/api/bma/me/wishlist', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const responseData = await response.json();
      if (responseData.success) {
        const doctorsWithHospital = await Promise.all(responseData.data.doctors.map(async (doctor) => {
          const fetchedData = await fetchDoctorAndHospitalData(doctor._id, doctor.hospitalid);
          if (fetchedData) {
            return { ...fetchedData.doctor, hospital: fetchedData.hospital }; 
          }
          return null; 
        }));

        const testsWithHospital = await Promise.all(responseData.data.tests.map(async (test) => {
          const hospitalResponse = await fetch(`https://server.bookmyappointments.in/api/bma/hospital/hospital/${test.hospitalid}`);
          const hospitalData = await hospitalResponse.json();
          return { ...test, hospital: hospitalData.hosp }; 
        }));

        setDoctors(doctorsWithHospital.filter(item => item !== null)); 
        setTests(testsWithHospital);
      } else {
        console.error("Error fetching wishlist:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          <Text style={styles.header}>Favourites</Text>
          
          {doctors.map((doctor) => (
            <TouchableOpacity
              key={doctor._id}
              onPress={() => navigation.navigate('Return doctor details', { doctor, hospital: doctor.hospital })}
            >
              <View style={styles.card}>
                <Image source={{uri:doctor.image}} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.hospitalName}>{capitalizeFirstLetter(doctor.hospital?.hospitalName) || 'Unknown Hospital'}</Text>
                  <Text style={styles.name}>{capitalizeFirstLetter(doctor.name)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {tests.map((test) => (
            <TouchableOpacity
              key={test._id}
              onPress={() => navigation.navigate('DetailedLabs',{option:test.name,hospital:test.hospital})}
            >
              <View style={styles.card}>
                <Image source={{uri:test.image[0]}} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.hospitalName}>{capitalizeFirstLetter(test.hospital?.hospitalName) || 'Unknown Hospital'}</Text>
                  <Text style={styles.name}>{capitalizeFirstLetter(test.name)}</Text>
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
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 5,
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
    width: 70,
    height: 70,
    borderRadius: 40,
    marginRight: 15,
    objectFit:'contain'
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default MyBookings;
