import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={StyleSheet.absoluteFillObject}>
      <View style={{marginTop:50, alignSelf: 'center'}}>
                    <Image source={{ uri: 'https://media1.thehungryjpeg.com/thumbs2/ori_4208435_29eq7q29mxgwrrmkklgfz9uilwqvjgnozkapouif_gym-lion-esport-mascot-logo-design.png' }} style={{ width: 150, height: 90 }} />
                </View>
      </BarCodeScanner>
      {scanned && 
       <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
             <Text style={{color:"white"}}>SCANEAR DE NUEVO</Text>
        </TouchableOpacity>
     
      }
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignSelf: 'stretch', 
    backgroundColor: "#34495E"
  },
  button: {
    backgroundColor: '#3A4F64',
    padding: 10,
    marginBottom: 30,
    borderRadius: 10,
    width: 180,
    height: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,


  },
});
