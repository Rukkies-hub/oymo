import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ReelsScreen from './ReelsScreen'
import Profile from './Profile'

const { Navigator, Screen } = createMaterialTopTabNavigator()

const Reels = () => {
  return (
    <Navigator
      screenOptions={{
        // lazy: true,
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