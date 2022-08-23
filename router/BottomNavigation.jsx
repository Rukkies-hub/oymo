import React from 'react'
import { View, Text, Image, SafeAreaView } from 'react-native'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import { Ionicons, Feather, MaterialCommunityIcons, SimpleLineIcons, Octicons } from '@expo/vector-icons'

import Profile from '../screens/profile/Profile'
import Match from '../screens/Match'

import Bar from '../components/Bar'

import color from '../style/color'
import Header from '../components/Header'
import { useSelector } from 'react-redux'
import { nav } from '../style/navigation'

const { Navigator, Screen } = createMaterialBottomTabNavigator()

const BottomNavigation = () => {
  const { profile } = useSelector(state => state.user)

  return (
    <View style={nav.container}>
      <Bar color='dark' />

      <Header showLogo showAdd showNotification />

      <Navigator barStyle={nav.barStyle}>
        <Screen
          name='Match'
          component={Match}
          options={{
            tabBarIcon: () => <MaterialCommunityIcons name='heart-multiple-outline' size={20} color={color.black} />
          }}
        />

        {
          profile &&
          <Screen
            name='ProfileTab'
            component={Profile}
            listeners={({ navigation }) => ({
              tabPress: e => {
                e.preventDefault()
                navigation.navigate('Profile')
              }
            })}
            options={{
              tabBarIcon: () => (
                <>
                  {
                    profile?.photoURL &&
                    <View style={{ position: 'relative' }}>
                      {
                        profile?.paid &&
                        <View style={nav.paidImageContainer}>
                          <Image source={require('../assets/vip.png')} style={nav.paidImage} />
                        </View>
                      }
                      <Image source={{ uri: profile?.photoURL }} style={nav.avatar} />
                    </View>
                  }
                  {
                    !profile?.photoURL &&
                    <SimpleLineIcons name='user' size={20} color={color.dark} />
                  }
                </>
              ),
              tabBarLabel: false
            }}
          />
        }
      </Navigator>
    </View>
  )
}

export default BottomNavigation