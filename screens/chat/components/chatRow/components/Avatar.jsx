import { Image, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../../../hooks/firebase'
import { SimpleLineIcons } from '@expo/vector-icons'
import { chat } from '../../../../../style/chat'
import color from '../../../../../style/color'

const Avatar = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', user),
      doc => setUserInfo(doc?.data()))
    return unsub
  }, [])

  return (
    <>
      {
        userInfo?.photoURL ?
          <Image source={{ uri: userInfo?.photoURL }} style={chat.avatar} /> :
          <View style={chat.avatarPlaceholder}>
            <SimpleLineIcons name='user' size={20} color={color.dark} />
          </View>
      }
    </>
  )
}

export default Avatar