import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const Success = ({ navigation }) => {

  const handleNavigateHome = () => {
    navigation.navigate('Home'); 
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/bookingconfirmed.png')} style={styles.image} />
      <Text style={styles.header}>Booking Confirmed!</Text>
      <Text style={styles.bookingId}>Booking ID:56465</Text>
      <Text style={styles.message}>Thanks for choosing us.</Text>
      <TouchableOpacity onPress={handleNavigateHome} style={styles.button}>
        <Text style={styles.buttonText}>Go Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#fff'
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bookingId: {
    fontSize: 18,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2BB673',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Success;
