import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions } from 'react-native'
import color from '../../../style/color'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { vrc } from '../../../style/reelsComment'
import OymoFont from '../../../components/OymoFont'

const { width } = Dimensions.get('window')

const Reply = ({ _user, comment }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', _user))).data()
      setUserInfo(userI)
    })()
  }, [])

  return (
    <View style={vrc.replyContainer}>
      <OymoFont message={`@${userInfo?.username}`} fontStyle={{ color: color.white, fontSize: 14 }} />
      <OymoFont message={comment} fontStyle={{ color: color.white, marginTop: 5 }} />
    </View>
  )
}

export default Reply