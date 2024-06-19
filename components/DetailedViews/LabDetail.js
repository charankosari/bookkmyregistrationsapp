// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   Platform,
//   SafeAreaView,
//   TextInput,
//   ScrollView,
// } from "react-native";
// import Doctorpng from "../../assets/doctor.png";
// import { FontAwesome } from "@expo/vector-icons";


// const LabDetailScreen = ({ navigation, route }) => {
//   const { hospital, option } = route.params;
//   const [searchText, setSearchText] = useState("");
//   const [filteredDoctors, setFilteredDoctors] = useState([]);
//   // const something =
//   //   {"__v": 12, "_id": "6666a7eae3515a706eecce52", "address": [{"city": "Jubilee Hills", "latitude": 17.4164086, "longitude": 78.4127457, "pincode": 500033}], "category": [{"types": "General Physician"}, {"types": "Dental Care"}, {"types": "Homoepathy"}, {"types": "Ayurveda"}, {"types": "Mental Wellness"}, {"types": "Physiotherapy"}], "doctors": [{"doctorid": "6666a7fee3515a706eecce57"}, {"doctorid": "6666a85de3515a706eecce5d"}, {"doctorid": "6666a873e3515a706eecce63"}, {"doctorid": "6666a8a7e3515a706eecce6c"}, {"doctorid": "6666a8bee3515a706eecce72"}, {"doctorid": "6666a8f0e3515a706eecce78"}], "email": "shivacharankosari099@gmail.com", "hospitalName": "Appolo hospital", "image": ["https://www.apolloinformationcentre.com/wp-content/uploads/2019/09/hyderabad.jpg"], "number": 7993264289, "role": "hospital"} {"_id": "6666a7fee3515a706eecce57", "bookingsids": {"2024-06-10": {"evening": [Array], "morning": [Array]}, "2024-06-11": {"evening": [Array], "morning": [Array]}}, "experience": 9, "hospitalid": "6666a7eae3515a706eecce52", "name": "Dr. Nicholas ", "specialist": "General Physician", "study": "MBBS", "timings": {"evening": [[Object]], "morning": [[Object]]}}
  
//   const doctors = [
//     {
//       id: 1,
//       name: "Dr. John Doe",
//       rating: 4,
//       study: "MBBS",
//       favourite: true,
//       categories: ["Blood Test"],
//     },
//     {
//       id: 2,
//       name: "Dr. Sarah Smith",
//       rating: 3,
//       study: "MD",
//       favourite: false,
//       categories: ["Blood Test", "ECG/EKG"],
//     },
//     {
//       id: 3,
//       name: "Dr. Michael Johnson",
//       rating: 5,
//       study: "MBBS",
//       favourite: true,
//       categories: ["Blood Test", "X-Ray"],
//     },
//     {
//       id: 4,
//       name: "Dr. Emily Brown",
//       rating: 4,
//       study: "MD",
//       favourite: false,
//       categories: ["Blood Test", "X-Ray"],
//     },
//     {
//       id: 5,
//       name: "Dr. David Wilson",
//       rating: 5,
//       study: "MBBS",
//       favourite: true,
//       categories: [
//         "ECG/EKG",
//         "Blood Test",
//         "CT Scan",
//         "MRI Scan",
//         "X-Ray",
//       ],
//     },
//   ];
//   const handleSearch = (text) => {
//     setSearchText(text);
//     const filtered = doctors.filter((doctor) =>
//       doctor.name.toLowerCase().includes(text.toLowerCase())
//     );
//     setFilteredDoctors(filtered);
//   };
//   return (
//     <SafeAreaView style={{  flex: 1,
//       backgroundColor: "#fff",
//       paddingHorizontal: 20,
//       paddingTop: Platform.OS === "android" ? 40 : 20,}}>
//       <Text style={{ fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     paddingLeft: 20,}}>{lab.labName} </Text>
//       <TextInput
//         style={{
//           width: "auto",
//           padding: 10,
//           marginHorizontal: 20,
//           borderColor: "#ccc",
//           borderWidth: 1,
//           borderRadius: 20,
//           paddingHorizontal: 15,
//           color: "#333",
//           marginBottom: 10,
//         }}
//         placeholder="Search..."
//         placeholderTextColor="#666"
//         onChangeText={handleSearch}
//       />
     
//       <ScrollView>
//         <View>
//           <View style={{   flexDirection: "row",
//     flexWrap: "wrap",
//     paddingHorizontal: 5,
//     display: "flex",}}>
//             <View style={{ width: "100%", height: "100%" }}>
//               <Text style={{marginLeft:20,marginBottom:10,fontSize:14,fontWeight:'500'}}>Selected Category : {option.categoryName}</Text>
//               {(searchText ? filteredDoctors : doctors)
//                 .filter((doctor) =>
//                   doctor.categories.includes(option.categoryName)
//                 )
//                 .map((doctor) => (  
//                   <TouchableOpacity
//                     key={doctor.id}
//                     style={{
//                       flexDirection: "row",
//                       alignItems: "center",
//                       backgroundColor: "#D9D9D9",
//                       borderRadius: 10,
//                       padding: 10,
//                       marginHorizontal:20,
//                       marginBottom: 20,
//                       elevation: 4,
//                       shadowColor: "#000",
//                       shadowOffset: {
//                         width: 0,
//                         height: 2,
//                       },
//                       shadowOpacity: 0.25,
//                       shadowRadius: 3.84,
//                     }}
//                     onPress={() => {
//                       navigation.navigate("DetailedLabs", { lab,doctor });
//                     }}
//                   >
//                     <View
//                       style={{
//                         width: 60,
//                         height: 60,
//                         borderRadius: 5,
//                         backgroundColor: "#fff",
//                         justifyContent: "center",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Image
//                         source={Doctorpng}
//                         style={{ width: 50, height: 50, borderRadius: 5 }}
//                       />
//                     </View>
//                     <View
//                       style={{
//                         flex: 1,
//                         marginLeft: 10,
//                       }}
//                     >
//                       <View
//                         style={{
//                           marginBottom: 5,
//                         }}
//                       >
//                         <Text
//                           style={{
//                             fontSize: 18,
//                             fontWeight: "bold",
//                             color: "#333",
//                           }}
//                         >
//                           {doctor.name}  <Text style={{fontSize:12}}>({doctor.study})</Text>
//                         </Text>
//                       </View>
//                       <View
//                         style={{
//                           flexDirection: "row",
//                           alignItems: "center",
//                         }}
//                       >
//                         {[...Array(doctor.rating)].map((_, index) => (
//                           <Text
//                             key={index}
//                             style={{
//                               marginRight: 5,
//                               fontSize: 14,
//                               color: "#666",
//                             }}
//                           >
//                             ⭐
//                           </Text>
//                         ))}
                       
//                         <View
//                           style={{ position: "absolute", top: -10, right: 20 }}
//                         >
//                           <FontAwesome
//                             name="heart"
//                             size={24}
//                             color={doctor.favourite ? "red" : "#666"}
//                           />
//                         </View>
//                       </View>
//                     </View>
//                   </TouchableOpacity>
//                 ))}
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };


// export default LabDetailScreen;
