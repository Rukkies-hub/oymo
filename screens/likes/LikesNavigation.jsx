import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import Likes from './Likes'
import Passes from './Passes'
import { useDispatch, useSelector } from 'react-redux'
import { likes } from '../../style/likes'

import OymoFont from '../../components/OymoFont'
import color from '../../style/color'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect } from 'react'
import { setActiveRoute } from '../../features/userSlice'
const { Navigator, Screen } = createMaterialTopTabNavigator()

const LikesNavigation = () => {
  const { profile, theme } = useSelector(state => state.user)

  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { name } = useRoute()

  navigation.addListener('blur', () => {
    navigation.jumpTo('LikesTab')
  })

  useEffect(() => {
    const call = () => dispatch(setActiveRoute(name))
    call()
  }, [])

  return (
    <>
      {
        (profile?.photoURL != undefined && profile?.username != undefined) ?
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
            <Screen name="LikesTab" component={Likes} options={{ tabBarLabel: 'Likes' }} />
            <Screen name="PassesTab" component={Passes} options={{ tabBarLabel: 'Passes' }} />
          </Navigator> :
          <View style={likes.setupView}>
            <View style={likes.setupViewSub}>
              <OymoFont message='Creat a profile' fontFamily='montserrat_bold' fontStyle={likes.cp} />
              <OymoFont message='You do not have a profile.' fontStyle={{ color: color.dark }} />
              <OymoFont message='Please create a profile to perform any action' fontStyle={{ color: color.dark }} />
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile')}
                style={likes.ep}
              >
                <OymoFont message='Create a profile' fontStyle={{ color: color.white }} />
              </TouchableOpacity>
            </View>
          </View>
      }
    </>
  )
}

export default LikesNavigation