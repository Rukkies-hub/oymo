import { View, Text } from 'react-native'
import React from 'react'
import color from '../../style/color'
import { profile } from '../../style/profile'

import { useIsFocused, useNavigation } from '@react-navigation/native'

import * as NavigationBar from 'expo-navigation-bar'
import { useSelector } from 'react-redux'
import ProfileDetails from './ProfileDetailes'
import { useFonts } from 'expo-font'

const Profile = () => {
  const user = useSelector(state => state.user.user)
  const _profile = useSelector(state => state.user.profile)
  const focus = useIsFocused()
  const navigation = useNavigation()

  if (focus) {
    NavigationBar.setPositionAsync('absolute')
    NavigationBar.setBackgroundColorAsync(color.transparent)
  }

  navigation.addListener('blur', () => {
    NavigationBar.setPositionAsync('relative')
    NavigationBar.setBackgroundColorAsync(theme == 'dark' ? color.black : color.white)
    NavigationBar.setButtonStyleAsync(theme == 'dark' ? 'light' : 'dark')
  })

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <View style={profile.container}>
      <>
        {
          _profile && user &&
          <>
            <ProfileDetails profile={_profile} user={user} />
          </>
        }
      </>
    </View>
  )
}

export default Profile