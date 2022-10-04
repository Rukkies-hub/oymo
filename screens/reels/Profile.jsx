import { View, Text } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { profile } from '../../style/profile'

import ProfileDetails from './components/ProfileDetails'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
import UserReels from './UserReels'

const Profile = () => {
  const { activeReelUser } = useSelector(state => state.reels)

  return (
    <View style={profile.container}>
      {
        activeReelUser &&
        <>
          <ProfileDetails activeUser={activeReelUser?.user?.id} />
          <UserReels activeUser={activeReelUser?.user?.id} />
        </>
      }
    </View>
  )
}

export default Profile