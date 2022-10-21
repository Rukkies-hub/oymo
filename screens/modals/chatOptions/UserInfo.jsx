import React from 'react'
import { useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { useState } from 'react'
import OymoFont from '../../../components/OymoFont'
import { mo } from '../../../style/messageOptions'
import { useSelector } from 'react-redux'
import color from '../../../style/color'
import { View } from 'react-native'

const UserInfo = ({ _user }) => {
  const { theme, profile } = useSelector(state => state.user)
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const call = async () => {
      const user = await (await getDoc(doc(db, 'users', _user))).data()
      setUserInfo(user)
    }
    call()
  }, [])

  const distance = (lat1, lon1, lat2, lon2, unit) => {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
  }

  return (
    <View>
      <OymoFont message={`@${userInfo?.username}`} fontFamily='montserrat_bold' fontStyle={{ ...mo.username, color: theme ? color.white : color.dark }} />
      <OymoFont message={`${distance(userInfo?.coords?.latitude, userInfo?.coords?.longitude, profile?.coords?.latitude, profile?.coords?.longitude).toFixed(2) } kilometers away`} fontStyle={{ ...mo.distance, color: theme ? color.white : color.dark }} />
    </View>
  )
}

export default UserInfo