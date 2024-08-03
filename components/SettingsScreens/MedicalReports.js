import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, TouchableOpacity,Platform, Modal, StyleSheet, FlatList, Alert, ActivityIndicator } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

const MedicalReports = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const [token, setToken] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [previewFileUrl, setPreviewFileUrl] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
          setToken(token);
          fetchFiles(token);
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    getToken();
  }, []);

  const fetchFiles = async (jwtToken) => {
    setFetching(true);
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
  
      if (result.canceled) {
        setUploadingFile(false);
        return;
      }
  
      
      if (type === 'file') {
        fileSize = result.assets[0].size;
        if (fileSize > 2 * 1024 * 1024) {
          Alert.alert("File size exceeds 2MB. Please select a smaller file.");
          setUploadingFile(false);
          return;
        }
        uri = result.assets[0].uri;
        name = result.assets[0].name;
        mimeType = result.assets[0].mimeType;
      } else {
        fileSize = result.assets[0].fileSize;
        if (fileSize > 2 * 1024 * 1024) {
          Alert.alert("Image size exceeds 2MB. Please select a smaller image.");
          setUploadingFile(false);
          return;
        }
    
        uri = result.assets[0].uri;
        name = result.assets[0].fileName;
        mimeType = result.assets[0].mimeType;
      }
      const formData = new FormData();
      const asset = result.assets[0];
      let uri, name, mimeType;
      if (type === 'file') {
        uri = asset.uri;
        name = asset.name;
        mimeType = asset.mimeType;
      } else {
        uri = asset.uri;
        name = asset.fileName;
        mimeType = asset.mimeType;
      }
      formData.append('file', {
        uri: uri,
        name: name,
        type: mimeType,
      });
      setModalVisible(false);
      setFetching(true);
      const response = await fetch('https://server.bookmyappointments.in/api/bma/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
  
      if (response.ok) {
        fetchFiles(jwtToken);
        handleCloseModal();
      } else {
        Alert.alert('Upload failed', 'Please try again.');
      }
    } catch (error) {
      console.log(result);
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setUploadingFile(false);
      setFetching(false);
    }
  };


  const handleDelete = async (filename) => {
    if (!deleteConfirmation) {
      setDeleteConfirmation(filename);
      return;
    }

    if (deleteConfirmation !== filename) {
      setDeleteConfirmation(null);
      return;
    }

    setDeleteConfirmation(null);

    const jwtToken = await AsyncStorage.getItem('jwtToken');
    try {
      const response = await fetch(`https://server.bookmyappointments.in/api/bma/delete/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
      if (response.ok) {
        const updatedFiles = files.filter(file => file.name !== filename);
        setFiles(updatedFiles);
      } else {
        Alert.alert('Delete failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleFileClick = (item) => {
    const fileType = item.name.split('.').pop().toLowerCase();
    if (fileType === 'pdf') {
      navigation.navigate('View Pdf', { uri: item.location });
    } else {
      navigation.navigate('View Image', { uri: item.location });
    }
  };
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} onPress={() => handleFileClick(item)}>
        <View style={styles.fileInfo}>
          <MaterialIcons name="insert-drive-file" size={24} color="#2BB673" style={styles.fileIcon} />
          <Text style={styles.fileName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.name)}>
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

      {loadingFile && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2BB673" />
          <Text style={styles.loadingText}>Downloading...</Text>
        </View>
      )}

      {previewFileUrl && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={!!previewFileUrl}
          onRequestClose={() => setPreviewFileUrl(null)}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ margin: 20 }} onPress={() => setPreviewFileUrl(null)}>
              <Text style={{ color: 'blue' }}>Close Preview</Text>
            </TouchableOpacity>
            <WebView
              source={{ uri: previewFileUrl }}
              style={{ flex: 1 }}
            />
          </View>
        </Modal>
      )}

      {deleteConfirmation && (
        <View style={styles.deleteConfirmation}>
          <View style={styles.deleteConfirmationText}>
            <Text>Are you sure you want to delete this file?</Text>
            <View style={styles.deleteConfirmationButtons}>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setDeleteConfirmation(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => handleDelete(deleteConfirmation)}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop:Platform.OS==='ios'?0:30

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
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding:5,
    width:'85%'
  },
  fileIcon: {
    marginRight: 10,
  },
  fileName: {
    fontSize: 16,
    color: 'black',
  },
  deleteButton: {
    padding: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2BB673',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#2BB673',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalCloseButton: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
  },
  deleteConfirmation: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteConfirmationText: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
    textAlign: 'center',
  },
  deleteConfirmationButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap:20,
    justifyContent:'center'
  },
  confirmButton: {
    backgroundColor: '#2BB673',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MedicalReports;