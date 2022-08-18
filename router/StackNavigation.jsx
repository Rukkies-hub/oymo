import { View, Text } from 'react-native'
import React from 'react'

import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'

const Stack = createStackNavigator()

import Login from '../screens/Login'
import Signup from '../screens/Signup'

const StackNavigation = () => {
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
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default StackNavigation