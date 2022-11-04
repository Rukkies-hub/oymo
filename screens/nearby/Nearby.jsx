import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { nb } from '../../style/nearby'
import { useDispatch, useSelector } from 'react-redux'
import color from '../../style/color'
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { setNearbyProfiles } from '../../features/matchSlice'
import { useNavigation } from '@react-navigation/native'

const Nearby = () => {
  const { theme, user, profile } = useSelector(state => state.user)
  const { nearbyProfiles } = useSelector(state => state.match)

  const dispatch = useDispatch()
  const navigation = useNavigation()

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

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

  const getAllProfiles = async () => {
    const profile = await (await getDoc(doc(db, 'users', id))).data()
    if (!profile) return

    const passes = await getDocs(collection(db, 'users', id, 'passes'))
      .then(snapshot => snapshot?.docs?.map(doc => doc?.id))

    const passeedUserIds = (await passes).length > 0 ? passes : ['test']

    const swipes = await getDocs(collection(db, 'users', id, 'swipes'))
      .then(snapshot => snapshot?.docs?.map(doc => doc?.id))

    const swipededUserIds = (await swipes).length > 0 ? swipes : ['test']

    onSnapshot(query(collection(db, 'users'), where('id', 'not-in', [...passeedUserIds, ...swipededUserIds])),
      snapshot => {
        const array = snapshot?.docs?.filter(doc => doc?.data()?.photoURL != null)
          .filter(doc => doc?.data()?.username != null || doc?.data()?.username != '')
          .filter(doc => doc?.id !== id)
          .filter(doc => distance(doc?.data()?.coords?.latitude, doc?.data()?.coords?.longitude, profile?.coords?.latitude, profile?.coords?.longitude).toFixed(2) <= 1)
          .map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))

        if (array.length >= 1) {
          dispatch(setNearbyProfiles([]))
          dispatch(setNearbyProfiles(array))
        }
        else dispatch(setNearbyProfiles([]))
      })
  }

  useLayoutEffect(() => {
    getAllProfiles()
  }, [db])

  return (
    <ScrollView
      style={[nb.containr, { backgroundColor: theme ? color.black : color.white }]}
      contentContainerStyle={nb.scrollViewContainer}
      showsVerticalScrollIndicator={false}
    >
      {
        nearbyProfiles?.length >= 1 &&
        <>
          {
            nearbyProfiles?.map((item, i) => {
              return (
                <TouchableOpacity key={i} style={nb.user} onPress={() => navigation.navigate('UserProfile', { user: item, nearby: true })}>
                  <Image source={{ uri: item?.photoURL }} style={nb.avatar} />
                  <Text style={[nb.text, { color: theme ? color.white : color.dark }]}>{item?.username}, {item?.age}</Text>
                  <Text style={[nb.text, { color: theme ? color.white : color.dark, marginTop: 0, fontSize: 12 }]}>{`${distance(item?.coords?.latitude, item?.coords?.longitude, profile?.coords?.latitude, profile?.coords?.longitude).toFixed(2)}KM`}</Text>
                </TouchableOpacity>
              )
            })
          }
        </>
      }
    </ScrollView>
  )
}

export default Nearby