import React, { useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { useRoute } from "@react-navigation/native";

export default function ImageScreen() {
  const route = useRoute();
  const { uri } = route.params;
  const [loading, setLoading] = useState(true);

  const onLoadEnd = () => {
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: uri }}
        style={styles.image}
        resizeMode="contain"
        onLoadEnd={onLoadEnd}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2BB673" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: Dimensions.get('window').width, // or '100%'
    height: Dimensions.get('window').height, // or '100%'
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
