import React from 'react'
import { View, Image } from 'react-native'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import { Ionicons, SimpleLineIcons, AntDesign, FontAwesome } from '@expo/vector-icons'

import Match from '../screens/Match'
import Reels from '../screens/reels/Reels'
import Profile from '../screens/profile/Profile'

import Bar from '../components/Bar'

import color from '../style/color'
import Header from '../components/Header'
import { useSelector } from 'react-redux'
import { nav } from '../style/navigation'
import Chat from '../screens/chat/Chat'
import AddReels from '../screens/addReels/AddReels'

const { Navigator, Screen } = createMaterialBottomTabNavigator()

const BottomNavigation = () => {
  const { profile } = useSelector(state => state.user)

  return (
    <View style={nav.container}>
      <Bar color='dark' />

      <Header showLogo showAdd showAratar showNotification />

      <Navigator barStyle={nav.barStyle}>
        <Screen
          name='Match'
          component={Match}
          options={{
            tabBarIcon: () => <AntDesign name='find' size={20} color={color.black} />
          }}
        />

        <Screen
          name='Reels'
          component={Reels}
          options={{
            tabBarIcon: () => <Ionicons name='videocam-outline' size={20} color={color.black} />
          }}
        />

        <Screen
          name='AddReelsNav'
          component={AddReels}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault()
              navigation.navigate('AddReels')
            }
          })}
          options={{
            tabBarIcon: () => <FontAwesome name='plus-square-o' color={color.black} size={22} />
          }}
        />

        <Screen
          name='Chat'
          component={Chat}
          options={{
            tabBarIcon: () => <Ionicons name='chatbubbles-outline' size={20} color={color.black} />
          }}
        />
      </Navigator>
    </View>
  )
}

export default BottomNavigation