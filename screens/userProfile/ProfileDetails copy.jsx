import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity, ScrollView } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome, Feather, Fontisto, SimpleLineIcons, AntDesign, MaterialCommunityIcons, Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons'
import color from '../../style/color'
import { useNavigation, useRoute } from '@react-navigation/native'

import Bar from '../../components/Bar'
import Header from '../../components/Header'
import { BlurView } from 'expo-blur'
import OymoFont from '../../components/OymoFont'

import { profile as _profile } from '../../style/profile'
import { useDispatch, useSelector } from 'react-redux'
import { collection, deleteDoc, doc, getDoc, getDocs, increment, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import generateId from '../../lib/generateId'
import { setPendingSwipes, setProfiles } from '../../features/matchSlice'

import { admin } from '@env'
import { up } from '../../style/userProfile'

const ProfileDetails = () => {
  const navigation = useNavigation()
  const { nearby, passed, user } = useRoute().params
  const { profiles, nearbyProfiles } = useSelector(state => state.match)
  const { user: _user, profile: __profile, theme } = useSelector(state => state.user)

  const dispatch = useDispatch()

  const [aboutLimit, setAboutLimit] = useState(2)

  const [showMatch, setShowMatch] = useState(false)

  let id = _user?.uid == undefined ? _user?.user?.uid : _user?.uid

  const [reels, setReels] = useState(0)

  useEffect(() => {
    const call = () => {
      onSnapshot(query(collection(db, 'reels'),
        where('user.id', '==', user?.id)),
        snapshot => {
          setReels(snapshot?.docs?.length)
        }
      )
    }
    call()
  }, [db])

  useLayoutEffect(() => {
    const callProfiles = () => {
      const needle = user?.id
      const cardIndex = profiles?.findIndex(item => item.id === needle)

      if (!profiles[cardIndex]) return

      const userSwiped = profiles[cardIndex]

      if (userSwiped) setShowMatch(true)
    }

    const callNearbyProfiles = () => {
      const needle = user?.id
      const cardIndex = nearbyProfiles?.findIndex(item => item.id === needle)

      if (!nearbyProfiles[cardIndex]) return

      const userSwiped = nearbyProfiles[cardIndex]

      if (userSwiped) setShowMatch(true)
    }

    if (nearby) callNearbyProfiles()
    else callProfiles()
  }, [user])

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
    const needle = user?.id
    const cardIndex = profiles?.findIndex(item => item.id === needle)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    if (__profile?.coins < 20) return

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
            loggedInProfile: __profile,
            userSwiped
          })
          getAllProfiles()
          getPendingSwipes()
        } else {
          setDoc(doc(db, 'users', id, 'swipes', userSwiped?.id), userSwiped)
          setDoc(doc(db, 'users', userSwiped?.id, 'pendingSwipes', id), __profile)
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
    <View style={[up.container, { backgroundColor: theme ? color.dark : color.white }]} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={up.goBack} onPress={() => navigation.goBack()}>
        <Entypo name='chevron-left' size={24} color={color.white} />
      </TouchableOpacity>
      <ImageBackground source={{ uri: user?.photoURL }} style={up.photoURL}>
        <LinearGradient colors={['transparent', theme ? color.dark : color.lightText]} style={{ ...up.gradient }} />
      </ImageBackground>

      <View style={up.bottom}>
        <View style={up.stats}>
          <View style={up.statsCol}>
            <OymoFont message={user?.likesCount} fontStyle={up.mainStat} fontFamily='montserrat_bold' />
            <OymoFont message='Likes' fontStyle={up.subStat} />
          </View>
          <View style={up.statsCol}>
            <OymoFont message={reels} fontStyle={up.mainStat} fontFamily='montserrat_bold' />
            <OymoFont message='Posts' fontStyle={up.subStat} />
          </View>
        </View>


        <View style={[up.sheet, { backgroundColor: theme ? color.dark : color.white }]}>
          <View style={up.detailesView}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => navigation.navigate('ViewAvatar', { avatar: user?.photoURL })} style={{ width: 50, height: 50, borderRadius: 50, overflow: 'hidden', marginRight: 10 }}>
                <Image source={{ uri: user?.photoURL }} style={{ width: '100%', height: '100%' }} />
              </TouchableOpacity>
              <View>
                <OymoFont message={user?.username} fontFamily='montserrat_bold' fontStyle={up.username} />
                <OymoFont message={`${user?.address?.city}, ${user?.address?.country}`} fontStyle={{ ...up.location, color: theme ? color.white : color.lightText }} />
              </View>
            </View>
            <View style={up.right}>
              <TouchableOpacity onPress={swipeRight} style={{ backgroundColor: color.red, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 }}>
                <OymoFont message='Match' fontStyle={{ color: color.white }} />
              </TouchableOpacity>
            </View>
          </View>

          {
            user?.about != '' &&
            <ScrollView style={up.aboutView} showsVerticalScrollIndicator={false}>
              <OymoFont message='About me' fontFamily='montserrat_bold' fontStyle={up.heading} />
              <OymoFont message={user?.about} fontFamily='montserrat_light' fontStyle={up.subText} />
              {
                user?.address &&
                <View style={up.infoListContainer}>
                  <Feather name='home' size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Lives in' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={`${user?.address?.city}, ${user?.address?.country}`} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                user?.relationshipStatus &&
                <View style={up.infoListContainer}>
                  <AntDesign name="hearto" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Currently' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={user?.relationshipStatus} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                user?.children &&
                <View style={up.infoListContainer}>
                  <MaterialIcons name="child-care" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Have children?' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={user?.children} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                user?.drinking &&
                <View style={up.infoListContainer}>
                  <Entypo name="drink" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Do you drink?' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={user?.drinking} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                user?.smoking &&
                <View style={up.infoListContainer}>
                  <MaterialIcons name="smoking-rooms" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Do you smoke?' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={user?.smoking} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                user?.purposeOfDating &&
                <View style={up.infoListContainer}>
                  <MaterialCommunityIcons name="head-heart-outline" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Purpose of dating' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={user?.purposeOfDating} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                user?.eyeColor &&
                <View style={up.infoListContainer}>
                  <Feather name="eye" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Eye color' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={user?.eyeColor} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                user?.hairColor &&
                <View style={up.infoListContainer}>
                  <FontAwesome name="user-o" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Hair color' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={user?.hairColor} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                user?.height &&
                <View style={up.infoListContainer}>
                  <MaterialCommunityIcons name="human-male-height-variant" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='I am' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={`${user?.height}CM`} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                    <OymoFont message='tall' fontStyle={{ ...up.title, color: theme ? color.white : color.dark, marginLeft: 5 }} />
                  </View>
                </View>
              }
              {
                user?.weight &&
                <View style={up.infoListContainer}>
                  <FontAwesome5 name="cloudscale" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='I weigh' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={`${user?.weight}KG`} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                user?.occupation &&
                <View style={up.infoListContainer}>
                  <Feather name="briefcase" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message={user?.occupation} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
            </ScrollView>
          }

        </View>
      </View>
    </View>
  )
}

export default ProfileDetails