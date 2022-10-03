import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, Modal , TextInput, TouchableOpacity } from 'react-native';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import firebaseConfig from "./firebase.config";
import { writeUserData, writeLocationData, writePositionData, listOfLocationsVisited, writeMovementData, reasonForMovement } from "./database";
import * as React from 'react';
import { useEffect, useState, useRef } from "react";

///////////////////////////////////////////////////////Global Variables///////////////////////////////////////////////////////
const fire = initializeApp(firebaseConfig); //Initialises the database
const UserId = 'user07';
const db = getDatabase();
const position_time_interval = 2000; //Interval of time between recording user position. 1000 = 1 second.
const movement_time_interval = 5000; //Interval of time between checking if user moved. 1000 = 1 second.
const stopped_time_interval = 10000; //Interval of time between checking if user stopped. 1000 = 1 second.
const movement_threshold = 10; //Threshold. When the user moves further than this threshold, we consider it 'movement'
const stopped_threshold = 10; //Threshold. When the user has not moved further than this threshold, we consider it 'stopped'.
///////////////////////////////////////////////////////Global Variables///////////////////////////////////////////////////////

//This function returns the last X visited locations, where X is the number_of_locations.
function getLastLocationsVisited(visited_locations, number_of_locations) {
  if (number_of_locations > visited_locations.length) {
    return (visited_locations);
  } else {
    const index = -1 * number_of_locations;
    const last_locations = visited_locations.slice(index);
    return (last_locations);
  }
};

//This adds an event listener to the locations visited by the user. This runs once when the app starts, and then any time a new location is visited.
const locationRef = ref(db, 'users/' + UserId + '/locations_visited/');
onValue(locationRef, (snapshot) => {
  var visited_locations = listOfLocationsVisited(snapshot); //Returns an array of the names of the locations visited
  var last_10_locations = getLastLocationsVisited(visited_locations, 10);

  console.log(visited_locations); //Used for debugging, remove when locations are displayed to the user in the app
  console.log(last_10_locations); //Same as above.
  console.log(snapshot);
  window.last_10_locations = last_10_locations;
  window.last_location = getLastLocationsVisited(visited_locations, 1);
});

// Nav Bar Imports

import { Component } from 'react'
import HomeScreen from './screens/Home';
import TravelLogScreen from './screens/TravelLog';
import StatisticsScreen from './screens/Statistics';
import SettingsScreen from './screens/Settings';
import ProfileScreen from './screens/Profile';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';



const Tab = createMaterialBottomTabNavigator();

const App = () => {
  let movement_change = 10; //A placeholder until we have access to GPS and can calculate the change in movement.
  let current_coordinates = 5; //A placeholder until we have access to GPS.

  //This stores whether the user has moved or not, as well as their reason for moving
  const [hasMoved, sethasMoved] = useState(false);
  const [movement, setMovement] = useState('');

  //This stores whether the user has stopped or not, as well as their reason for moving
  const [hasStopped, sethasStopped] = useState(false);
  const [location, setLocation] = useState('');

  const [movement_method, setMovement_method] = useState("")

  //Checks if user movement exceeds the threshold. Needs to be updated with GPS.
  function checkMovement() {
    if (movement_change >= movement_threshold) {
      sethasMoved(true);
      window.current_coordinates = 5000;
    }
  }

  //Checks if user has moved below the threshold. Needs to be updated with GPS.
  function checkStopped() {
    if (movement_change <= stopped_threshold) {
      sethasStopped(true);
      window.current_coordinates = 5000;
    }
  }

  //This is used for tracking movement, and prompts the user to say why they have moved every 5 seconds.
  useEffect( () => {
    const timer_movement = setTimeout( () => checkMovement(), movement_time_interval);
    setMovement('');

    return () => {
      clearTimeout(timer_movement);
  }}, [hasMoved]);

  //This is used for tracking locations, and prompts the user to say why they have stopped every 10 seconds.
  useEffect( () => {
    const timer_stopped = setTimeout( () => checkStopped(), stopped_time_interval);
    setLocation('');

    return () => {
      clearTimeout(timer_stopped);
    }
  }, [hasStopped]);

  //This is used to continually log the users location
  useEffect( () => {
    const timer = setInterval( () => {writePositionData(UserId, current_coordinates)}, position_time_interval);

    return () => {
      clearInterval(timer);
    }
  }, []);

  //This set of code below successfully updates with the last location visited
  const [last_loc, setLast_loc] = useState("");

  useEffect( () => {
    return onValue(locationRef, querySnapShot => {
      let data = querySnapShot || {};
      let items = listOfLocationsVisited(data);
      let last_item = getLastLocationsVisited(items, 1);

      setLast_loc(last_item[0]);
      setMovement_method('');
    })
  }, []);

  return (
    <NavigationContainer>
      <View>

      <Modal animationType='slide' visible={hasMoved}>
        <View>
          <View>
            <Text>Please fill out your reason for moving:</Text>
            <TextInput
              value={movement}
              placeholder="Reason for Movement"
              onChangeText={(movement) => setMovement(movement)}
            ></TextInput>
            <Button title="Send Data!" 
            onPress={() => {
              sethasMoved(false);
              reasonForMovement(UserId, movement, current_coordinates);
              }}></Button>
            <Button title="I didn't move!" onPress={() => sethasMoved(false)}></Button>
          </View>
        </View>
      </Modal>

      <Modal animationType='slide' visible={hasStopped}>
        <View>
          <View>
            <Text>Please fill out where you have stopped:</Text>
            <TextInput
              value={location}
              placeholder="Where you have stopped"
              onChangeText={(location) => setLocation(location)}
            ></TextInput>
            <TextInput
              value={movement_method}
              placeholder="How you moved here - e.g. bus, car"
              onChangeText={(movement_method) => setMovement_method(movement_method)}
              ></TextInput>
            <Button title="Send Data!" 
            onPress={() => {
              sethasStopped(false);
              writeLocationData(UserId, location, current_coordinates);
              writeMovementData(UserId, last_loc, location, 10, 20, movement_method)
              }}></Button>
            <Button title="I didn't stop!" onPress={() => sethasStopped(false)}></Button>
          </View>
        </View>
      </Modal>

      </View>
      <Tab.Navigator labeled={false} barStyle={{ backgroundColor: 'black' }} 
      activeColor="white" >
        <Tab.Screen name="Home" component={HomeScreen}            //Home Screen
        options={{
          tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={26}/>
          ),
      }}/>
        <Tab.Screen name="Settings" component={SettingsScreen}      //Settings Screen
        options={{
          tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog-outline" color={color} size={26}/>
          ),
      }}/>
        <Tab.Screen name="TravelLog" component={TravelLogScreen}    // TravellogScreen
        options={{
          tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="map" color={color} size={26}/>
          ),
      }}/>
        <Tab.Screen name="Statistics" component={StatisticsScreen}   // Statistics Screen
        options={{
          tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-line-variant" color={color} 
  size={26}/>
          ),
      }}/>
        <Tab.Screen name="Profile" component={ProfileScreen}   // Profile Screen
        options={{
          tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-circle" color={color} 
  size={26}/>
          ),
      }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App

/* 
  Code below is for testing the database with firebase. un comment section below to test and also test other code
*/



// const App = () => {

//   //This is used to store whether the user has agreed to have their data stored or not.
//   const [isOKAY, setisOKAY] = useState(false);

//   //Runs SQL commands to create the tables for the database if they do not already exist.
//   //Displays a warning that the app will collect personal data.
//   const Warning = () =>
//     Alert.alert(
//       "Data Collection Alert",
//       "This app may collect personal data such as location and heart rate.",
//       [
//         { text: "Cancel", onPress: () => setisOKAY(false)},
//         { text: "OK", onPress: () => setisOKAY(true)}
//       ]
//     );

//   //This creates the view that the user sees when they open the app
//   return (
//     <View style={styles.container}>
//       <Modal animationType='slide' visible={isOKAY}>
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text>Please fill out the details below:</Text>
//             <TextInput
//               style={styles.input}
//               defaultValue = "First Name"
//             ></TextInput>
//             <TextInput
//               style={styles.input}
//               defaultValue = "Last Name"
//             ></TextInput>
//             <Button title = "Go back" onPress = {() => setisOKAY(false)}></Button>
//           </View>
//         </View>
//       </Modal>
//       <Text>Welcome to the Human Movement Mapping Project App!</Text>
//       <Text></Text>
//       <Button title = "Send Data!" onPress={ () => {writeUserData("user01", "Cam", "fake@fake.com", "google.com")}}></Button>
//       <Button title = "Send Location Data!" onPress={ () => {writeLocationData("user04", "Gym", 10)}}></Button>
//       <Button title = "Send Position Data!" onPress={ () => {writePositionData("user04", 1000)}}></Button>
//       <StatusBar style="auto" />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   input: {
//     height:40,
//     borderColor: 'black',
//     borderWidth: 2
//   },
//   button: {
//     alignItems: 'center',
//     backgroundColor: '#A9A9A9',
//     padding: 10,
//     borderRadius: 10,
//     width: 200,
//     margin: 10,
//     height: 100,
//     flex: 1
//   }
// });

// //export default App

// hex code for grey
// #808080
// Bit lighter
// #A9A9A9