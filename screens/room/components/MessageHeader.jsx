import React from 'react'
import Header from '../../../components/Header'

const MessageHeader = ({ room }) => {
  return (
    <Header
      showBack
      showTitle
      showMatchAvatar
      title={room?.name}
      matchAvatar={room?.image}
    />
  )
}

export default MessageHeader