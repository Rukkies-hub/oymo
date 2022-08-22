import React from 'react'
import { View, Text, Image, SafeAreaView } from 'react-native'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import { Ionicons, Feather, MaterialCommunityIcons, SimpleLineIcons, Octicons } from '@expo/vector-icons'

import Profile from '../screens/profile/Profile'
import Match from '../screens/Match'

import Bar from '../components/Bar'

import color from '../style/color'
import Header from '../components/Header'

const { Navigator, Screen } = createMaterialBottomTabNavigator()

const BottomNavigation = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <Bar color='dark' />

      <Header showLogo showAdd showNotification />

      <Navigator
        barStyle={{
          backgroundColor: color.white,
          height: 54,
          elevation: 0
        }}
      >
        <Screen
          name='Match'
          component={Match}
          options={{
            tabBarIcon: () => <MaterialCommunityIcons name='heart-multiple-outline' size={20} color={color.black} />
          }}
        />

        <Screen
          name='ProfileTab'
          component={Profile}
          options={{
            tabBarIcon: () => <SimpleLineIcons name='user' size={20} color={color.black} />
          }}
        />
      </Navigator>
    </View>
  )
}

export default BottomNavigation