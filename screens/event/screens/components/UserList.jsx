import { View } from 'react-native'
import React from 'react'
import { cl } from '../../../../style/viewAtendees'
import UserAvatar from './UserAvatar'
import UserInfo from './UserInfo'
import UserLocation from './UserLocation'

const UserList = ({ attendee }) => {

  return (
    <View style={cl.card}>
      <View style={cl.left}>
        <UserAvatar _user={attendee?.id} />
        <View>
          <UserInfo _user={attendee?.id} />
          <UserLocation _user={attendee?.id} />
        </View>
      </View>
    </View>
  )
}

export default UserList