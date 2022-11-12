import React from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import color from '../../style/color'
import { profile } from '../../style/profile'

import { useSelector } from 'react-redux'
import ProfileDetails from './ProfileDetailes'
import Reels from './Reels'
import Events from './Events'
import Header from '../../components/Header'
import OymoFont from '../../components/OymoFont'
import { useState } from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

const { Navigator, Screen } = createMaterialTopTabNavigator()

const Profile = () => {
  const { user, profile: _profile, theme } = useSelector(state => state.user)

  const [view, setView] = useState('reels')

  return (
    <View style={[profile.container, { backgroundColor: theme ? color.dark : color.white }]}>
      <Header
        showBack
        showTitle
        showNotification
        title={_profile?.username}
        showAratar={_profile?.photoURL ? true : false}
      />
      <Navigator
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
        <Screen name="ProfileDetails" component={ProfileDetails} initialParams={{ profile: _profile, user: user }} options={{ tabBarLabel: 'Profile' }} />
        <Screen name="Reels" component={Reels} initialParams={{ profile: _profile, user: user }} />
        <Screen name="Events" component={Events} initialParams={{ profile: _profile, user: user }} />
      </Navigator>
    </View>
  )
}

export default Profile