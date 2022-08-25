import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import color from '../../../style/color'
import { useSelector } from 'react-redux'
import OymoFont from '../../OymoFont'

const Reply = ({ _user, reply }) => {
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
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start'
      }}
    >
      <TouchableOpacity
        onPress={() => {
          _user != user?.uid ?
            navigation.navigate('UserProfile', { user: userInfo }) :
            navigation.navigate('Profile')
        }}
      >
        <OymoFont
          message={`@${userInfo?.username}`}
          fontFamily='montserrat_bold'
          fontStyle={{
            color: color.white,
            fontSize: 14
          }}
        />
      </TouchableOpacity>
    </View>
  )
}

export default Reply