import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'

import { FontAwesome, Feather, Fontisto, SimpleLineIcons, Ionicons } from '@expo/vector-icons'
import color from '../../style/color'
import { useNavigation } from '@react-navigation/native'
import OymoFont from '../../components/OymoFont'

import { profile as _profile } from '../../style/profile'
import { useSelector } from 'react-redux'

const ProfileDetails = ({ profile, user }) => {
  const navigation = useNavigation()

  const [aboutLimit, setAboutLimit] = useState(2)

  const { theme } = useSelector(state => state.user)

  return (
    <View>
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
            </View>
          }
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={_profile.editProfileButton}>
          <FontAwesome name='edit' size={20} color={theme ? color.white : color.dark} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={[_profile.editProfileButton, { marginLeft: 10 }]}>
          <Ionicons name="cog-outline" size={22} color={theme ? color.white : color.dark} />
        </TouchableOpacity>
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
        profile?.address &&
        <View style={_profile.infoListContainer}>
          <Feather name='home' size={14} color={theme ? color.white : color.dark} />

          <View style={_profile.infoList}>
            <OymoFont message='Lives in' fontStyle={{ ..._profile.title, color: theme ? color.white : color.dark }} />
            <OymoFont message={`${profile?.address?.city}, ${profile?.address?.country}`} fontStyle={{ ..._profile.info, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
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
    </View>
  )
}

export default ProfileDetails
// in use