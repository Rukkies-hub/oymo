import { View, Text } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
  const { activeReelUser } = useSelector(state => state.reels)
  return (
    <View>
      <Text>Profile</Text>
    </View>
  )
}

export default Profile