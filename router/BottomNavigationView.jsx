import React from 'react'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import { Ionicons, SimpleLineIcons, AntDesign, FontAwesome } from '@expo/vector-icons'

import Match from '../screens/Match'
import Reels from '../screens/reels/Reels'


import color from '../style/color'
import { useSelector } from 'react-redux'
import { nav } from '../style/navigation'
import Chat from '../screens/chat/Chat'
import LikesNavigation from '../screens/likes/LikesNavigation'
import { useIsFocused } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
import Nearby from '../screens/nearby/Nearby'
import { Image } from 'react-native'

const { Navigator, Screen } = createMaterialBottomTabNavigator()

const BottomNavigationView = () => {
  const { profile, theme } = useSelector(state => state.user)

  const focused = useIsFocused()

  if (focused) {
    NavigationBar.setBackgroundColorAsync(theme ? color.dark : color.white)
    NavigationBar.setButtonStyleAsync(theme ? 'light' : 'dark')
  }

  return (
    <Navigator initialRouteName='Match' barStyle={[nav.barStyle, { backgroundColor: theme ? color.dark : color.white }]}>
      <Screen
        name='Nearby'
        component={Nearby}
        options={{
          tabBarIcon: () => <FontAwesome name="map-marker" size={20} color={theme ? color.white : color.black} />
        }}
      />

      <Screen
        name='Match'
        component={Match}
        options={{
          tabBarIcon: () => <AntDesign name='find' size={20} color={theme ? color.white : color.black} />
          // tabBarIcon: () => <Image source={require('../assets/match.png')} style={nav.image} />
        }}
      />

      <Screen
        name='Reels'
        component={Reels}
        options={{
          tabBarIcon: () => <FontAwesome name='film' size={20} color={theme ? color.white : color.black} />
        }}
      />

      {
        (profile?.pendingSwipes != undefined && profile?.pendingSwipes > 0) ?
          <Screen
            name='Likes'
            component={LikesNavigation}
            options={{
              tabBarIcon: () => <Ionicons name="heart-outline" size={22} color={theme ? color.white : color.black} />,
              tabBarBadge: profile?.pendingSwipes,
              title: 'Likes'
            }}
          /> :
          <Screen
            name='Likes'
            component={LikesNavigation}
            options={{
              tabBarIcon: () => <SimpleLineIcons name='like' size={20} color={theme ? color.white : color.black} />
            }}
          />
      }

      <Screen
        name='Chat'
        component={Chat}
        options={{
          tabBarIcon: () => <Ionicons name='chatbubbles-outline' size={20} color={theme ? color.white : color.black} />
        }}
      />
    </Navigator>
  )
}

export default BottomNavigationView