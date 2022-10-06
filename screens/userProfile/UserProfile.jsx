import React, { useLayoutEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import color from '../../style/color'
import { profile } from '../../style/profile'

import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'

import * as NavigationBar from 'expo-navigation-bar'
import { useSelector } from 'react-redux'
import { useFonts } from 'expo-font'

import ProfileDetails from './ProfileDetails'
import Reels from './Reels'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import Bar from '../../components/Bar'
import Header from '../../components/Header'

const UserProfile = () => {
  const { user } = useRoute().params
  const focus = useIsFocused()
  const navigation = useNavigation()

  const [_profile, setProfile] = useState(null)

  useLayoutEffect(() => {
    (async () => {
      const _user = await (await getDoc(doc(db, 'users', user?.id))).data()
      setProfile(_user)
    })()
  }, [])

  if (focus) {
    NavigationBar.setPositionAsync('absolute')
    NavigationBar.setBackgroundColorAsync(color.transparent)
  }

  navigation.addListener('blur', () => {
    NavigationBar.setPositionAsync('relative')
    NavigationBar.setBackgroundColorAsync(color.white)
    NavigationBar.setButtonStyleAsync('dark')
  })

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View style={profile.container}>
      <Header
        showBack
        showTitle
        showNotification
        title={_profile?.username}
        showAratar={_profile?.photoURL ? true : false}
      />
      <ScrollView style={profile.container} showsVerticalScrollIndicator={false}>
        <>
          {
            _profile && user &&
            <>
              <ProfileDetails profile={_profile} user={user} />
              <Reels profile={_profile} user={user} />
            </>
          }
        </>
      </ScrollView>
    </View>
  )
}

export default UserProfile