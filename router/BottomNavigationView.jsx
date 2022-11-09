import React from 'react'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import { Ionicons, SimpleLineIcons, AntDesign, FontAwesome } from '@expo/vector-icons'

import Match from '../screens/Match'
import Reels from '../screens/reels/Reels'


import color from '../style/color'
import { useDispatch, useSelector } from 'react-redux'
import { nav } from '../style/navigation'
import Chat from '../screens/chat/Chat'
import LikesNavigation from '../screens/likes/LikesNavigation'
import { useIsFocused } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
import Nearby from '../screens/Nearby'
import { Image } from 'react-native'
import { setActiveRoute } from '../features/userSlice'

const { Navigator, Screen } = createMaterialBottomTabNavigator()

const BottomNavigationView = () => {
  const { profile, theme } = useSelector(state => state.user)

  const focused = useIsFocused()
  const dispatch = useDispatch()

  if (focused) {
    NavigationBar.setBackgroundColorAsync(theme ? color.dark : color.white)
    NavigationBar.setButtonStyleAsync(theme ? 'light' : 'dark')
  }

  return (
    <Navigator initialRouteName='Match' barStyle={[nav.barStyle, { backgroundColor: theme ? color.dark : color.white }]}>
      <Screen
        name='Nearby'
        component={Nearby}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault()
            navigation.jumpTo('Nearby')
            dispatch(setActiveRoute('Nearby'))
          }
        })}
        options={{
          tabBarIcon: () => <FontAwesome name="map-marker" size={20} color={theme ? color.white : color.black} />
        }}
      />

      <Screen
        name='Match'
        component={Match}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault()
            navigation.jumpTo('Match')
            dispatch(setActiveRoute('Match'))
          }
        })}
        options={{
          tabBarIcon: () => <AntDesign name='find' size={20} color={theme ? color.white : color.black} />
        }}
      />

      <Screen
        name='Reels'
        component={Reels}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault()
            navigation.jumpTo('Reels')
            dispatch(setActiveRoute('Reels'))
          }
        })}
        options={{
          tabBarIcon: () => <FontAwesome name='film' size={20} color={theme ? color.white : color.black} />
        }}
      />

      {
        (profile?.pendingSwipes != undefined && profile?.pendingSwipes > 0) ?
          <Screen
            name='Likes'
            component={LikesNavigation}
            listeners={({ navigation }) => ({
              tabPress: e => {
                e.preventDefault()
                navigation.jumpTo('Likes')
                dispatch(setActiveRoute('Likes'))
              }
            })}
            options={{
              tabBarIcon: () => <Ionicons name="heart-outline" size={22} color={theme ? color.white : color.black} />,
              tabBarBadge: profile?.pendingSwipes >= 10 ? '9+' : profile?.pendingSwipes,
              title: 'Likes'
            }}
          /> :
          <Screen
            name='Likes'
            component={LikesNavigation}
            listeners={({ navigation }) => ({
              tabPress: e => {
                e.preventDefault()
                navigation.jumpTo('Likes')
                dispatch(setActiveRoute('Likes'))
              }
            })}
            options={{
              tabBarIcon: () => <SimpleLineIcons name='like' size={20} color={theme ? color.white : color.black} />
            }}
          />
      }

      <Screen
        name='Chat'
        component={Chat}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault()
            navigation.jumpTo('Chat')
            dispatch(setActiveRoute('Chat'))
          }
        })}
        options={{
          tabBarIcon: () => <Ionicons name='chatbubbles-outline' size={20} color={theme ? color.white : color.black} />
        }}
      />
    </Navigator>
  )
}

export default BottomNavigationView