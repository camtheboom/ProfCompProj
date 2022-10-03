//The stylesheet used over the various pages in the app

import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
      input: {
        height:40,
        borderColor: 'black',
        borderWidth: 2
    },
      button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#A9A9A9',
        padding: 10,
        borderRadius: 10,
        width: 250,
        marginTop: 10,
        height: 100,
        flex: 1
    },
      modalButton: {
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        width:300
    },
    div: {
        flex:3
    },
    startbutton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 20,
        width: 250,
        flex: 1
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
    },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
        marginTop: 10
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default styles;