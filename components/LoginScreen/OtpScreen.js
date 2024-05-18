import React, { useState, useRef } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const OtpScreen = () => {
    const navigation = useNavigation();
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpInputs = Array.from({ length: 4 }, () => useRef(null));

  const handleOtpInput = (index, value) => {
    if (value.length <= 1 && /\d/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);
      
      if (value.length === 1 && index < 3) {
        otpInputs[index + 1].current.focus();
      }
    }
  };

  const handleVerifyNow = () => {
    console.log('Verifying OTP:', otp.join(''));
    navigation.replace('HomeScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>We have sent you the code </Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={otpInputs[index]}
            style={[styles.otpInput]} 
            maxLength={1}
            keyboardType="numeric"
            onChangeText={(value) => handleOtpInput(index, value)}
            value={digit}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyNow}>
        <Text style={styles.verifyButtonText}>Verify Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#2BB673',
    width: 50,
    height: 50,
    fontSize: 20,
    textAlign: 'center',
    marginRight: 10,
  },
  verifyButton: {
    backgroundColor: '#2BB673',
    paddingHorizontal: 20,
    alignItems:'center',
    display:'flex',
    justifyContent:'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  verifyButtonText: {
    color: 'white',
    alignItems:'center',
    fontSize: 18,
  },
});

export default OtpScreen;
