import { Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../hooks/firebase'
import { rm } from '../../../../style/messag'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

const Avatar = ({ user }) => {
  const { profile } = useSelector(state => state.user)
  const [userInfo, setUserInfo] = useState(null)

  const navigation = useNavigation()

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', user))).data()
      setUserInfo(userI)
    })()
  }, [])

  return (
    <TouchableOpacity
      onPress={() => {
        user != profile?.id ?
          navigation.navigate('UserProfile', { user: userInfo, nearby: false }) :
          navigation.navigate('Profile')
      }}
    >
      <Image source={{ uri: userInfo?.photoURL }} style={rm.avatar} />
    </TouchableOpacity>
  )
}

export default Avatar