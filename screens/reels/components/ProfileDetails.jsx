import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome, Feather, Fontisto, SimpleLineIcons, AntDesign, MaterialCommunityIcons, Entypo, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'
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
          <View style={{ flex: 1, backgroundColor: theme ? color.dark : color.white }}>
            <View style={_profile.profileDetailes}>
              {
                userInfo?.photoURL ?
                  <TouchableOpacity onPress={() => navigation.navigate('ViewAvatar', { avatar: userInfo?.photoURL })}>
                    <Image source={{ uri: userInfo?.photoURL }} style={_profile.avatar} />
                  </TouchableOpacity> :
                  <View style={[_profile.blurView, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
                    <SimpleLineIcons name='user' size={30} color={theme ? color.white : color.lightText} />
                  </View>
              }

              <View style={_profile.userInfoContainer}>
                {
                  userInfo?.username != '' &&
                  <View style={_profile.userInfo}>
                    <OymoFont message={userInfo?.username || 'Username'} fontStyle={{ ..._profile.username, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />

                    <View style={_profile.userInfoStatsContainer}>
                      <View style={_profile.userInfoStats}>
                        <OymoFont message={userInfo?.likesCount} fontFamily='montserrat_bold' fontStyle={{ marginRight: 5, color: theme ? color.white : color.dark }} />
                        <OymoFont message='Likes' fontStyle={{ color: theme ? color.white : color.dark }} />
                      </View>
                      <View style={_profile.userInfoStats}>
                        <OymoFont message={reels} fontFamily='montserrat_bold' fontStyle={{ marginRight: 5, color: theme ? color.white : color.dark }} />
                        <OymoFont message='Reels' fontStyle={{ color: theme ? color.white : color.dark }} />
                      </View>
                    </View>
                  </View>
                }
              </View>
            </View>

            {
              showMatch &&
              <View style={_profile.controlesContainer}>
                <TouchableOpacity onPress={swipeRight} style={[_profile.editProfileButton, { backgroundColor: color.red, width: '100%' }]}>
                  <OymoFont message='Match' fontStyle={{ color: color.white }} />
                </TouchableOpacity>
              </View>
            }

            <ScrollView>
              {
                (userInfo?.gallery != undefined && userInfo?.gallery.length != 0) &&
                <View style={_profile.infoListContainer}>
                  <OymoFont message='Photos' fontFamily='montserrat_bold' fontStyle={{ fontSize: 16, color: theme ? color.white : color.dark }} />
                </View>
              }

              <View style={_profile.infoListContainer}>
                {
                  (userInfo?.gallery != undefined && userInfo?.gallery.length != 0) &&
                  <View style={[_profile.gallery, { justifyContent: userInfo?.gallery.length <= 2 ? 'flex-start' : 'space-between', marginHorizontal: 0 }]}>
                    {
                      (userInfo?.gallery != undefined && userInfo?.gallery.length != 0) &&
                      <>
                        {
                          userInfo?.gallery.map((photo, i) => (
                            <TouchableOpacity key={i} onPress={() => navigation.navigate('ViewAvatar', { avatar: photo?.photoURL })} style={[_profile.imageContainer, { backgroundColor: theme ? color.lightText : color.offWhite, marginRight: userInfo?.gallery.length <= 2 ? 10 : 0 }]}>
                              <Image source={{ uri: photo?.photoURL }} style={_profile.galleryImage} />
                            </TouchableOpacity>
                          ))
                        }
                      </>
                    }
                  </View>
                }
              </View>

              <View style={_profile.infoListContainer}>
                <OymoFont message={`About ${userInfo?.username}`} fontFamily='montserrat_bold' fontStyle={{ fontSize: 16, color: theme ? color.white : color.dark }} />
              </View>

              <View style={_profile.infoListContainer}>
                <OymoFont message={userInfo?.about} fontStyle={{ color: theme ? color.white : color.dark }} />
              </View>

              <View style={_profile.infoListContainer}>
                <View style={[_profile.iconContainer, { backgroundColor: color.pink }]}>
                  <Fontisto name='date' size={14} color={color.white} />
                </View>

                <View style={_profile.infoList}>
                  <OymoFont message='Joined' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
                  <OymoFont message={userInfo?.timestamp?.toDate().toDateString()} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                </View>
              </View>

              {
                userInfo?.address &&
                <View style={_profile.infoListContainer}>
                  <View style={[_profile.iconContainer, { backgroundColor: color.blue }]}>
                    <Feather name='home' size={14} color={color.white} />
                  </View>

                  <View style={_profile.infoList}>
                    <OymoFont message='Lives in' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={`${userInfo?.address?.city}, ${userInfo?.address?.country}`} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }

              {
                userInfo?.relationshipStatus &&
                <View style={_profile.infoListContainer}>
                  <View style={[_profile.iconContainer, { backgroundColor: color.goldDark }]}>
                    <AntDesign name="hearto" size={14} color={color.white} />
                  </View>

                  <View style={_profile.infoList}>
                    <OymoFont message='Currently' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={userInfo?.relationshipStatus} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }

              {
                userInfo?.children &&
                <View style={_profile.infoListContainer}>
                  <View style={[_profile.iconContainer, { backgroundColor: color.lightBlue }]}>
                    <MaterialIcons name="child-care" size={14} color={color.white} />
                  </View>

                  <View style={_profile.infoList}>
                    <OymoFont message='Have children?' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={userInfo?.children} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }

              {
                userInfo?.drinking &&
                <View style={_profile.infoListContainer}>
                  <View style={[_profile.iconContainer, { backgroundColor: color.lightGreen }]}>
                    <Entypo name="drink" size={14} color={color.white} />
                  </View>

                  <View style={_profile.infoList}>
                    <OymoFont message='Do you drink?' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={userInfo?.drinking} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }

              {
                userInfo?.smoking &&
                <View style={_profile.infoListContainer}>
                  <View style={[_profile.iconContainer, { backgroundColor: color.purple }]}>
                    <MaterialIcons name="smoking-rooms" size={14} color={color.white} />
                  </View>

                  <View style={_profile.infoList}>
                    <OymoFont message='Do you smoke?' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={userInfo?.smoking} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }

              {
                userInfo?.purposeOfDating &&
                <View style={_profile.infoListContainer}>
                  <View style={[_profile.iconContainer, { backgroundColor: color.lightPurple }]}>
                    <MaterialCommunityIcons name="head-heart-outline" size={14} color={color.white} />
                  </View>

                  <View style={_profile.infoList}>
                    <OymoFont message='Purpose of dating' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={userInfo?.purposeOfDating} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }

              {
                userInfo?.eyeColor &&
                <View style={_profile.infoListContainer}>
                  <View style={[_profile.iconContainer, { backgroundColor: color.red }]}>
                    <Feather name="eye" size={14} color={color.white} />
                  </View>

                  <View style={_profile.infoList}>
                    <OymoFont message='Eye color' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={userInfo?.eyeColor} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }

              {
                userInfo?.hairColor &&
                <View style={_profile.infoListContainer}>
                  <View style={[_profile.iconContainer, { backgroundColor: color.lightText }]}>
                    <FontAwesome name="user-o" size={14} color={color.white} />
                  </View>

                  <View style={_profile.infoList}>
                    <OymoFont message='Hair color' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={userInfo?.hairColor} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }

              {
                userInfo?.height &&
                <View style={_profile.infoListContainer}>
                  <View style={[_profile.iconContainer, { backgroundColor: color.green }]}>
                    <MaterialCommunityIcons name="human-male-height-variant" size={14} color={color.white} />
                  </View>

                  <View style={_profile.infoList}>
                    <OymoFont message='I am' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={`${userInfo?.height}CM`} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                    <OymoFont message='tall' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark, marginLeft: 5 }} />
                  </View>
                </View>
              }

              {
                userInfo?.weight &&
                <View style={_profile.infoListContainer}>
                  <View style={[_profile.iconContainer, { backgroundColor: color.deepBlueSea }]}>
                    <FontAwesome5 name="cloudscale" size={14} color={color.white} />
                  </View>

                  <View style={_profile.infoList}>
                    <OymoFont message='I weigh' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={`${userInfo?.weight}KG`} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }

              {
                userInfo?.occupation &&
                <View style={[_profile.infoListContainer, { paddingBottom: 20 }]}>
                  <View style={[_profile.iconContainer, { backgroundColor: color.lightRed }]}>
                    <Feather name="briefcase" size={14} color={color.white} />
                  </View>

                  <View style={_profile.infoList}>
                    <OymoFont message={userInfo?.occupation} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
            </ScrollView>
          </View>
      }
    </>
  )
}

export default ProfileDetails