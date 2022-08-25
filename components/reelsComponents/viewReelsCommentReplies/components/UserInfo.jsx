import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import color from '../../../../style/color'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../hooks/firebase'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import OymoFont from '../../../OymoFont'
import { vrc } from '../../../../style/reelsComment'

const UserInfo = ({ _user }) => {
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
      style={{ marginRight: 5 }}
      onPress={() => {
        _user != user?.uid ?
          navigation.navigate('UserProfile', { user: userInfo }) :
          navigation.navigate('Profile')
      }}
    >
      <OymoFont message={userInfo?.username} fontFamily='montserrat_bold' fontStyle={vrc.infoUsername} />
    </TouchableOpacity>
  )
}

export default UserInfo