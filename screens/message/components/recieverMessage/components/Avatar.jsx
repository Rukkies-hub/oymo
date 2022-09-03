import { Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../../hooks/firebase'
import { rm } from '../../../../../style/messag'

const Avatar = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', user))).data()
      setUserInfo(userI)
    })()
  }, [])

  return (
    <Image source={{ uri: userInfo?.photoURL }} style={rm.avatar} />
  )
}

export default Avatar