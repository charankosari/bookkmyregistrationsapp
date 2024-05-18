import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Doctorpng from "../../assets/doctor.png";
export default function HospitalCategories({navigation,route}) {
    const { lab } = route.params;
    const options = [
        { id: 1, categoryName: "Blood Test" },
        { id: 2, categoryName: "X-Ray" },
        { id: 3, categoryName: "MRI Scan" },
        { id: 4, categoryName: "CT Scan" },
        { id: 5, categoryName: "Ultrasound" },
        { id: 6, categoryName: "ECG/EKG" },
        { id: 7, categoryName: "Endoscopy" },
        { id: 8, categoryName: "Colonoscopy" },
        { id: 9, categoryName: "Biopsy" },
        { id: 10, categoryName: "Echocardiogram" },
        { id: 11, categoryName: "Pap Smear" },
        { id: 12, categoryName: "Urinalysis" },
        { id: 13, categoryName: "Stool Test" },
        { id: 14, categoryName: "Electrolyte Panel" },
        { id: 15, categoryName: "Thyroid Function Test" },
      ];
      
  const handleOptionPress = (option) => {

    navigation.navigate("LabDetails", { option,lab })

  };
  return (
    <SafeAreaView  style={{
        container: {
          flex: 1,
          backgroundColor: "#fff",
          paddingHorizontal: 20,
          paddingTop: Platform.OS === "android" ? 40 : 20,
        },
      }}>
         <Text style={styles.title}>{lab.labName} </Text>
    <ScrollView
     
    >

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionBox}
            onPress={() => handleOptionPress(option)}
          >
            <View style={styles.imageContainer}>
              <Image source={Doctorpng} style={styles.image} />
            </View>
            <Text style={styles.categoryName}>{option.categoryName}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 5,
    display: "flex",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft:10,
    paddingLeft: 20,
  },
  optionBox: {
    width: "30%",
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    marginLeft:7

  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2BB673",
    width: "70%",
    height: 60,
    borderRadius: 5,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    height: 40,
  },
});
