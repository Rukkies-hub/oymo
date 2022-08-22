import React, { useState } from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome, Feather, Fontisto, SimpleLineIcons } from '@expo/vector-icons'
import color from '../../style/color'
import { useNavigation } from '@react-navigation/native'

import Bar from '../../components/Bar'
import Header from '../../components/Header'
import { BlurView } from 'expo-blur'
import OymoFont from '../../components/OymoFont'

import { profile as _profile } from '../../style/profile'

const ProfileDetails = ({ profile, user }) => {
  const navigation = useNavigation()

  const [aboutLimit, setAboutLimit] = useState(2)

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

          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={_profile.editProfileButton}>
            <FontAwesome name='edit' size={20} color={color.dark} />
          </TouchableOpacity>
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
// in use