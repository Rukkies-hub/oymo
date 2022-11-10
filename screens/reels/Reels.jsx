import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ReelsScreen from './ReelsScreen'
import Profile from './Profile'
import { Text, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setActiveRoute } from '../../features/userSlice'

const { Navigator, Screen } = createMaterialTopTabNavigator()

const Reels = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { name } = useRoute()

  navigation.addListener('blur', () => {
    navigation.jumpTo('ReelsScreen')
  })

  useEffect(() => {
    const call = () => dispatch(setActiveRoute(name))
    call()
  }, [])

  return (
    <Navigator
      screenOptions={{
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