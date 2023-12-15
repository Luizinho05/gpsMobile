import React, { useState, useEffect, useRef } from 'react'
import { useKeepAwake } from 'expo-keep-awake'
import {
    StatusBar,
    StyleSheet,
    View,
    Image
} from 'react-native'
import {
    requestForegroundPermissionsAsync,
    getCurrentPositionAsync,
    watchPositionAsync,
    LocationAccuracy
} from 'expo-location'
import MapView, { Marker } from 'react-native-maps'

export default function App() {
    useKeepAwake()

    const [localizacao, setLocalizacao] = useState(null)
    const mapaRef = useRef(MapView)

    useEffect(() => {
        async function reqLocalizacao() {
            const { granted } = await requestForegroundPermissionsAsync()
            if (granted) {
                const posicaoAtual = await getCurrentPositionAsync()
                setLocalizacao(posicaoAtual)
            }
        }
        reqLocalizacao()
    }, [])

    useEffect(() => {
        watchPositionAsync({
            accuracy: LocationAccuracy.Highest,
            timeInterval: 1000,
            distanceInterval: 1
        }, (resposta) => {
            setLocalizacao(resposta)
            mapaRef.current.animateCamera({
                pitch: 70,
                center: resposta.coords
            })
        })
    }, [])


    return (

        <View style={styles.container}>
            <StatusBar backgroundColor='black' barStyle='light-content' translucent={false} />
            { 
                localizacao &&
                <MapView
                    ref={mapaRef}
                    style={styles.map}
                    loadingEnabled={true}
                    initialRegion={{
                        latitude: localizacao.coords.latitude,
                        longitude: localizacao.coords.longitude,
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003
                    }}
                >
                    <Marker
                    coordinate={{
                        latitude: localizacao.coords.latitude,
                        longitude: localizacao.coords.longitude
                    }}
                    >
                        <Image
                        style={styles.iconMarker}
                        source={require('./assets/capacete.png')}
                        />
                    </Marker>
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
        height: '100%',
        width: '100%'
    },
    iconMarker: {
        height: 30,
        width: 25,
        resizeMode: 'contain'
      },
      textAG: {
        fontSize: 35,
        fontWeight: 'bold',
        color: 'red',
      }
})