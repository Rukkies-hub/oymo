import React from 'react'
import { View } from 'react-native'
import color from '../../style/color'
import { profile } from '../../style/profile'

import { useIsFocused, useNavigation } from '@react-navigation/native'

import * as NavigationBar from 'expo-navigation-bar'
import { useSelector } from 'react-redux'
import { useFonts } from 'expo-font'
import ProfileDetails from './ProfileDetailes'
import Reels from './Reels'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Events from './Events'

const { Navigator, Screen } = createMaterialTopTabNavigator()

const Profile = () => {
  const { user, profile: _profile } = useSelector(state => state.user)
  const focus = useIsFocused()
  const navigation = useNavigation()

  if (focus) {
    NavigationBar.setVisibilityAsync('hidden')
    NavigationBar.setBehaviorAsync('overlay-swipe')
  }

  navigation.addListener('blur', () => {
    NavigationBar.setVisibilityAsync('visible')
  })

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View style={profile.container}>
      <>
        {
          _profile && user &&
          <>
            <ProfileDetails profile={_profile} user={user} />
            <Navigator
              tabBarPosition='bottom'
              screenOptions={{
                tabBarStyle: {
                  backgroundColor: color.white,
                  height: 50,
                  elevation: 0
                },
                tabBarLabelStyle: {
                  textTransform: 'capitalize',
                  fontFamily: 'text'
                },
                tabBarIndicatorStyle: {
                  backgroundColor: color.red
                }
              }}
            >
              <Screen name="UserReels" component={Reels} options={{ title: 'Reels' }} />
              <Screen name="UserEvents" component={Events} options={{ title: 'Events' }} />
            </Navigator>
          </>
        }
      </>
    </View>
  )
}

export default Profile