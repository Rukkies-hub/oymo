import React from 'react'
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { collection, deleteDoc, doc, getDoc, getDocs, increment, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import generateId from '../../lib/generateId'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import Avatar from './Avatar'
import Username from './Username'
import { useDispatch, useSelector } from 'react-redux'
import { likes } from '../../style/likes'
import OymoFont from '../../components/OymoFont'
import color from '../../style/color'
import { setPendingSwipes, setProfiles } from '../../features/matchSlice'

const Likes = () => {
  const { user, profile, theme } = useSelector(state => state.user)
  const { pendingSwipes, profiles } = useSelector(state => state.match)
  const navigation = useNavigation()
  const dispatch = useDispatch()

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  const getPendingSwipes = async () => {
    dispatch(setPendingSwipes([]))
    const querySnapshot = await getDocs(collection(db, 'users', id, 'pendingSwipes'))

    if (querySnapshot?.docs?.length >= 1)
      dispatch(
        setPendingSwipes(querySnapshot?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        })))
      )
    else dispatch(setPendingSwipes([]))
  }

  const getAllProfiles = async () => {
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

        if (array.length >= 1) dispatch(setProfiles(array))
        else dispatch(setProfiles([]))
      })
  }

  const swipeLeft = async like => {
    await setDoc(doc(db, 'users', id, 'passes', like.id), like)
    await deleteDoc(doc(db, 'users', id, 'pendingSwipes', like.id))

    getPendingSwipes()
    getAllProfiles()
  }

  const swipeRight = async like => {
    const needle = like.id
    const cardIndex = profiles.findIndex(item => item.id === needle)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    if (profile?.coins < 20) return

    await getDoc(doc(db, 'users', id, 'pendingSwipes', userSwiped?.id))
      .then(async documentSnapshot => {
        if (documentSnapshot.exists()) {
          setDoc(doc(db, 'users', id, 'swipes', userSwiped?.id), userSwiped)
          await updateDoc(doc(db, 'users', id), { coins: increment(-20) })

          // CREAT A MATCH
          setDoc(doc(db, 'matches', generateId(id, userSwiped?.id)), {
            users: {
              [id]: profile,
              [userSwiped?.id]: userSwiped
            },
            usersMatched: [id, userSwiped?.id],
            timestamp: serverTimestamp()
          }).then(async () => {
            await deleteDoc(doc(db, 'users', id, 'pendingSwipes', userSwiped?.id))
            await updateDoc(doc(db, 'users', id), { pendingSwipes: increment(-1) })
            await updateDoc(doc(db, 'users', id), { coins: increment(-20) })
          })

          navigation.navigate('NewMatch', {
            loggedInProfile: profile,
            userSwiped
          })
          getAllProfiles()
        }
      })

    getPendingSwipes()
  }

  const distance = (lat1, lon1, lat2, lon2, unit) => {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
  }

  return (
    <View style={[likes.likesContainer, { backgroundColor: theme ? color.dark : color.white }]}>
      {
        pendingSwipes?.length > 0 ?
          <FlatList
            data={pendingSwipes}
            keyExtractor={item => item?.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: like }) => (
              <View style={likes.likesListContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: like })}>
                  <Avatar user={like?.id} />
                </TouchableOpacity>

                <View style={likes.rightView}>
                  <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: like })}>
                    <Username user={like?.id} />
                  </TouchableOpacity>

                  {
                    like?.address?.city != undefined &&
                    <View style={likes.infoContainer}>
                      <Feather name='home' size={12} color={theme ? color.white : color.dark} />

                      <View style={likes.infoView}>
                        <OymoFont message='Lives in' fontStyle={{...likes.infoText, color: theme ? color.white : color.dark}} />
                        <OymoFont message={like?.address?.city} lines={1} fontStyle={{...likes.infoText, color: theme ? color.white : color.dark}} fontFamily='montserrat_bold' />
                      </View>
                    </View>
                  }

                  <View style={likes.controlesView}>
                    <TouchableOpacity onPress={() => swipeRight(like)} style={likes.matchButon}>
                      <OymoFont message='Match' fontStyle={{ color: color.white }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => swipeLeft(like)} style={[likes.nopeButton, {backgroundColor: theme ? color.lightText : color.offWhite}]}>
                      <OymoFont message='Nope' fontStyle={{ color: color.red }} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          /> :
          <View style={likes.loading}>
            <ActivityIndicator size='large' color={theme ? color.white : color.white} />
          </View>
      }
    </View>
  )
}

export default Likes