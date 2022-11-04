import { TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { useSelector } from 'react-redux'
import { reels } from '../../../style/viewReels'

const UserAvatar = ({ user }) => {
  const { profile } = useSelector(state => state.user)

  const navigation = useNavigation()
  const [userInfo, setUserInfo] = useState(null)

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
      style={reels.avatarButton}
    >
      <Image source={{ uri: userInfo?.photoURL }} style={reels.avatar} />
    </TouchableOpacity>
  )
}

export default UserAvatar