import { View, Text } from 'react-native'
import React from 'react'
import MapView, { Callout, Circle, Marker } from 'react-native-maps'
import { map } from '../style/map'
import color from '../style/color'
import { useState } from 'react'
import { useEffect } from 'react'
import * as Location from 'expo-location'

const Map = () => {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return;
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  }, [])

  return (
    <View style={map.container}>
      {
        location &&
        <MapView
          style={map.map}
          initialRegion={{
            latitude: location?.coords?.latitude,
            longitude: location?.coords?.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
            provider='google'
        >
          <Marker
            coordinate={{
              latitude: location?.coords?.latitude,
              longitude: location?.coords?.longitude,
            }}
            pinColor={color.red}
            draggable={true}
            onDragStart={e => {
              console.log('Drag start', e.nativeEvent.coordinate)
            }}
            onDragEnd={e => {
              console.log('Drag end', e.nativeEvent.coordinate)
              setLocation({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              })
            }}
          >
            <Callout>
              <Text>I'm here</Text>
            </Callout>
          </Marker>
          <Circle
            center={{
              latitude: location?.coords?.latitude,
              longitude: location?.coords?.longitude,
            }}
            radius={1000}
          />
        </MapView>
      }
    </View>
  )
}

export default Map