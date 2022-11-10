import { TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { useSelector } from 'react-redux'
import OymoFont from '../../OymoFont'
import { _comments } from '../../../style/reelsComment'

const UserInfo = ({ _user }) => {
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
          navigation.navigate('UserProfile', { user: userInfo, nearby: false }) :
          navigation.navigate('Profile')
      }}
    >
      <OymoFont message={userInfo?.username} fontStyle={_comments.commentUserInfo} fontFamily='montserrat_bold' />
    </TouchableOpacity>
  )
}

export default UserInfo