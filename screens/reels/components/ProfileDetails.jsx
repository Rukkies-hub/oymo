import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome, Feather, Fontisto, SimpleLineIcons, AntDesign, MaterialCommunityIcons, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons'
import color from '../../../style/color'
import { useNavigation, useRoute } from '@react-navigation/native'

import Bar from '../../../components/Bar'
import Header from '../../../components/Header'
import { BlurView } from 'expo-blur'
import OymoFont from '../../../components/OymoFont'

import { profile as _profile } from '../../../style/profile'
import { useDispatch, useSelector } from 'react-redux'
import { collection, deleteDoc, doc, getDoc, getDocs, increment, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import generateId from '../../../lib/generateId'
import { setPendingSwipes, setProfiles } from '../../../features/matchSlice'

import { admin } from '@env'
import { up } from '../../../style/userProfile'

const ProfileDetails = () => {
  const navigation = useNavigation()
  const params = useRoute()
  const { profiles } = useSelector(state => state.match)
  const { user, profile, theme } = useSelector(state => state.user)
  const { activeReelUser } = useSelector(state => state.reels)

  const activeUser = activeReelUser?.user?.id

  const dispatch = useDispatch()

  const [aboutLimit, setAboutLimit] = useState(2)
  const [showMatch, setShowMatch] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [reels, setReels] = useState(0)

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  useEffect(() => {
    const getProfile = async () => {
      if (activeUser == undefined) return
      let I = await (await getDoc(doc(db, 'users', activeUser))).data()
      setUserInfo(I)
    }
    getProfile()
  }, [activeReelUser])

  useEffect(() => {
    const needle = userInfo
    const cardIndex = profiles?.findIndex(item => item.id === needle?.id)

    if (!profiles[cardIndex]) {
      setShowMatch(false)
      return
    }

    const userSwiped = profiles[cardIndex]

    if (userSwiped) setShowMatch(true)
  }, [activeUser, navigation, userInfo])

  useEffect(() => {
    if (activeUser == undefined) return
    const call = () => {
      onSnapshot(query(collection(db, 'reels'),
        where('user.id', '==', activeUser)),
        snapshot => {
          setReels(snapshot?.docs?.length)
          console.log('reels: ', snapshot?.docs?.length)
        }
      )

    }
    call()
  }, [db, activeUser])

  const getPendingSwipes = async () => {
    dispatch(setPendingSwipes([]))
    const querySnapshot = await getDocs(query(collection(db, 'users', id, 'pendingSwipes'), where('photoURL', '!=', null)))

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

        if (array.length >= 1) {
          dispatch(setProfiles([]))
          dispatch(setProfiles(array))
        }
        else dispatch(setProfiles([]))
      })
  }

  const swipeRight = async () => {
    if (activeUser == undefined) return

    const needle = activeUser
    const cardIndex = profiles?.findIndex(item => item.id === needle)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    if (profile?.coins < 20) return

    getDoc(doc(db, 'users', userSwiped?.id, 'swipes', id))
      .then(async documentSnapshot => {
        if (documentSnapshot?.exists()) {
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
            await updateDoc(doc(db, 'admin', admin), { swipes: increment(1) })
            await updateDoc(doc(db, 'admin', admin), { matches: increment(1) })
          })

          navigation.navigate('NewMatch', {
            loggedInProfile: profile,
            userSwiped
          })
          //getAllProfiles()
          getPendingSwipes()
        } else {
          setDoc(doc(db, 'users', id, 'swipes', userSwiped?.id), userSwiped)
          setDoc(doc(db, 'users', userSwiped?.id, 'pendingSwipes', id), profile)
          await updateDoc(doc(db, 'users', userSwiped?.id), { pendingSwipes: increment(1) })
          await updateDoc(doc(db, 'users', id), { coins: increment(-20) })
          await updateDoc(doc(db, 'admin', admin), { swipes: increment(1) })
          setShowMatch(false)
        }
      })
  }

  function distance (lat1, lon1, lat2, lon2, unit) {
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
    <>
      {
        !userInfo ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme ? color.dark : color.white }}>
            <ActivityIndicator color={theme ? color.white : color.black} size='large' />
          </View> :
          <View style={[up.container, { backgroundColor: theme ? color.dark : color.white }]} showsVerticalScrollIndicator={false}>
            <ImageBackground source={{ uri: userInfo?.photoURL }} style={up.photoURL}>
              <LinearGradient colors={['transparent', theme ? color.dark : color.lightText]} style={up.gradient} />
            </ImageBackground>

            <View style={[up.bottom, { height: up.bottom.height - 100 }]}>
              <View style={up.stats}>
                <View style={up.statsCol}>
                  <OymoFont message={userInfo?.likesCount} fontStyle={up.mainStat} fontFamily='montserrat_bold' />
                  <OymoFont message='Likes' fontStyle={up.subStat} />
                </View>
                <View style={up.statsCol}>
                  <OymoFont message={reels} fontStyle={up.mainStat} fontFamily='montserrat_bold' />
                  <OymoFont message='Posts' fontStyle={up.subStat} />
                </View>
                {
                  activeReelUser?.user?.id == id &&
                  <View style={up.statsCol}>
                    <OymoFont message={userInfo?.coins} fontStyle={up.mainStat} fontFamily='montserrat_bold' />
                    <OymoFont message='Coins' fontStyle={up.subStat} />
                  </View>
                }
              </View>

              <View style={[up.sheet, { backgroundColor: theme ? color.dark : color.white }]}>
                <View style={up.detailesView}>
                  <View style={up.left}>
                    <OymoFont message={userInfo?.username} fontFamily='montserrat_bold' fontStyle={up.username} />
                    <OymoFont message={`${userInfo?.address?.city}, ${userInfo?.address?.country}`} fontStyle={{ ...up.location, color: theme ? color.white : color.lightText }} />
                  </View>
                  <View style={up.right}>
                    {
                      activeReelUser?.user?.id == id ?
                        <>
                          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={up.editProfileButton}>
                            <FontAwesome name='edit' size={20} color={theme ? color.white : color.dark} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={[up.editProfileButton, { marginLeft: 20 }]}>
                            <Ionicons name="cog-outline" size={22} color={theme ? color.white : color.dark} />
                          </TouchableOpacity>
                        </> :
                        <TouchableOpacity onPress={swipeRight} style={{ backgroundColor: color.red, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 }}>
                          <OymoFont message='Match' fontStyle={{ color: color.white }} />
                        </TouchableOpacity>
                    }
                  </View>
                </View>

                {
                  userInfo?.about != '' &&
                  <ScrollView style={up.aboutView}>
                    <OymoFont message='About me' fontFamily='montserrat_bold' fontStyle={up.heading} />
                    <OymoFont message={userInfo?.about} fontFamily='montserrat_light' fontStyle={up.subText} />
                    {
                      userInfo?.address &&
                      <View style={up.infoListContainer}>
                        <Feather name='home' size={14} color={theme ? color.white : color.dark} />

                        <View style={up.infoList}>
                          <OymoFont message='Lives in' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                          <OymoFont message={`${userInfo?.address?.city}, ${userInfo?.address?.country}`} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                        </View>
                      </View>
                    }
                    {
                      userInfo?.relationshipStatus &&
                      <View style={up.infoListContainer}>
                        <AntDesign name="hearto" size={14} color={theme ? color.white : color.dark} />

                        <View style={up.infoList}>
                          <OymoFont message='Currently' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                          <OymoFont message={userInfo?.relationshipStatus} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                        </View>
                      </View>
                    }
                    {
                      userInfo?.children &&
                      <View style={up.infoListContainer}>
                        <MaterialIcons name="child-care" size={14} color={theme ? color.white : color.dark} />

                        <View style={up.infoList}>
                          <OymoFont message='Have children?' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                          <OymoFont message={userInfo?.children} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                        </View>
                      </View>
                    }
                    {
                      userInfo?.drinking &&
                      <View style={up.infoListContainer}>
                        <Entypo name="drink" size={14} color={theme ? color.white : color.dark} />

                        <View style={up.infoList}>
                          <OymoFont message='Do you drink?' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                          <OymoFont message={userInfo?.drinking} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                        </View>
                      </View>
                    }
                    {
                      userInfo?.smoking &&
                      <View style={up.infoListContainer}>
                        <MaterialIcons name="smoking-rooms" size={14} color={theme ? color.white : color.dark} />

                        <View style={up.infoList}>
                          <OymoFont message='Do you smoke?' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                          <OymoFont message={userInfo?.smoking} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                        </View>
                      </View>
                    }
                    {
                      userInfo?.purposeOfDating &&
                      <View style={up.infoListContainer}>
                        <MaterialCommunityIcons name="head-heart-outline" size={14} color={theme ? color.white : color.dark} />

                        <View style={up.infoList}>
                          <OymoFont message='Purpose of dating' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                          <OymoFont message={userInfo?.purposeOfDating} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                        </View>
                      </View>
                    }
                    {
                      userInfo?.eyeColor &&
                      <View style={up.infoListContainer}>
                        <MaterialCommunityIcons name="head-heart-outline" size={14} color={theme ? color.white : color.dark} />

                        <View style={up.infoList}>
                          <OymoFont message='Eye color' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                          <OymoFont message={userInfo?.eyeColor} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                        </View>
                      </View>
                    }
                    {
                      userInfo?.hairColor &&
                      <View style={up.infoListContainer}>
                        <MaterialCommunityIcons name="head-heart-outline" size={14} color={theme ? color.white : color.dark} />

                        <View style={up.infoList}>
                          <OymoFont message='Hair color' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                          <OymoFont message={userInfo?.hairColor} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                        </View>
                      </View>
                    }
                    {
                      userInfo?.height &&
                      <View style={up.infoListContainer}>
                        <MaterialCommunityIcons name="head-heart-outline" size={14} color={theme ? color.white : color.dark} />

                        <View style={up.infoList}>
                          <OymoFont message='I am' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                          <OymoFont message={`${userInfo?.height}CM`} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                          <OymoFont message='tall' fontStyle={{ ...up.title, color: theme ? color.white : color.dark, marginLeft: 5 }} />
                        </View>
                      </View>
                    }
                    {
                      userInfo?.weight &&
                      <View style={up.infoListContainer}>
                        <MaterialCommunityIcons name="head-heart-outline" size={14} color={theme ? color.white : color.dark} />

                        <View style={up.infoList}>
                          <OymoFont message='I weigh' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                          <OymoFont message={`${userInfo?.weight}KG`} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                        </View>
                      </View>
                    }
                    {
                      userInfo?.occupation &&
                      <View style={up.infoListContainer}>
                        <MaterialCommunityIcons name="head-heart-outline" size={14} color={theme ? color.white : color.dark} />

                        <View style={up.infoList}>
                          <OymoFont message={userInfo?.occupation} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                        </View>
                      </View>
                    }
                  </ScrollView>
                }
              </View>
            </View>
          </View>
      }
    </>
  )
}

export default ProfileDetails