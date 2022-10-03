import { View, Text } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { profile } from '../../style/profile'

import ProfileDetails from './components/ProfileDetails'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'

const Profile = () => {
  const { activeReelUser } = useSelector(state => state.reels)

  const focus = useIsFocused()
  const navigation = useNavigation()

  if (focus) {
    NavigationBar.setVisibilityAsync('hidden')
    NavigationBar.setBehaviorAsync('overlay-swipe')
  }

  navigation.addListener('blur', () => {
    NavigationBar.setVisibilityAsync('visible')
  })

  return (
    <View style={profile.container}>
      {
        activeReelUser &&
        <>
          <ProfileDetails activeUser={activeReelUser?.user?.id} />
        </>
      }
    </View>
  )
}

export default Profile