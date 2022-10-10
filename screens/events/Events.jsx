import { View, Text } from 'react-native'
import React from 'react'
import { events } from '../../style/events'
import AllEvents from './screens/AllEvents'
import Header from '../../components/Header'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import color from '../../style/color'
import { useSelector } from 'react-redux'

const { Navigator, Screen } = createMaterialTopTabNavigator()

const Events = () => {
  const { theme } = useSelector(state => state.user)

  return (
    <View style={[events.container, { backgroundColor: theme ? color.dark : color.white }]}>
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