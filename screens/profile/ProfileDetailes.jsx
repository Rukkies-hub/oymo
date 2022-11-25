import React, { useLayoutEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native'

import { FontAwesome, Feather, Fontisto, SimpleLineIcons, Ionicons, AntDesign, Entypo, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'
import color from '../../style/color'
import { useNavigation, useRoute } from '@react-navigation/native'
import OymoFont from '../../components/OymoFont'

import { useSelector } from 'react-redux'
import { LinearGradient } from 'expo-linear-gradient'
import { up } from '../../style/userProfile'
import { useEffect } from 'react'
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

const ProfileDetails = () => {
  const navigation = useNavigation()
  const { profile, user } = useRoute().params
  const { theme } = useSelector(state => state.user)

  const [reels, setReels] = useState(0)

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  useEffect(() => {
    const call = () => {
      onSnapshot(query(collection(db, 'reels'),
        where('user.id', '==', id)),
        snapshot => {
          setReels(snapshot?.docs?.length)
        }
      )
    }
    call()
  }, [db])

  return (
    <View style={[up.container, { backgroundColor: theme ? color.dark : color.white }]}>
      <TouchableOpacity style={up.goBack} onPress={() => navigation.goBack()}>
        <Entypo name='chevron-left' size={24} color={color.white} />
      </TouchableOpacity>
      <ImageBackground source={{ uri: profile?.photoURL }} style={up.photoURL}>
        <LinearGradient colors={['transparent', theme ? color.dark : color.lightText]} style={up.gradient} />
      </ImageBackground>

      <View style={up.bottom}>
        <View style={up.stats}>
          <View style={up.statsCol}>
            <OymoFont message={profile?.likesCount} fontStyle={up.mainStat} fontFamily='montserrat_bold' />
            <OymoFont message='Likes' fontStyle={up.subStat} />
          </View>
          <View style={up.statsCol}>
            <OymoFont message={reels} fontStyle={up.mainStat} fontFamily='montserrat_bold' />
            <OymoFont message='Posts' fontStyle={up.subStat} />
          </View>
          <View style={up.statsCol}>
            <OymoFont message={profile?.coins} fontStyle={up.mainStat} fontFamily='montserrat_bold' />
            <OymoFont message='Coins' fontStyle={up.subStat} />
          </View>
        </View>

        <View style={[up.sheet, { backgroundColor: theme ? color.dark : color.white }]}>
          <View style={up.detailesView}>
            <View style={up.left}>
              <OymoFont message={profile?.username} fontFamily='montserrat_bold' fontStyle={up.username} />
              <OymoFont message={`${profile?.address?.city}, ${profile?.address?.country}`} fontStyle={{ ...up.location, color: theme ? color.white : color.lightText }} />
            </View>
            <View style={up.right}>
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={up.editProfileButton}>
                <FontAwesome name='edit' size={20} color={theme ? color.white : color.dark} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={[up.editProfileButton, { marginLeft: 20 }]}>
                <Ionicons name="cog-outline" size={22} color={theme ? color.white : color.dark} />
              </TouchableOpacity>
            </View>
          </View>

          {
            profile?.about != '' &&
            <ScrollView style={up.aboutView} showsVerticalScrollIndicator={false}>
              <OymoFont message='About me' fontFamily='montserrat_bold' fontStyle={up.heading} />
              <OymoFont message={profile?.about} fontFamily='montserrat_light' fontStyle={up.subText} />
              {
                profile?.address &&
                <View style={up.infoListContainer}>
                  <Feather name='home' size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Lives in' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={`${profile?.address?.city}, ${profile?.address?.country}`} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                profile?.relationshipStatus &&
                <View style={up.infoListContainer}>
                  <AntDesign name="hearto" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Currently' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={profile?.relationshipStatus} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                profile?.children &&
                <View style={up.infoListContainer}>
                  <MaterialIcons name="child-care" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Have children?' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={profile?.children} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                profile?.drinking &&
                <View style={up.infoListContainer}>
                  <Entypo name="drink" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Do you drink?' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={profile?.drinking} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                profile?.smoking &&
                <View style={up.infoListContainer}>
                  <MaterialIcons name="smoking-rooms" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Do you smoke?' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={profile?.smoking} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                profile?.purposeOfDating &&
                <View style={up.infoListContainer}>
                  <MaterialCommunityIcons name="head-heart-outline" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Purpose of dating' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={profile?.purposeOfDating} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                profile?.eyeColor &&
                <View style={up.infoListContainer}>
                  <Feather name="eye" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Eye color' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={profile?.eyeColor} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                profile?.hairColor &&
                <View style={up.infoListContainer}>
                  <FontAwesome name="user-o" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='Hair color' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={profile?.hairColor} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                profile?.height &&
                <View style={up.infoListContainer}>
                  <MaterialCommunityIcons name="human-male-height-variant" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='I am' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={`${profile?.height}CM`} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                    <OymoFont message='tall' fontStyle={{ ...up.title, color: theme ? color.white : color.dark, marginLeft: 5 }} />
                  </View>
                </View>
              }
              {
                profile?.weight &&
                <View style={up.infoListContainer}>
                  <FontAwesome5 name="cloudscale" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message='I weigh' fontStyle={{ ...up.title, color: theme ? color.white : color.dark }} />
                    <OymoFont message={`${profile?.weight}KG`} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                  </View>
                </View>
              }
              {
                profile?.occupation &&
                <View style={[up.infoListContainer, { paddingBottom: 20 }]}>
                  <Feather name="briefcase" size={14} color={theme ? color.white : color.dark} />

                  <View style={up.infoList}>
                    <OymoFont message={profile?.occupation} fontStyle={{ ...up.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
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
// in use