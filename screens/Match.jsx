import React, { useState, useRef, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import Swiper from 'react-native-deck-swiper'
import color from '../style/color'

import {
  collection,
  doc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  deleteDoc,
  updateDoc,
  increment
} from 'firebase/firestore'

import { db } from '../hooks/firebase'

import { LinearGradient } from 'expo-linear-gradient'

import generateId from '../lib/generateId'

import OymoFont from '../components/OymoFont'

import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { useDispatch, useSelector } from 'react-redux'
import { setPendingSwipes, setProfiles } from '../features/matchSlice'
import { match } from '../style/match'

import { admin } from '@env'

const Match = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { user, profile, theme } = useSelector(state => state.user)
  const profiles = useSelector(state => state.match.profiles)

  const swipeRef = useRef(null)

  const [stackSize, setStackSize] = useState(20)

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
          .filter(doc => distance(doc?.data()?.coords?.latitude, doc?.data()?.coords?.longitude, profile?.coords?.latitude, profile?.coords?.longitude).toFixed(2) <= profile?.radius != undefined ? profile?.radius : 1)
          .map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))

        if (array.length >= 1) dispatch(setProfiles(array))
        else dispatch(setProfiles([]))
      })
  }

  useEffect(() => {
    getAllProfiles()
    getPendingSwipes()
  }, [db])

  const swipeLeft = async cardIndex => {
    setStackSize(stackSize + 1)
    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    if (profile?.coins < 10) return

    setDoc(doc(db, 'users', id, 'passes', userSwiped?.id), userSwiped)
    await updateDoc(doc(db, 'users', id), { coins: increment(-10) })
    await updateDoc(doc(db, 'admin', admin), { passes: increment(1) })

    getAllProfiles()
    getPendingSwipes()
  }

  const swipeRight = async cardIndex => {
    if (profiles?.length >= 20) setStackSize(stackSize + 10)
    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    if (profile?.coins < 20) return

    getDoc(doc(db, 'users', userSwiped?.id, 'swipes', id))
      .then(async documentSnapshot => {
        if (documentSnapshot?.exists()) {
          setDoc(doc(db, 'users', id, 'swipes', userSwiped?.id), userSwiped)
          updateDoc(doc(db, 'users', id), { coins: increment(-20) })

          // CREAT A MATCH
          setDoc(doc(db, 'matches', generateId(id, userSwiped?.id)), {
            users: {
              [id]: profile,
              [userSwiped?.id]: userSwiped
            },
            usersMatched: [id, userSwiped?.id],
            timestamp: serverTimestamp()
          }).then(async () => {
            deleteDoc(doc(db, 'users', id, 'pendingSwipes', userSwiped?.id))
            updateDoc(doc(db, 'users', id), { pendingSwipes: increment(-1) })
            updateDoc(doc(db, 'users', id), { coins: increment(-20) })
            updateDoc(doc(db, 'admin', admin), { swipes: increment(1) })
            updateDoc(doc(db, 'admin', admin), { matches: increment(1) })
          })

          navigation.navigate('NewMatch', {
            loggedInProfile: profile,
            userSwiped
          })
          getAllProfiles()
          getPendingSwipes()
        } else {
          setDoc(doc(db, 'users', id, 'swipes', userSwiped?.id), userSwiped)
          setDoc(doc(db, 'users', userSwiped?.id, 'pendingSwipes', id), profile)
          updateDoc(doc(db, 'users', userSwiped?.id), { pendingSwipes: increment(1) })
          updateDoc(doc(db, 'users', id), { coins: increment(-20) })
          updateDoc(doc(db, 'admin', admin), { swipes: increment(1) })
          getAllProfiles()
          getPendingSwipes()
        }
      })

    setDoc(doc(db, 'users', id, 'swipes', userSwiped?.id), userSwiped)
    updateDoc(doc(db, 'admin', admin), { swipes: increment(1) })
  }

  const disabled = () => navigation.navigate('SetupModal')

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

  const [loaded] = useFonts({
    lightText: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Light.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={[match.container, { backgroundColor: theme ? color.dark : color.white }]}
    >
      <View style={{ flex: 1, marginTop: -5 }}>
        {
          profiles?.length >= 1 ?
            <Swiper
              ref={swipeRef}
              cards={profiles}
              containerStyle={{
                backgroundColor: color.transparent,
                marginTop: 33
              }}
              cardIndex={0}
              stackSize={stackSize}
              verticalSwipe={false}
              animateCardOpacity={true}
              backgroundColor={color.transparent}
              cardHorizontalMargin={0}
              cardVerticalMargin={0}
              onSwipedLeft={cardIndex => (profile?.photoURL != undefined && profile?.username != undefined) ? swipeLeft(cardIndex) : disabled()}
              onSwipedRight={cardIndex => (profile?.photoURL != undefined && profile?.username != undefined) ? swipeRight(cardIndex) : disabled()}
              onTapCard={() => !profile ? disabled() : null}
              dragStart={() => !profile ? disabled() : null}
              overlayLabels={{
                left: { title: 'NOPE', style: { label: match.nope } },
                right: { title: 'MATCH', style: { label: match.match } }
              }}

              renderCard={card => (
                <View key={card?.id} style={match.card}>
                  <Image style={match.cardImage} source={{ uri: card?.photoURL }} />

                  <LinearGradient colors={['transparent', theme ? color.dark : color.black]} style={match.cardGradient}>
                    <View style={match.userDetail}>
                      <TouchableOpacity onPress={() => (profile?.photoURL != undefined && profile?.username != undefined) ? navigation.navigate('UserProfile', { user: card }) : disabled()} style={match.usernameButton}>
                        <OymoFont fontStyle={match.username} fontFamily='montserrat_bold' message={card?.username} />
                        {
                          card?.age != undefined &&
                          <OymoFont fontStyle={match.age} message={card?.age} />
                        }
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => (profile?.photoURL != undefined && profile?.username != undefined) ? navigation.navigate('UserProfile', { user: card }) : disabled()} style={match.moreInfoButton}>
                        <MaterialCommunityIcons name='information-outline' size={20} color={color.white} />
                      </TouchableOpacity>
                    </View>

                    {
                      card?.address != undefined &&
                      <View style={match.detailesContainer}>
                        <MaterialCommunityIcons name='home-outline' size={17} color={color.white} />
                        <OymoFont message={`${card?.address?.city}, ${card?.address?.country}`} fontStyle={match.detail} fontFamily='montserrat_light' />
                      </View>
                    }

                    {
                      (card?.coords != undefined && profile?.coords) &&
                      <View style={match.detailesContainer}>
                        <MaterialCommunityIcons name="map-marker-radius-outline" size={17} color={color.white} />
                        <OymoFont message={`${distance(card?.coords?.latitude, card?.coords?.longitude, profile?.coords?.latitude, profile?.coords?.longitude).toFixed(2)} kilometers away`} fontStyle={match.detail} fontFamily='montserrat_light' />
                      </View>
                    }

                    {
                      card?.about?.length >= 20 &&
                      <Text numberOfLines={4} style={[match.about, { fontFamily: 'lightText' }]}>
                        {card?.about}
                      </Text>
                    }

                    {
                      card?.passions?.length > 0 &&
                      <View style={match.detailesContainer}>
                        <View style={match.passionsContainer}>
                          {
                            card?.passions?.map((passion, index) => (
                              <View key={index} style={match.passions}>
                                <OymoFont message={passion} fontFamily='montserrat_light' fontStyle={match.passion} />
                              </View>
                            ))
                          }
                        </View>
                      </View>
                    }
                  </LinearGradient>
                </View>
              )}
            /> :
            (
              <View style={match.indicator}>
                <ActivityIndicator color={theme ? color.white : color.black} size='large' />
              </View>
            )
        }
      </View>
    </View>
  )
}

export default Match