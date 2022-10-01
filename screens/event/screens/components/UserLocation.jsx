import { Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../hooks/firebase'
import { useNavigation } from '@react-navigation/native'
import OymoFont from '../../../../components/OymoFont'
import { useSelector } from 'react-redux'
import { cl } from '../../../../style/viewAtendees'

const UserLocation = ({ _user }) => {
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
        userInfo &&
        <>
          {
            userInfo.about != undefined &&
            <>
              {
                userInfo?.address?.city != undefined &&
                <Text numberOfLines={1}>
                  Lives in
                  <OymoFont message={` ${userInfo?.address?.city}`} lines={1} fontStyle={cl.userLocation} fontFamily='montserrat_bold' />
                </Text>
              }
            </>
          }
        </>
      }
    </>
  )
}

export default UserLocation