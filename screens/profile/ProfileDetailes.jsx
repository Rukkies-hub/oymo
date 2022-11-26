import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'

import { FontAwesome, Feather, Fontisto, SimpleLineIcons, Ionicons, AntDesign, MaterialIcons, Entypo, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'
import color from '../../style/color'
import { useNavigation, useRoute } from '@react-navigation/native'
import OymoFont from '../../components/OymoFont'
import Header from '../../components/Header'

import { profile as _profile } from '../../style/profile'
import { useSelector } from 'react-redux'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

const ProfileDetails = () => {
  const navigation = useNavigation()
  const { profile, user } = useRoute().params

  const [aboutLimit, setAboutLimit] = useState(2)
  const [reels, setReels] = useState(0)

  const { theme } = useSelector(state => state.user)

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
    <View style={{ flex: 1, backgroundColor: theme ? color.dark : color.white }}>
      <Header showBack showLogo showNotification showAratar />
      <View style={_profile.profileDetailes}>
        {
          profile?.photoURL ?
            <TouchableOpacity onPress={() => navigation.navigate('ViewAvatar', { avatar: profile?.photoURL })}>
              <Image source={{ uri: profile?.photoURL }} style={_profile.avatar} />
            </TouchableOpacity> :
            <View style={[_profile.blurView, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
              <SimpleLineIcons name='user' size={30} color={theme ? color.white : color.lightText} />
            </View>
        }

        <View style={_profile.userInfoContainer}>
          {
            profile?.username != '' &&
            <View style={_profile.userInfo}>
              <OymoFont message={profile?.username || 'Username'} fontStyle={{ ..._profile.username, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />

              <View style={_profile.userInfoStatsContainer}>
                <View style={_profile.userInfoStats}>
                  <OymoFont message={profile?.likesCount} fontFamily='montserrat_bold' fontStyle={{ marginRight: 5, color: theme ? color.white : color.dark }} />
                  <OymoFont message='Likes' fontStyle={{ color: theme ? color.white : color.dark }} />
                </View>
                <View style={_profile.userInfoStats}>
                  <OymoFont message={reels} fontFamily='montserrat_bold' fontStyle={{ marginRight: 5, color: theme ? color.white : color.dark }} />
                  <OymoFont message='Reels' fontStyle={{ color: theme ? color.white : color.dark }} />
                </View>
                <View style={_profile.userInfoStats}>
                  <OymoFont message={profile?.coins} fontFamily='montserrat_bold' fontStyle={{ marginRight: 5, color: theme ? color.white : color.dark }} />
                  <OymoFont message='Coins' fontStyle={{ color: theme ? color.white : color.dark }} />
                </View>
              </View>
            </View>
          }
        </View>
      </View>

      <View style={_profile.controlesContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={[_profile.editProfileButton, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
          <FontAwesome name='edit' size={20} color={theme ? color.white : color.dark} />
          <OymoFont message='Edit profile' fontStyle={{ color: theme ? color.white : color.dark, marginLeft: 10 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={[_profile.editProfileButton, { marginLeft: 10, backgroundColor: theme ? color.lightText : color.offWhite }]}>
          <Ionicons name="cog-outline" size={22} color={theme ? color.white : color.dark} />
          <OymoFont message='Settings' fontStyle={{ color: theme ? color.white : color.dark, marginLeft: 10 }} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={_profile.infoListContainer}>
          <OymoFont message='About me' fontFamily='montserrat_bold' fontStyle={{ fontSize: 16, color: theme ? color.white : color.dark }} />
        </View>

        <View style={_profile.infoListContainer}>
          <OymoFont message={profile?.about} fontStyle={{ color: theme ? color.white : color.dark }} />
        </View>

        <View style={_profile.infoListContainer}>
          <View style={[_profile.iconContainer, { backgroundColor: color.pink }]}>
            <Fontisto name='date' size={14} color={color.white} />
          </View>

          <View style={_profile.infoList}>
            <OymoFont message='Joined' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
            <OymoFont message={profile?.timestamp?.toDate().toDateString()} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
          </View>
        </View>

        {
          profile?.address &&
          <View style={_profile.infoListContainer}>
            <View style={[_profile.iconContainer, { backgroundColor: color.blue }]}>
              <Feather name='home' size={14} color={color.white} />
            </View>

            <View style={_profile.infoList}>
              <OymoFont message='Lives in' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
              <OymoFont message={`${profile?.address?.city}, ${profile?.address?.country}`} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
            </View>
          </View>
        }

        {
          profile?.relationshipStatus &&
          <View style={_profile.infoListContainer}>
            <View style={[_profile.iconContainer, { backgroundColor: color.goldDark }]}>
              <AntDesign name="hearto" size={14} color={color.white} />
            </View>

            <View style={_profile.infoList}>
              <OymoFont message='Currently' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
              <OymoFont message={profile?.relationshipStatus} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
            </View>
          </View>
        }

        {
          profile?.children &&
          <View style={_profile.infoListContainer}>
            <View style={[_profile.iconContainer, { backgroundColor: color.lightBlue }]}>
              <MaterialIcons name="child-care" size={14} color={color.white} />
            </View>

            <View style={_profile.infoList}>
              <OymoFont message='Have children?' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
              <OymoFont message={profile?.children} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
            </View>
          </View>
        }

        {
          profile?.drinking &&
          <View style={_profile.infoListContainer}>
            <View style={[_profile.iconContainer, { backgroundColor: color.lightGreen }]}>
              <Entypo name="drink" size={14} color={color.white} />
            </View>

            <View style={_profile.infoList}>
              <OymoFont message='Do you drink?' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
              <OymoFont message={profile?.drinking} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
            </View>
          </View>
        }

        {
          profile?.smoking &&
          <View style={_profile.infoListContainer}>
            <View style={[_profile.iconContainer, { backgroundColor: color.purple }]}>
              <MaterialIcons name="smoking-rooms" size={14} color={color.white} />
            </View>

            <View style={_profile.infoList}>
              <OymoFont message='Do you smoke?' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
              <OymoFont message={profile?.smoking} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
            </View>
          </View>
        }

        {
          profile?.purposeOfDating &&
          <View style={_profile.infoListContainer}>
            <View style={[_profile.iconContainer, { backgroundColor: color.lightPurple }]}>
              <MaterialCommunityIcons name="head-heart-outline" size={14} color={color.white} />
            </View>

            <View style={_profile.infoList}>
              <OymoFont message='Purpose of dating' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
              <OymoFont message={profile?.purposeOfDating} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
            </View>
          </View>
        }

        {
          profile?.eyeColor &&
          <View style={_profile.infoListContainer}>
            <View style={[_profile.iconContainer, { backgroundColor: color.red }]}>
              <Feather name="eye" size={14} color={color.white} />
            </View>

            <View style={_profile.infoList}>
              <OymoFont message='Eye color' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
              <OymoFont message={profile?.eyeColor} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
            </View>
          </View>
        }

        {
          profile?.hairColor &&
          <View style={_profile.infoListContainer}>
            <View style={[_profile.iconContainer, { backgroundColor: color.lightText }]}>
              <FontAwesome name="user-o" size={14} color={color.white} />
            </View>

            <View style={_profile.infoList}>
              <OymoFont message='Hair color' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
              <OymoFont message={profile?.hairColor} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
            </View>
          </View>
        }

        {
          profile?.height &&
          <View style={_profile.infoListContainer}>
            <View style={[_profile.iconContainer, { backgroundColor: color.green }]}>
              <MaterialCommunityIcons name="human-male-height-variant" size={14} color={color.white} />
            </View>

            <View style={_profile.infoList}>
              <OymoFont message='I am' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
              <OymoFont message={`${profile?.height}CM`} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
              <OymoFont message='tall' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark, marginLeft: 5 }} />
            </View>
          </View>
        }

        {
          profile?.weight &&
          <View style={_profile.infoListContainer}>
            <View style={[_profile.iconContainer, { backgroundColor: color.deepBlueSea }]}>
              <FontAwesome5 name="cloudscale" size={14} color={color.white} />
            </View>

            <View style={_profile.infoList}>
              <OymoFont message='I weigh' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
              <OymoFont message={`${profile?.weight}KG`} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
            </View>
          </View>
        }

        {
          profile?.occupation &&
          <View style={[_profile.infoListContainer, { paddingBottom: 20 }]}>
            <View style={[_profile.iconContainer, { backgroundColor: color.lightRed }]}>
              <Feather name="briefcase" size={14} color={color.white} />
            </View>

            <View style={_profile.infoList}>
              <OymoFont message={profile?.occupation} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
            </View>
          </View>
        }
      </ScrollView>
    </View>
  )
}

export default ProfileDetails
// in use