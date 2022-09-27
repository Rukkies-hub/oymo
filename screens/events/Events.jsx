import { View, Text } from 'react-native'
import React from 'react'
import { events } from '../../style/events'
import AllEvents from './screens/AllEvents'
import Header from '../../components/Header'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import color from '../../style/color'

const { Navigator, Screen } = createMaterialTopTabNavigator()

const Events = () => {
  return (
    <View style={events.container}>
      <Header
        showBack
        showLogo
        showAratar
        showNotification
      />
      <Navigator
        initialRouteName="AllEvents"
        screenOptions={{
          tabBarStyle: {
            height: 0,
            elevation: 0
          },
        }}
      >
        <Screen name="AllEvents" component={AllEvents} />
      </Navigator>
    </View>
  )
}

export default Events