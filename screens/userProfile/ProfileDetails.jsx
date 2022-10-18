import React, { useLayoutEffect, useState } from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome, Feather, Fontisto, SimpleLineIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import color from '../../style/color'
import { useNavigation } from '@react-navigation/native'

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

const ProfileDetails = ({ profile, user }) => {
  const navigation = useNavigation()
  const { profiles } = useSelector(state => state.match)
  const { user: _user, profile: __profile, theme } = useSelector(state => state.user)

  const dispatch = useDispatch()

  const [aboutLimit, setAboutLimit] = useState(2)

  const [showMatch, setShowMatch] = useState(false)

  let id = _user?.uid == undefined ? _user?.user?.uid : _user?.uid

  useLayoutEffect(() => {
    const needle = user?.id
    const cardIndex = profiles?.findIndex(item => item.id === needle)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    if (userSwiped) setShowMatch(true)
  }, [user])

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
          .filter(doc => distance(doc?.data()?.coords?.latitude, doc?.data()?.coords?.longitude, profile?.coords?.latitude, profile?.coords?.longitude).toFixed(2) <= 1)
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
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
  }

  return (
    <View>
      <View style={_profile.profileDetailes}>
        {
          profile?.photoURL ?
            <TouchableOpacity onPress={() => navigation.navigate('ViewAvatar', { avatar: profile?.photoURL })}>
              <Image source={{ uri: profile?.photoURL }} style={_profile.avatar} />
            </TouchableOpacity> :
            <BlurView intensity={50} tint='light' style={[_profile.blurView, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
              <SimpleLineIcons name='user' size={30} color={theme ? color.white : color.lightText} />
            </BlurView>
        }

        <View style={_profile.userInfoContainer}>
          {
            profile?.username != '' &&
            <View style={_profile.userInfo}>
              <OymoFont message={profile?.username} fontStyle={{ ..._profile.username, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
            </View>
          }
        </View>
        {
          showMatch &&
          <TouchableOpacity onPress={swipeRight} style={_profile.matchButton}>
            <AntDesign name='hearto' size={20} color={color.white} />
          </TouchableOpacity>
        }
      </View>

      {
        profile?.about != '' &&
        <View style={_profile.aboutContainer}>
          <Text
            numberOfLines={aboutLimit}
            style={{
              fontFamily: 'text',
              fontSize: 14,
              color: theme ? color.white : color.dark
            }}
          >
            {profile?.about}
          </Text>
          {
            profile?.about?.length >= 100 &&
            <>
              {
                aboutLimit == 2 &&
                <TouchableOpacity onPress={() => setAboutLimit(100)}>
                  <OymoFont message='Read more' fontStyle={{ ..._profile.about, color: theme ? color.white : color.dark }} fontFamily='montserrat_medium' />
                </TouchableOpacity>
              }
              {
                aboutLimit > 2 &&
                <TouchableOpacity onPress={() => setAboutLimit(2)}>
                  <OymoFont message='Show less' fontStyle={{ ..._profile.about, color: theme ? color.white : color.dark }} fontFamily='montserrat_medium' />
                </TouchableOpacity>
              }
            </>
          }
        </View>
      }

      {
        profile?.passions && profile?.passions?.length > 1 &&
        <View style={_profile.passionsContainer}>
          {
            profile?.passions?.map((passion, index) =>
              <View key={index} style={[_profile.passions, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
                <OymoFont message={passion} fontStyle={{ ..._profile.passion, color: theme ? color.white : color.dark }} />
              </View>
            )
          }
        </View>
      }

      {
        _profile?.address != undefined &&
        <View style={_profile.infoListContainer}>
          <Feather name='home' size={14} color={theme ? color.white : color.dark} />

          <View style={_profile.infoList}>
            <OymoFont message='Lives in' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
            <OymoFont message={`${_profile?.address?.city}, ${_profile?.address?.country}`} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
          </View>
        </View>
      }

      <View style={_profile.infoListContainer}>
        <Fontisto name='date' size={14} color={theme ? color.white : color.dark} />

        <View style={_profile.infoList}>
          <OymoFont message='Joined' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
          <OymoFont message={profile?.timestamp?.toDate().toDateString()} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
        </View>
      </View>

      {
        (profile?.coords != undefined && __profile?.coords) &&
        <View style={[_profile.infoListContainer, { marginBottom: 20 }]}>
          <MaterialCommunityIcons name="map-marker-radius-outline" size={17} color={theme ? color.white : color.dark} />
          <OymoFont
            message={`${distance(profile?.coords?.latitude, profile?.coords?.longitude, __profile?.coords?.latitude, __profile?.coords?.longitude).toFixed(2)} kilometers away`}
            fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }}
          />
        </View>
      }
    </View>
  )
}

export default ProfileDetails