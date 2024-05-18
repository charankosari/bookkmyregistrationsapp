import React, { useState } from 'react';
import { View, KeyboardAvoidingView, TextInput, StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity, Keyboard, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const KeyboardAwareScrollViewComponent = () => {
  const [showPassword, setShowPassword] = useState(false); // State to track password visibility
  const navigation = useNavigation();

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.header}>Register </Text>
          <View style={styles.inputContainer}>
            <TextInput placeholder="Name" style={styles.textInput} />
            <TextInput placeholder="Email" style={styles.textInput} />
            <TextInput placeholder="Phone Number" keyboardType="phone-pad" style={styles.textInput} />
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
                textContentType='oneTimeCode'
                secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
                style={[styles.textInput, { width: '100%' }]}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={24} color="black" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => navigation.replace('Otp')} style={styles.registerButton}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <Text style={styles.signInText}>
              Already have an account? <Text onPress={() => navigation.replace('Login')} style={styles.signInLink}>Sign In</Text>
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  header: {
    fontSize: 36,
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInText: {
    marginTop: 24,
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  signInLink: {
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
});

export default KeyboardAwareScrollViewComponent;
