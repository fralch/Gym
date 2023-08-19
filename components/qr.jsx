import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image, TouchableOpacity, Modal, Dimensions, Linking } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { Foundation , FontAwesome5 } from '@expo/vector-icons'; 

const screenHeight = Dimensions.get('window').height;

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

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
    console.log(typeof JSON.parse(data));
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={StyleSheet.absoluteFillObject}>
        <View style={{ marginTop: 50, alignSelf: 'center' }}>
          <Image source={{ uri: 'https://media1.thehungryjpeg.com/thumbs2/ori_4208435_29eq7q29mxgwrrmkklgfz9uilwqvjgnozkapouif_gym-lion-esport-mascot-logo-design.png' }} style={{ width: 150, height: 90 }} />
        </View>
      </BarCodeScanner>
      {!scanned &&
        <TouchableOpacity style={styles.button} onPress={() => toggleModal()}>
          <Text style={{ color: "white" }}>SCANEAR DE NUEVO</Text>
        </TouchableOpacity>

      }

      <Modal visible={isModalVisible} animationType="slide">
        <View style={[styles.modalContainer, { height: screenHeight * 0.7 }]}>
          {/* Crear la interfas para mostrar los datos del usuario, Foto, nombre, Fecha */}

          <Image source={{ uri: 'https://scontent.fjau2-1.fna.fbcdn.net/v/t39.30808-6/340986589_259945029721074_1388666719680320276_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeFY_6CqFfCRPaAY9FvFtybS_rUKpN1CnhT-tQqk3UKeFEkXayg6mLQLgzUeZoCRZgjEVb4utEXPUOg1GbvZB9bi&_nc_ohc=BVrDOCXNdUQAX9KfvF_&_nc_ht=scontent.fjau2-1.fna&oh=00_AfDcJS_9GjdBnEHKDQGpiV2-JLDzd1x4A8CUmDaTbdXsLA&oe=64E465C0' }} style={styles.fotoperfil} />

          <Text style={{ color: "#aaa", fontSize: 18, marginVertical: 5 }}>Nombre:<Text style={{ color: "white", fontSize: 18 }}> Alexander Frank Cairampoma</Text> </Text>
          <Text style={{ color: "#aaa", fontSize: 18, marginVertical: 5 }}>DNI: <Text style={{ color: "white", fontSize: 18 }}> 12345678</Text></Text>
          <Text style={{ color: "#aaa", fontSize: 18, marginVertical: 5 }}>Fecha Inicio: <Text style={{ color: "white", fontSize: 18 }}> 19-09-2022</Text></Text>
          <Text style={{ color: "#aaa", fontSize: 18, marginVertical: 5 }}>Fecha Fin: <Text style={{ color: "white", fontSize: 18 }}>19-09-2023</Text></Text>
          <Text style={{ color: "#aaa", fontSize: 18, marginVertical: 5 }}>Dias restantes: <Text style={{ color: "white", fontSize: 18 }}>298</Text></Text>
          <TouchableOpacity style={styles.button} onPress={() => toggleModal()}>
            <Text style={{ color: "white" }}>CERRAR</Text>
          </TouchableOpacity>


        </View>
        <View style={styles.footer}>
          <Text style={styles.socialButtonText}>by Frank Cairampoma</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL('https://www.facebook.com/frank.cairampoma.castro')}
            >
              <Foundation name="social-facebook" size={30} color="#bbb" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL('https://www.instagram.com/fralch/')}
            >
             <FontAwesome5 name="instagram" size={26} color="#bbb" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL('https://www.linkedin.com/in/frank-cairampoma-78454895/')}
            >
             <Foundation name="social-linkedin" size={30} color="#bbb" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#34495E"
  },
  fotoperfil: {
    width: 150,
    height: 150,
    marginVertical: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "white"
  },
  footer: {
    height: screenHeight * 0.1,
    backgroundColor: '#34495E',

    justifyContent: 'space-around',
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  socialButtonText: {
    color: '#bbb',
    fontSize: 16,
  },
});
