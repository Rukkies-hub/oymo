import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import color from '../../../style/color'
import { SimpleLineIcons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { rcr } from '../../../style/reelsComment'

const UserAvatar = ({ _user }) => {
  const { user } = useSelector(state => state.user)
  const navigation = useNavigation()
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', _user))).data()
      setUserInfo(userI)
    })()
  }, [])

  return (
    <TouchableOpacity
      onPress={() => {
        _user != user?.uid ?
          navigation.navigate('UserProfile', { user: userInfo }) :
          navigation.navigate('Profile')
      }}
    >
      {
        userInfo?.photoURL ?
          <Image source={{ uri: userInfo?.photoURL }} style={rcr.avatar} /> :
          <View style={rcr.avatarPlaceholderView}>
            <SimpleLineIcons name='user' size={10} color={color.white} />
          </View>
      }
    </TouchableOpacity>
  )
}

export default UserAvatar