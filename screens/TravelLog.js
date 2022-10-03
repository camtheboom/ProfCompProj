import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

function TravelLog() {
  return (
    <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
      <Text>Travel Log</Text>
    </View>
  )
}

const styles = StyleSheet.create({
      log: {
        top: 0, 
        position: 'absolute', 
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
      },
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }
    })
export default TravelLog