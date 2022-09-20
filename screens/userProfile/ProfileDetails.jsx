import React, { useLayoutEffect, useState } from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome, Feather, Fontisto, SimpleLineIcons, AntDesign } from '@expo/vector-icons'
import color from '../../style/color'
import { useNavigation } from '@react-navigation/native'

import Bar from '../../components/Bar'
import Header from '../../components/Header'
import { BlurView } from 'expo-blur'
import OymoFont from '../../components/OymoFont'

import { profile as _profile } from '../../style/profile'
import { useSelector } from 'react-redux'
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import generateId from '../../lib/generateId'

const ProfileDetails = ({ profile, user }) => {
  const navigation = useNavigation()
  const { profiles } = useSelector(state => state.match)
  const { user: _user, profile: __profile } = useSelector(state => state.user)

  const [aboutLimit, setAboutLimit] = useState(2)

  const [showMatch, setShowMatch] = useState(false)

  useLayoutEffect(() => {
    const needle = user?.id
    const cardIndex = profiles?.findIndex(item => item.id === needle)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    if (userSwiped) setShowMatch(true)
  }, [user])

  // MATCH WITH USER
  // const swipeRight = async () => {
  //   const needle = user?.id
  //   const cardIndex = profiles?.findIndex(item => item.id === needle)

  //   if (!profiles[cardIndex]) return

  //   const userSwiped = profiles[cardIndex]


  //   getDoc(doc(db, 'users', _user?.uid, 'swipes', userSwiped?.id))
  //     .then(documentSnapshot => {
  //       if (documentSnapshot.exists()) {
  //         setDoc(doc(db, 'users', _user?.uid, 'swipes', userSwiped?.id), userSwiped)

  //         // CREAT A MATCH
  //         setDoc(doc(db, 'matches', generateId(_user?.uid, userSwiped?.id)), {
  //           users: {
  //             [_user?.uid]: __profile,
  //             [userSwiped?.id]: userSwiped
  //           },
  //           usersMatched: [_user?.uid, userSwiped?.id],
  //           timestamp: serverTimestamp()
  //         }).finally(async () => await deleteDoc(doc(db, 'users', _user?.uid, 'pendingSwipes', userSwiped?.id)))

  //         navigation.navigate('NewMatch', {
  //           loggedInProfile: __profile,
  //           userSwiped
  //         })
  //       } else {
  //         setDoc(doc(db, 'users', _user?.uid, 'swipes', userSwiped.id), userSwiped)
  //         setShowMatch(false)
  //       }
  //     })

  //   setDoc(doc(db, 'users', userSwiped.id, 'pendingSwipes', user?.id), __profile)
  //   setDoc(doc(db, 'users', user?.id, 'swipes', userSwiped.id), userSwiped)
  // }
  const swipeRight = async () => {
    const needle = user?.id
    const cardIndex = profiles?.findIndex(item => item.id === needle)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]


    getDoc(doc(db, 'users', userSwiped?.id, 'swipes', _user?.uid))
      .then(documentSnapshot => {
        if (documentSnapshot?.exists()) {
          setDoc(doc(db, 'users', _user?.uid, 'swipes', userSwiped?.id), userSwiped)

          // CREAT A MATCH
          setDoc(doc(db, 'matches', generateId(_user?.uid, userSwiped?.id)), {
            users: {
              [_user?.uid]: profile,
              [userSwiped?.id]: userSwiped
            },
            usersMatched: [_user?.uid, userSwiped?.id],
            timestamp: serverTimestamp()
          }).then(async () => await deleteDoc(doc(db, 'users', _user?.uid, 'pendingSwipes', userSwiped?.id)))

          navigation.navigate('NewMatch', {
            loggedInProfile: __profile,
            userSwiped
          })
        } else {
          setDoc(doc(db, 'users', _user?.uid, 'swipes', userSwiped?.id), userSwiped)
          setDoc(doc(db, 'users', userSwiped?.id, 'pendingSwipes', _user?.uid), __profile)
        }
      })
  }

  return (
    <ImageBackground
      source={!profile?.photoURL ? require('../../assets/background2.jpg') : { uri: profile?.photoURL }}
      blurRadius={50}
    >
      <LinearGradient colors={[color.transparent, color.white]}>
        <Bar color={'dark'} />

        <Header
          showBack
          showTitle
          showNotification
          title={profile?.username}
          backgroundColor={color.transparent}
          showAratar={profile?.photoURL ? true : false}
        />

        <View style={_profile.profileDetailes}>
          {
            profile?.photoURL ?
              <TouchableOpacity onPress={() => navigation.navigate('ViewAvatar', { avatar: profile?.photoURL })}>
                <Image source={{ uri: profile?.photoURL }} style={_profile.avatar} />
              </TouchableOpacity> :
              <BlurView intensity={50} tint='light' style={_profile.blurView}>
                <SimpleLineIcons name='user' size={30} color={color.lightText} />
              </BlurView>
          }

          <View style={_profile.userInfoContainer}>
            {
              profile?.username != '' &&
              <View style={_profile.userInfo}>
                <OymoFont message={profile?.username} fontStyle={_profile.username} fontFamily='montserrat_bold' />
              </View>
            }

            {
              profile?.displayName != '' &&
              <OymoFont message={profile?.displayName} fontStyle={_profile.displayName} fontFamily='montserrat_medium' />
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
                fontSize: 16,
                color: color.dark
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
                    <OymoFont message='Read more' fontStyle={_profile.about} fontFamily='montserrat_medium' />
                  </TouchableOpacity>
                }
                {
                  aboutLimit > 2 &&
                  <TouchableOpacity onPress={() => setAboutLimit(2)}>
                    <OymoFont message='Show less' fontStyle={_profile.about} fontFamily='montserrat_medium' />
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
                <View key={index} style={_profile.passions}>
                  <OymoFont message={passion} fontStyle={_profile.passion} />
                </View>
              )
            }
          </View>
        }

        <View style={_profile.infoListContainer}>
          <Feather name='home' size={14} color={color.dark} />

          <View style={_profile.infoList}>
            <OymoFont message='Lives in' fontStyle={_profile.title} />
            <OymoFont message={profile?.city} fontStyle={_profile.info} fontFamily='montserrat_bold' />
          </View>
        </View>

        <View style={_profile.infoListContainer}>
          <Fontisto name='date' size={14} color={color.dark} />

          <View style={_profile.infoList}>
            <OymoFont message='Joined' fontStyle={_profile.title} />
            <OymoFont message={profile?.timestamp?.toDate().toDateString()} fontStyle={_profile.info} fontFamily='montserrat_bold' />
          </View>
        </View>

        {
          profile?.job != '' &&
          <View style={[_profile.infoListContainer, { marginBottom: 20 }]}>
            <Feather name='briefcase' size={14} color={color.dark} />

            <Text style={[_profile.info, { fontFamily: 'text' }]}>
              {profile?.job} {profile?.company != '' && 'at'} {profile?.company}
            </Text>
          </View>
        }
      </LinearGradient>
    </ImageBackground>
  )
}

export default ProfileDetails