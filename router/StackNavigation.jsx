import { View, Text } from 'react-native'
import React from 'react'

import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'

const Stack = createStackNavigator()

import Login from '../screens/Login'
import Signup from '../screens/Signup'
import BottomNavigation from './BottomNavigation'
import { useSelector } from 'react-redux'

const StackNavigation = () => {
  const user = useSelector(state => state.user.user)

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        keyboardHandlingEnabled: true,
        animationEnabled: true,
        ...TransitionPresets.SlideFromRightIOS
      }}
    >
      {
        user ? (
          <>
            <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
          </>
        ) :
          (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
            </>
          )
      }
    </Stack.Navigator>
  )
}

export default StackNavigation