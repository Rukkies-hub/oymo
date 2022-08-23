import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { useFonts } from 'expo-font'
import color from '../../../style/color'
import { useNavigation } from '@react-navigation/native'
import { SimpleLineIcons } from '@expo/vector-icons'

const UserAvatar = ({ user }) => {
  const { userProfile } = useAuth()
  const navigation = useNavigation()

  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', user))).data()
      setUserInfo(userI)
    })()
  }, [])

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <>
      {
        userProfile ?
          <TouchableOpacity
            onPress={() => userInfo?.id == userProfile?.id ? navigation.navigate('Profile') : navigation.navigate('UserProfile', { user: userInfo })}
            style={{
              width: 50,
              height: 50,
              borderWidth: userInfo?.photoURL ? 4 : 2,
              borderRadius: 100,
              borderColor: color.white,
              overflow: 'hidden',
              backgroundColor: color.faintBlack,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {
              userInfo?.photoURL ?
                <Image
                  source={{ uri: userInfo?.photoURL }}
                  style={{
                    width: 50,
                    height: 50
                  }}
                /> :
                <SimpleLineIcons name='user' size={20} color={color.white} />
            }
          </TouchableOpacity> :
          <>
            {
              userInfo?.photoURL ?
                <Image
                  source={{ uri: userInfo?.photoURL }}
                  style={{
                    width: 50,
                    height: 50
                  }}
                /> :
                <SimpleLineIcons name='user' size={20} color={color.white} />
            }
          </>
      }
    </>
  )
}

export default UserAvatar
// for reels