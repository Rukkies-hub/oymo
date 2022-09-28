import { TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import color from '../../../style/color'
import { useNavigation } from '@react-navigation/native'
import { SimpleLineIcons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { reels } from '../../../style/reels'

const UserAvatar = ({ _user }) => {
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
    <>
      {
        profile ?
          <TouchableOpacity
            onPress={() => userInfo?.id == id ? navigation.navigate('Profile') : navigation.navigate('UserProfile', { user: userInfo })}
            style={[reels.userAvatarContainer, { borderWidth: userInfo?.photoURL ? 4 : 2 }]}
          >
            {
              userInfo?.photoURL ?
                <Image source={{ uri: userInfo?.photoURL }} style={reels.userAvatar} /> :
                <SimpleLineIcons name='user' size={20} color={color.white} />
            }
          </TouchableOpacity> :
          <>
            {
              userInfo?.photoURL ?
                <Image source={{ uri: userInfo?.photoURL }} style={reels.userAvatar} /> :
                <SimpleLineIcons name='user' size={20} color={color.white} />
            }
          </>
      }
    </>
  )
}

export default UserAvatar
// for reels