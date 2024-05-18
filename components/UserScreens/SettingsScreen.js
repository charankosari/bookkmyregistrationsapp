import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView,Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Default from '../../assets/default.jpg';

const SettingsScreen = ({navigation}) => {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
  
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.canceled === true) {
      return;
    }
  
    setProfileImage(pickerResult.uri);
  };

  const handleEditProfile = () => {
    console.log('hello');
  };

  const handleSignOut = () => {
    navigation.replace('Login')
  };

  return (
    <SafeAreaView style={styles.container}>
    <View >
      <TouchableOpacity onPress={handleImageUpload} style={{...styles.profileImageContainer,display:'flex',flexDirection:'row',justifyContent:'center',gap:20}}>
        <Image source={profileImage ? { uri: profileImage } : Default} style={styles.profileImage} />
        <View style={{...styles.userInfo,display:'flex',flexDirection:'column',gap:10}}>
        <Text style={styles.userName}>John Doe</Text>
        <TouchableOpacity onPress={handleEditProfile}>
          <Text style={styles.editProfile}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      </TouchableOpacity>
      
   
      
      {/* Options */}
      <TouchableOpacity style={styles.option}   onPress={()=>{navigation.navigate("My bookings")}}>
        <Text style={styles.optionText}>My Bookings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={()=>{navigation.navigate("Favourites")}}>
        <Text style={styles.optionText}>Favourites</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={()=>{navigation.navigate("My medical reports")}}>
        <Text style={styles.optionText}>My Medical Records</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={()=>{navigation.navigate("Help and Support")}}>
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
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 30,
    marginHorizontal:20
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 50,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  editProfile: {
    color: 'blue',
    fontSize: 16,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 18,
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
