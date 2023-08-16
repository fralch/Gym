import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, CameraType } from 'expo-camera';

export default function Qr() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>QR Gym</Text>
            {/* <Image style={styles.qr} source={require('../assets/qr.png')} /> */}
            <Text style={{ color:"#aaa"}}>Escanear codigo QR </Text>
            <View style={{flexDirection:"row"}}>
                <Camera style={{width:200, height:200, margin:10}} type={CameraType.back} />
                

            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#34495E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        color: 'white',
    },
    
    
});