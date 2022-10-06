import { ScrollView } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { profile } from '../../style/profile'

import ProfileDetails from './components/ProfileDetails'
import UserReels from './UserReels'

const Profile = () => {
  const { activeReelUser } = useSelector(state => state.reels)

  return (
    <ScrollView style={profile.container} showsVerticalScrollIndicator={false}>
      {
        activeReelUser &&
        <>
          <ProfileDetails activeUser={activeReelUser?.user?.id} />
          <UserReels activeUser={activeReelUser?.user?.id} />
        </>
      }
    </ScrollView>
  )
}

export default Profile