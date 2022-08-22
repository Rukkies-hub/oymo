import React, { useState, useRef, useEffect } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'

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
import { setProfiles } from '../features/matchSlice'
const { width, height } = Dimensions.get('window')

// import { user } from '../features/matchSlice'

const Match = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.user)
  const profiles = useSelector(state => state.match.profiles)

  const swipeRef = useRef(null)

  const [stackSize, setStackSize] = useState(20)

  useEffect(() => {
    (async () => {
      const passes = await getDocs(collection(db, 'users', user?.uid, 'passes'))
        .then(snapshot => snapshot?.docs?.map(doc => doc?.id))

      const passeedUserIds = (await passes).length > 0 ? passes : ['test']

      const swipes = await getDocs(collection(db, 'users', user?.uid, 'swipes'))
        .then(snapshot => snapshot?.docs?.map(doc => doc?.id))

      const swipededUserIds = (await swipes).length > 0 ? swipes : ['test']

      onSnapshot(query(collection(db, 'users'), where('id', 'not-in', [...passeedUserIds, ...swipededUserIds])),
        snapshot => {
          dispatch(setProfiles(
            snapshot?.docs?.filter(doc => doc?.data()?.photoURL != null)
              .filter(doc => doc?.data()?.username != null || doc?.data()?.username != '')
              .filter(doc => doc?.id !== user?.uid)
              .map(doc => ({
                id: doc?.id,
                ...doc?.data()
              }))
          ))
        })
    })()
  }, [db])

  const swipeLeft = async cardIndex => {
    setStackSize(stackSize + 1)
    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    setDoc(doc(db, 'users', user?.uid, 'passes', userSwiped?.id), userSwiped)
  }

  const swipeRight = async cardIndex => {
    if (profiles?.length >= 20) setStackSize(stackSize + 10)
    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    getDoc(doc(db, 'users', userSwiped?.id, 'swipes', user?.uid))
      .then(documentSnapshot => {
        if (documentSnapshot?.exists()) {
          setDoc(doc(db, 'users', user?.uid, 'swipes', userSwiped?.id), userSwiped)

          // CREAT A MATCH
          setDoc(doc(db, 'matches', generateId(user?.uid, userSwiped?.id)), {
            users: {
              [user?.uid]: userProfile,
              [userSwiped?.id]: userSwiped
            },
            usersMatched: [user?.uid, userSwiped?.id],
            timestamp: serverTimestamp()
          }).then(async () => await deleteDoc(doc(db, 'users', user?.uid, 'pendingSwipes', userSwiped?.id)))

          navigation.navigate('NewMatch', {
            loggedInProfile: userProfile,
            userSwiped
          })
        } else {
          setDoc(doc(db, 'users', user?.uid, 'swipes', userSwiped?.id), userSwiped)
          setDoc(doc(db, 'users', userSwiped?.id, 'pendingSwipes', user?.uid), userProfile)
        }
      })

    setDoc(doc(db, 'users', user?.uid, 'swipes', userSwiped?.id), userSwiped)
  }

  const disabled = () => navigation.navigate('SetupModal')

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    lightText: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Light.ttf'),
    boldText: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
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
              onSwipedLeft={cardIndex => userProfile ? swipeLeft(cardIndex) : disabled()}
              onSwipedRight={cardIndex => userProfile ? swipeRight(cardIndex) : disabled()}
              overlayLabels={{
                left: {
                  title: 'NOPE',
                  style: {
                    label: {
                      textAlign: 'center',
                      color: color.red,
                      fontFamily: 'text',
                      borderWidth: 4,
                      borderRadius: 20,
                      borderColor: color.red,
                      position: 'absolute',
                      top: 0,
                      right: 20,
                      width: 150
                    }
                  }
                },

                right: {
                  title: 'MATCH',
                  style: {
                    label: {
                      textAlign: 'center',
                      color: color.lightGreen,
                      fontFamily: 'text',
                      borderWidth: 4,
                      borderRadius: 20,
                      borderColor: color.lightGreen,
                      position: 'absolute',
                      top: 0,
                      left: 20,
                      width: 160
                    }
                  }
                }
              }}

              renderCard={card => (
                <View
                  key={card?.id}
                  style={{
                    backgroundColor: color.transparent,
                    width,
                    height: height - 112,
                    marginTop: -25,
                    borderRadius: 12,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Image
                    style={{
                      flex: 1,
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                    }}
                    source={{ uri: card?.photoURL }}
                  />

                  <LinearGradient
                    colors={['transparent', color.dark]}
                    style={{
                      width: '100%',
                      minHeight: 60,
                      position: 'absolute',
                      bottom: 0,
                      padding: 20,
                      marginBottom: -2
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <TouchableOpacity
                        // onPress={() => userProfile ? navigation.navigate('UserProfile', { user: card }) : disabled()}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center'
                        }}
                      >
                        <OymoFont
                          fontStyle={{
                            fontSize: 30,
                            color: color.white,
                            marginBottom: 10,
                            textTransform: 'capitalize'
                          }}
                          fontFamily='montserrat_bold'
                          message={card?.username}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        // onPress={() => userProfile ? navigation.navigate('UserProfile', { user: card }) : disabled()}
                        style={{
                          width: 40,
                          height: 40,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <MaterialCommunityIcons name='information-outline' size={20} color={color.white} />
                      </TouchableOpacity>
                    </View>

                    {
                      card?.job != '' &&
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center'
                        }}
                      >
                        <MaterialCommunityIcons name='briefcase-variant-outline' size={17} color={color.white} />
                        <Text
                          style={{
                            fontSize: 18,
                            color: color.white,
                            fontFamily: 'lightText'
                          }}
                        >
                          {` ${card?.job}`} {card?.job ? 'at' : null} {card?.company}
                        </Text>
                      </View>
                    }

                    {
                      card?.school != '' &&
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          marginTop: 10
                        }}
                      >
                        <MaterialCommunityIcons name='school-outline' size={17} color={color.white} />
                        <Text
                          style={{
                            fontSize: 18,
                            color: color.white,
                            fontFamily: 'lightText'
                          }}
                        >
                          {` ${card?.school}`}
                        </Text>
                      </View>
                    }

                    {
                      card?.city != '' &&
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          marginTop: 10
                        }}
                      >
                        <MaterialCommunityIcons name='home-outline' size={17} color={color.white} />
                        <Text
                          style={{
                            fontSize: 18,
                            color: color.white,
                            fontFamily: 'lightText'
                          }}
                        >
                          {` ${card?.city}`}
                        </Text>
                      </View>
                    }

                    {
                      card?.about?.length >= 20 &&
                      <Text
                        numberOfLines={4}
                        style={{
                          color: color.white,
                          fontSize: 18,
                          fontFamily: 'lightText',
                          marginTop: 10
                        }}
                      >
                        {card?.about}
                      </Text>
                    }

                    {
                      card?.passions?.length > 0 &&
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          marginTop: 10
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                          }}
                        >
                          {
                            card?.passions?.map((passion, index) => (
                              <View
                                key={index}
                                style={{
                                  paddingHorizontal: 10,
                                  paddingVertical: 5,
                                  borderRadius: 50,
                                  marginBottom: 10,
                                  marginRight: 10,
                                  backgroundColor: `${color.faintBlack}`
                                }}
                              >
                                <Text
                                  style={{
                                    color: color.white,
                                    fontSize: 12,
                                    fontFamily: 'lightText',
                                    textTransform: 'capitalize'
                                  }}
                                >
                                  {passion}
                                </Text>
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
              <View
                style={{
                  flex: 1,
                  backgroundColor: color.transparent,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <ActivityIndicator color={color.red} size='large' />
              </View>
            )
        }
      </View>
    </View>
  )
}

export default Match