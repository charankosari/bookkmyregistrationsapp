import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, Modal, StyleSheet, FlatList, Alert, Linking, ActivityIndicator } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MedicalReports = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const [token, setToken] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
          setToken(token);
          fetchFiles(token); // Fetch files after token is retrieved
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    getToken();
  }, []);

  const fetchFiles = async () => {
    setFetching(true);
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    try {
      const response = await fetch('https://server.bookmyappointments.in/api/bma/getfiles', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setFiles(data.files.files);
      } else {
        Alert.alert('Error', 'Failed to fetch files.');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      Alert.alert('Error', 'Failed to fetch files.');
    } finally {
      setFetching(false);
    }
  };

  const handleAddReport = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleUpload = async (type) => {
    setUploadingFile(true);
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    let result;
    try {
      if (type === 'file') {
        result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
      }

      if (result.canceled) return;

      const formData = new FormData();
      formData.append('file', {
        uri: result.uri,
        name: result.name || 'image.jpg',
        type: result.type || 'image/jpeg',
      });

      const response = await fetch('https://server.bookmyappointments.in/api/bma/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        fetchFiles(token);
        handleCloseModal();
      } else {
        Alert.alert('Upload failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDelete = async (filename) => {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    try {
      const response = await fetch(`https://server.bookmyappointments.in/api/bma/delete/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        fetchFiles();
      } else {
        Alert.alert('Delete failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} onPress={() => Linking.openURL(item.location)}>
        <Text style={styles.fileName}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item.name)}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Medical Reports</Text>
        {fetching ? (
          <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#2BB673" />
        ) : files.length === 0 ? (
          <View style={styles.noReportsContainer}>
            <Text style={styles.noReportsText}>No medical reports available</Text>
          </View>
        ) : (
          <FlatList
            data={files}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles.list}
          />
        )}
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddReport}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Report</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleUpload('file')}
            >
              <Text style={styles.modalButtonText}>Add File</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleUpload('image')}
            >
              <Text style={styles.modalButtonText}>Add Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {uploadingFile && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2BB673" />
          <Text style={styles.loadingText}>Uploading...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  noReportsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noReportsText: {
    fontSize: 18,
    color: 'grey',
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    color: '#333',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2BB673',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#2BB673',
    alignItems: 'center',
    marginVertical: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalCloseButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'grey',
    alignItems: 'center',
    marginVertical: 5,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
});

export default MedicalReports;