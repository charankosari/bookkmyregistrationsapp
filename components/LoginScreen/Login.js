import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
const KeyboardAwareScrollViewComponent = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSignUp = () => {
    navigation.replace('Register'); // Replace the current screen with the Register screen
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.inner}>
          <Text style={styles.header}>Login </Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter your email or password"
              textContentType='oneTimeCode'
              style={styles.textInput}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                textContentType='oneTimeCode'
                style={[styles.textInput, { width: '100%' }]}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={24} color="black" />
              </TouchableOpacity>
            </View>
            <Text style={styles.signUpText}>
              Don't have an account? <Text onPress={handleSignUp} style={styles.signUpLink}>Sign Up</Text>
            </Text>
            <TouchableOpacity onPress={() => {
              navigation.replace('HomeScreen')
            }} style={styles.loginButton}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
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
  loginButton: {
    backgroundColor: '#2BB673',
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
  signUpText: {
    marginTop: 24,
    fontSize: 16,
    marginBottom:24,
    textAlign: 'center',
  },
  signUpLink: {
    color: '#2BB673',
    textDecorationLine: 'underline',
  },
});

export default KeyboardAwareScrollViewComponent;
