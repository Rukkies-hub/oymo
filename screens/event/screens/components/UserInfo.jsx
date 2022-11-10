import { TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../hooks/firebase'
import { useNavigation } from '@react-navigation/native'
import OymoFont from '../../../../components/OymoFont'
import { useSelector } from 'react-redux'
import { cl } from '../../../../style/viewAtendees'

const UserInfo = ({ _user }) => {
  const { user, profile } = useSelector(state => state.user)
  const navigation = useNavigation()

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

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
              userInfo?.id == id ? navigation.navigate('Profile') :
                navigation.navigate('UserProfile', { user: userInfo, nearby: false })}
          >
            <OymoFont message={userInfo?.username} fontStyle={cl.captionUsername} fontFamily='montserrat_bold' />
          </TouchableOpacity> :
          <OymoFont message={userInfo?.username} fontStyle={cl.captionUsername} fontFamily='montserrat_bold' />
      }
    </>
  )
}

export default UserInfo