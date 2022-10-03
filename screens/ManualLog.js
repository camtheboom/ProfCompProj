//Manual Log Page - This is the page that is displayed when the user clicks the Manual Log button on the home screen. 
//This page is not yet implemented, but will be used to manually log a task.

import { StyleSheet, Button, Alert, Modal , TextInput, TouchableOpacity } from 'react-native';
import {View,Text} from 'react-native';
import React, { FC, useState } from "react";


import styles from '../styles/default.js'
import SelectDropdown from 'react-native-select-dropdown'

// screen for date, log, mode of transport

const countries = ["Egypt", "Canada", "Australia", "Ireland"]

const ManualLog = () => {
    return (
        // <View style={styles.container}>
        // <Text>Manual Log</Text>
        // </View>
        <SelectDropdown
            data={countries}
            onSelect={(selectedItem, index) => {
                console.log(selectedItem, index)
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem
            }}
            rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
                
	        }}
         
/>
    );
    }

export default ManualLog