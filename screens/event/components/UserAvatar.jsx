import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { SimpleLineIcons } from '@expo/vector-icons'
import color from '../../../style/color'
import { _event } from '../../../style/event'
import { useState, useEffect } from 'react'

const UserAvatar = ({ user: _user, index }) => {
  const { user, profile } = useSelector(state => state.user)
  const navigation = useNavigation()

  const [userInfo, setUserInfo] = useState(null)

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', _user))).data()
      setUserInfo(userI)
    })()
  }, [])

  return (
    <View style={[_event.userAvatarView, { zIndex: index + 1 }]}>
      {
        userInfo?.photoURL ?
          <Image source={{ uri: userInfo?.photoURL }} style={_event.userAvatar} /> :
          <SimpleLineIcons name='user' size={20} color={color.white} />
      }
    </View>
  )
}

export default UserAvatar