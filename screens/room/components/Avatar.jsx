import { Image } from 'react-native'
import React from 'react'
import { msg } from '../../../style/room'

const Avatar = ({ room }) => {
  return (
    <Image
      source={{ uri: room?.image }}
      style={msg.emptyMessageViewAvatar}
    />
  )
}

export default Avatar