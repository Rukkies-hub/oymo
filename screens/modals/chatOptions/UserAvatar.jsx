import { Image } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { mo } from '../../../style/messageOptions'

const UserAvatar = ({ _user }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const call = async () => {
      const user = await (await getDoc(doc(db, 'users', _user))).data()
      setUserInfo(user)
    }
    call()
  }, [])

  return (
    <Image source={{ uri: userInfo?.photoURL }} style={mo.userAvatar} />
  )
}

export default UserAvatar