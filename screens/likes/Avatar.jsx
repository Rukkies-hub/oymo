import { Dimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { SimpleLineIcons } from '@expo/vector-icons'
import AutoHeightImage from 'react-native-auto-height-image'
import { likes } from '../../style/likes'
const { width } = Dimensions.get('window')

const Avatar = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (() => {
      onSnapshot(doc(db, 'users', user),
        doc => setUserInfo(doc?.data()))
    })()
  }, [])

  return (
    <>
      {
        userInfo?.photoURL ?
          <AutoHeightImage source={{ uri: userInfo?.photoURL }} width={(width / 3.5)} style={likes.avatar} /> :
          <View style={likes.avatarPlaceholder}>
            <SimpleLineIcons name='user' size={20} color={color.dark} />
          </View>
      }
    </>
  )
}

export default Avatar