import { Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { msg } from '../../../style/messag'

const Avatar = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', user),
      doc => setUserInfo(doc?.data()))
    return unsub
  }, [])

  return (
    <Image
      source={{ uri: userInfo?.photoURL }}
      style={msg.emptyMessageViewAvatar}
    />
  )
}

export default Avatar