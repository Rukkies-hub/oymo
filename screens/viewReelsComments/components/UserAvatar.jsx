import { TouchableOpacity, Image, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { SimpleLineIcons } from '@expo/vector-icons'
import color from '../../../style/color'
import { useSelector } from 'react-redux'
import { vrc } from '../../../style/reelsComment'

const UserAvatar = ({ _user }) => {
  const { user } = useSelector(state => state.user)
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
    <TouchableOpacity
      onPress={() => {
        _user != id ?
          navigation.navigate('UserProfile', { user: userInfo }) :
          navigation.navigate('Profile')
      }}
    >
      {
        userInfo?.photoURL ?
          <Image source={{ uri: userInfo?.photoURL }} style={vrc.avatar} /> :
          <View style={vrc.avatarPlaceholderView}          >
            <SimpleLineIcons name='user' size={12} color={color.white} />
          </View>
      }
    </TouchableOpacity>
  )
}

export default UserAvatar