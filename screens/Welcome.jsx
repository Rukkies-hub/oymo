import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import * as NavigationBar from 'expo-navigation-bar'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import color from '../style/color'
import { wc } from '../style/auth'
import AutoHeightImage from 'react-native-auto-height-image'
const { width } = Dimensions.get('window')
import OymoFont from '../components/OymoFont'
import Bar from '../components/Bar'

const Welcome = () => {
  const focused = useIsFocused()
  const navigation = useNavigation()
  const { name } = useRoute()

  if (focused) {
    NavigationBar.setBackgroundColorAsync(color.white)
    NavigationBar.setButtonStyleAsync('dark')
  }

  return (
    <View style={wc.container}>
      <Bar color='dark' />
      <AutoHeightImage source={require('../assets/welcome.png')} width={width} style={wc.image} />
      <OymoFont message='Find friends, and dates around you' fontFamily='montserrat_bold' fontStyle={wc.headText} />
      <OymoFont message='Find friends, and dates around you with just a swipe. Are you bored? Enjoy the wide collection of interesting shorts. Like, comment, interact with users, and find love❤️ around you' fontStyle={wc.mainText} />

      <View style={wc.navigationView}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={[
            wc.navigationButton, {
              backgroundColor: name == 'Welcome' ? color.white : color.transparent,
              shadowColor: color.lightText,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }
          ]}
        >
          <OymoFont message='Register' />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={[wc.navigationButton, { backgroundColor: name != 'Welcome' ? color.white : color.transparent }]}>
          <OymoFont message='Sign In' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Welcome