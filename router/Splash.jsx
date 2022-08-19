import { View, Text, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import color from '../style/color'
import OymoFont from '../components/OymoFont'

const Splash = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Image
          source={require('../assets/icon.png')}
          style={{
            width: 100,
            height: 100,
            marginBottom: 30
          }}
        />
        <ActivityIndicator color={color.red} size='large' />
      </View>
      <View
        style={{
          alignItems: 'center'
        }}
      >
        <OymoFont message='Find a date on your own tems' />
      </View>
    </View>
  )
}

export default Splash