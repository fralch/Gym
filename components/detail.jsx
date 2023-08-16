import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Detail() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
         
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        marginVertical: 8,
        borderRadius: 10,
        marginHorizontal: 10,
    },
});
