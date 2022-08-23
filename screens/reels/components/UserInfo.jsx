import { TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { useNavigation } from '@react-navigation/native'
import OymoFont from '../../../components/OymoFont'
import { reels } from '../../../style/reels'
import { useSelector } from 'react-redux'

const UserInfo = ({ _user }) => {
  const { user, profile } = useSelector(state => state.user)
  const navigation = useNavigation()

  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', _user))).data()
      setUserInfo(userI)
    })()
  }, [])

  return (
    <>
      {
        profile ?
          <TouchableOpacity
            onPress={() =>
              userInfo?.id == user?.uid ? navigation.navigate('Profile') :
                navigation.navigate('UserProfile', { user: userInfo })}
          >
            <OymoFont message={`@${userInfo?.username}`} fontStyle={reels.captionUsername} />
          </TouchableOpacity> :
          <OymoFont message={`@${userInfo?.username}`} fontStyle={reels.captionUsername} />
      }
    </>
  )
}

export default UserInfo
// for reels