import React from 'react'
import { useSelector } from 'react-redux'

import ProfileDetails from './components/ProfileDetails'
import UserReels from './UserReels'
import color from '../../style/color'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
const { Navigator, Screen } = createMaterialTopTabNavigator()

const Profile = () => {
  const { activeReelUser } = useSelector(state => state.reels)
  const { theme } = useSelector(state => state.user)

  return (
    <Navigator
      tabBarPosition='bottom'
      screenOptions={{
        tabBarStyle: {
          height: 45,
          elevation: 0,
          backgroundColor: theme ? color.dark : color.white
        },

        tabBarIndicatorStyle: {
          backgroundColor: color.red
        },

        tabBarLabelStyle: {
          color: theme ? color.white : color.dark,
          textTransform: 'capitalize',
          fontWeight: 'bold'
        }
      }}
    >
      <Screen name="ProfileDetails" component={ProfileDetails} initialParams={{ activeReelUser }} options={{ tabBarLabel: 'Profile' }} />
      <Screen name="Reels" component={UserReels} initialParams={{ activeReelUser }} />
    </Navigator>
  )
}

export default Profile