import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import OymoFont from '../../../components/OymoFont'
import { reels } from '../../../style/reels'
import { useSelector } from 'react-redux'
import color from '../../../style/color'

const UserInfo = ({ _user }) => {
  const { theme } = useSelector(state => state.user)

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
        flexDirection: 'row'
      }}
    >
      {
        userInfo?.username != undefined &&
        <OymoFont
          message={userInfo?.username}
          fontStyle={{
            ...reels.captionUsername,
            color: theme ? color.white : color.dark,
            marginLeft: 10
          }}
        />
      }
    </View>
  )
}

export default UserInfo
// for reels