// Page on which the notification settings will live.

import { StyleSheet, Button, Alert, Modal , TextInput, TouchableOpacity } from 'react-native';
import {View,Text} from 'react-native';
import React, { useState } from "react";

import styles from '../styles/default.js';

const Notification = () => {
    return (
        <View style={styles.container}>
            <Text>Notification Settings</Text>
        </View>
    )
};

export default Notification