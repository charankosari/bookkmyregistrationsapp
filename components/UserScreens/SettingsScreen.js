import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = ({ navigation }) => {
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isNumberModalVisible, setNumberModalVisible] = useState(false);
  const [initialName, setInitialName] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [initialNumber, setInitialNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const userToken = await AsyncStorage.getItem("jwtToken");
        if (userData) {
          const user = JSON.parse(userData);
          setInitialName(user.name);
          setInitialEmail(user.email);
          setInitialNumber(user.number.toString());
          setName(user.name);
          setEmail(user.email);
          setNumber(user.number.toString());
          setToken(userToken);
          setUserData(user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  const handleEditProfile = () => {
    setProfileModalVisible(true);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    const updatedFields = {};

    if (name !== initialName) updatedFields.name = name;
    if (email !== initialEmail) updatedFields.email = email;

    if (Object.keys(updatedFields).length === 0) {
      Alert.alert("No changes", "No changes were made to the profile.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/me/numberupdate",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFields),
        }
      );
      const data = await response.json();
      if (data.success) {
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));
        setProfileModalVisible(false);
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "An error occurred while updating the profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!newNumber) {
      Alert.alert("Error", "Please enter a new mobile number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/verifynumber",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ number: newNumber }),
        }
      );
      const data = await response.json();
     
      if (data.message === "OTP sent successfully") {
        setOtpSent(true);
        Alert.alert("Success", "OTP sent to the new mobile number.");
      } else {
        Alert.alert("Error", "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "An error occurred while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/me/numberupdate",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp:parseInt(otp),
            number: newNumber,
            userid: userData._id,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));
        setInitialNumber(newNumber);
        setNumber(newNumber);
        setNumberModalVisible(false);
        Alert.alert("Success", "Mobile number updated successfully!");
      } else {
        Alert.alert("Error", "Failed to verify OTP or update mobile number.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", "An error occurred while verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    AsyncStorage.removeItem("jwtToken");
    navigation.push("Login");
  };
const something=()=>{
  setOtpSent(false);
  setNumberModalVisible(!isNumberModalVisible);
  setNewNumber('')
}
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? 40 : 40,
        marginHorizontal: 20,
      }}
    >
      <View style={{ marginTop: 20 }}>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>{name}</Text>
          <Text style={styles.userInfoText}>{email}</Text>
          <TouchableOpacity
            onPress={handleEditProfile}
            style={{
              backgroundColor: "#004A77",
              textAlign: "center",
              marginTop: 5,
              paddingBottom: 10,
              paddingHorizontal: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, marginTop: 10 }}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isProfileModalVisible}
          onRequestClose={() => {
            setProfileModalVisible(!isProfileModalVisible);
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Edit Profile</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSaveProfile}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Save</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "grey" }]}
                  onPress={() => setProfileModalVisible(!isProfileModalVisible)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isNumberModalVisible}
          onRequestClose={() => {
            setNumberModalVisible(!isNumberModalVisible);
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Change Mobile Number</Text>
                {otpSent ? (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter OTP"
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleVerifyOtp}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Verify OTP</Text>
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="New Mobile Number"
                      value={newNumber}
                      onChangeText={setNewNumber}
                      keyboardType="phone-pad"
                    />
                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleSendOtp}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Send OTP</Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "grey" }]}
                  onPress={something}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Options */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            navigation.navigate("My bookings");
          }}
        >
          <Text style={styles.optionText}>My Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            navigation.navigate("Favourites");
          }}
        >
          <Text style={styles.optionText}>Favourites</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            setNumberModalVisible(true);
          }}
        >
          <Text style={styles.optionText}>Change Mobile Number</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            navigation.navigate("My medical reports");
          }}
        >
          <Text style={styles.optionText}>My Medical Records</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            navigation.navigate("Help and Support");
          }}
        >
          <Text style={styles.optionText}>Help and Support</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userInfoContainer: {
    backgroundColor: "#d7d7d7",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: Platform.OS === "android" ? 20 : 65,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: "90%",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2BB673",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 18,
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  signOutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SettingsScreen;
