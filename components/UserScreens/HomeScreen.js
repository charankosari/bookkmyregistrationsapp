import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import HospitalScreen from "../HospitalLabScreens/HospitalScreen";
import LabsScreen from "../HospitalLabScreens/LabsScreen";
const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("hospitals");
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Hi User</Text>
      </View>
      <ScrollView
      >
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              { borderLeftWidth: 1 },
              selectedCategory === "hospitals" && styles.activeCategory,
              styles.leftButton,
            ]}
            onPress={() => handleCategorySelect("hospitals")}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === "hospitals" && styles.activeText,
              ]}
            >
              Hospitals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              { borderRightWidth: 1 },
              selectedCategory === "labs" && styles.activeCategory,
              styles.rightButton,
            ]}
            onPress={() => handleCategorySelect("labs")}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === "labs" && styles.activeText,
              ]}
            >
              Labs
            </Text>
          </TouchableOpacity>
        </View>
        {selectedCategory === "hospitals" ? <HospitalScreen /> : <LabsScreen />}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  setLocationButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    flex: 1,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  leftButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rightButton: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "500",
  },
  activeCategory: {
    backgroundColor: "#2BB673",
  },
  activeText: {
    color: "#fff",
  },
});

export default HomeScreen;
