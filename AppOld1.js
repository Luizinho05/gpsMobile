import React, { useEffect, useState, useRef } from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'

import MapView, { Marker } from 'react-native-maps'
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  watchPositionAsync,
  LocationAccuracy
} from 'expo-location'

export default function App() {

  const [localizacao, setLocalizacao] = useState(null)

  const mapaRef = useRef(MapView)

  async function requisitarLocal() {
    const { granted } = await requestForegroundPermissionsAsync()
    if (granted) {
      const posicaoAtual = await getCurrentPositionAsync()
      setLocalizacao(posicaoAtual)
    }
  }

  useEffect(() => {
    requisitarLocal()
  }, [])

  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (resposta) => {
      setLocalizacao(resposta)
      mapaRef.current.animateCamera({
        //pitch: 50,
        center: resposta.coords
      })
    })
  }, [])

  return (
    <View style={styles.container}>
      {
        localizacao &&
        <MapView
          ref={mapaRef}
          style={styles.map}
          loadingEnabled={true}
          initialRegion={{
            latitude: localizacao.coords.latitude,
            longitude: localizacao.coords.longitude,
            latitudeDelta: 0.006,
            longitudeDelta: 0.006
          }}
        >
          <Marker
            coordinate={{
              latitude: localizacao.coords.latitude,
              longitude: localizacao.coords.longitude,
            }}
            title='Sua Localização'
          />
        </MapView>
      }

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
})