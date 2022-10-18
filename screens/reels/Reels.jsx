import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ReelsScreen from './ReelsScreen'
import Profile from './Profile'
import { Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const { Navigator, Screen } = createMaterialTopTabNavigator()

const Reels = () => {
  const navigation = useNavigation()

  navigation.addListener('blur', () => {
    navigation.jumpTo('ReelsScreen')
  })

  return (
    <Navigator
      screenOptions={{
        tabBarStyle: {
          height: 0,
          elevation: 0
        }
      }}
    >
      <Screen name="ReelsScreen" component={ReelsScreen} />
      <Screen name="ProfileScreen" component={Profile} />
    </Navigator>
  )
}

export default Reels