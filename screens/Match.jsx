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
  deleteDoc
} from 'firebase/firestore'

import { db } from '../hooks/firebase'

import { LinearGradient } from 'expo-linear-gradient'

import generateId from '../lib/generateId'

import OymoFont from '../components/OymoFont'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { useDispatch, useSelector } from 'react-redux'
import { setPendingSwipes, setProfiles } from '../features/matchSlice'
import { match } from '../style/match'

const Match = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { user, profile } = useSelector(state => state.user)
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

    setDoc(doc(db, 'users', id, 'passes', userSwiped?.id), userSwiped)

    getAllProfiles()
    getPendingSwipes()
  }

  const swipeRight = async cardIndex => {
    if (profiles?.length >= 20) setStackSize(stackSize + 10)
    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    getDoc(doc(db, 'users', userSwiped?.id, 'swipes', id))
      .then(documentSnapshot => {
        if (documentSnapshot?.exists()) {
          setDoc(doc(db, 'users', id, 'swipes', userSwiped?.id), userSwiped)

          // CREAT A MATCH
          setDoc(doc(db, 'matches', generateId(id, userSwiped?.id)), {
            users: {
              [id]: profile,
              [userSwiped?.id]: userSwiped
            },
            usersMatched: [id, userSwiped?.id],
            timestamp: serverTimestamp()
          }).then(async () => await deleteDoc(doc(db, 'users', id, 'pendingSwipes', userSwiped?.id)))

          navigation.navigate('NewMatch', {
            loggedInProfile: profile,
            userSwiped
          })
          getAllProfiles()
          getPendingSwipes()
        } else {
          setDoc(doc(db, 'users', id, 'swipes', userSwiped?.id), userSwiped)
          setDoc(doc(db, 'users', userSwiped?.id, 'pendingSwipes', id), profile)
          getAllProfiles()
          getPendingSwipes()
        }
      })

    setDoc(doc(db, 'users', id, 'swipes', userSwiped?.id), userSwiped)
  }

  const disabled = () => navigation.navigate('SetupModal')

  const [loaded] = useFonts({
    lightText: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Light.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={match.container}
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
              onSwipedLeft={cardIndex => profile ? swipeLeft(cardIndex) : disabled()}
              onSwipedRight={cardIndex => profile ? swipeRight(cardIndex) : disabled()}
              onTapCard={() => !profile ? disabled() : null}
              dragStart={() => !profile ? disabled() : null}
              overlayLabels={{
                left: { title: 'NOPE', style: { label: match.nope } },
                right: { title: 'MATCH', style: { label: match.match } }
              }}

              renderCard={card => (
                <View key={card?.id} style={match.card}>
                  <Image style={match.cardImage} source={{ uri: card?.photoURL }} />

                  <LinearGradient colors={['transparent', color.black]} style={match.cardGradient}>
                    <View style={match.userDetail}>
                      <TouchableOpacity onPress={() => profile ? navigation.navigate('UserProfile', { user: card }) : disabled()} style={match.usernameButton}>
                        <OymoFont fontStyle={match.username} fontFamily='montserrat_bold' message={card?.username} />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => profile ? navigation.navigate('UserProfile', { user: card }) : disabled()} style={match.moreInfoButton}>
                        <MaterialCommunityIcons name='information-outline' size={20} color={color.white} />
                      </TouchableOpacity>
                    </View>

                    {
                      card?.job != undefined &&
                      <View style={match.detailesContainer}>
                        <MaterialCommunityIcons name='briefcase-variant-outline' size={17} color={color.white} />
                        <Text style={[match.detail, { fontFamily: 'lightText' }]}>
                          {` ${card?.job}`} {card?.job ? 'at' : null} {card?.company}
                        </Text>
                      </View>
                    }

                    {
                      card?.school != undefined &&
                      <View style={match.detailesContainer}>
                        <MaterialCommunityIcons name='school-outline' size={17} color={color.white} />
                        <OymoFont message={` ${card?.school}`} fontStyle={match.detail} fontFamily='montserrat_light' />
                      </View>
                    }

                    {
                      card?.city != undefined &&
                      <View style={match.detailesContainer}>
                        <MaterialCommunityIcons name='home-outline' size={17} color={color.white} />
                        <OymoFont message={` ${card?.city}`} fontStyle={match.detail} fontFamily='montserrat_light' />
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
                <ActivityIndicator color={color.red} size='large' />
              </View>
            )
        }
      </View>
    </View>
  )
}

export default Match