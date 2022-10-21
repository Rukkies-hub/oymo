import React from 'react'
import { View } from 'react-native'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import { Ionicons, SimpleLineIcons, AntDesign, FontAwesome, Feather } from '@expo/vector-icons'

import Match from '../screens/Match'
import Reels from '../screens/reels/Reels'

import Bar from '../components/Bar'

import color from '../style/color'
import Header from '../components/Header'
import { useSelector } from 'react-redux'
import { nav } from '../style/navigation'
import Chat from '../screens/chat/Chat'
import AddReels from '../screens/addReels/AddReels'
import LikesNavigation from '../screens/likes/LikesNavigation'
import { useIsFocused } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'

const { Navigator, Screen } = createMaterialBottomTabNavigator()

const BottomNavigation = () => {
  const { profile, theme } = useSelector(state => state.user)

  const focused = useIsFocused()

  if (focused) {
    NavigationBar.setBackgroundColorAsync(theme ? color.dark : color.white)
    NavigationBar.setButtonStyleAsync(theme ? 'light' : 'dark')
  }

  return (
    <View style={[nav.container, { backgroundColor: theme ? color.dark : color.white }]}>
      <Bar color={theme ? 'light' : 'dark'} />

      <Header showLogo showAdd showAratar showNotification />

      <Navigator barStyle={[nav.barStyle, { backgroundColor: theme ? color.dark : color.white }]}>
        <Screen
          name='Match'
          component={Match}
          options={{
            tabBarIcon: () => <AntDesign name='find' size={20} color={theme ? color.white : color.black} />
          }}
        />

        <Screen
          name='Reels'
          component={Reels}
          options={{
            tabBarIcon: () => <FontAwesome name='film' size={20} color={theme ? color.white : color.black} />
          }}
        />

        <Screen
          name='AddReelsNav'
          component={AddReels}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault()
              if (profile?.photoURL != undefined && profile?.username != undefined)
                navigation.navigate('AddReels')
              else
                navigation.navigate('SetupModal')
            }
          })}
          options={{
            tabBarIcon: () => <FontAwesome name='plus-square-o' color={theme ? color.white : color.black} size={22} />,
            title: 'Post'
          }}
        />

        {
          (profile?.pendingSwipes != undefined && profile?.pendingSwipes > 0) ?
            <Screen
              name='Likes'
              component={LikesNavigation}
              options={{
                tabBarIcon: () => <SimpleLineIcons name='like' size={20} color={theme ? color.white : color.black} />,
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
    </View>
  )
}

export default BottomNavigation