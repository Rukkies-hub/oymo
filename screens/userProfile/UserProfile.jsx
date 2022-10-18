import React, { useLayoutEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import color from '../../style/color'
import { profile } from '../../style/profile'

import { useRoute } from '@react-navigation/native'

import { useSelector } from 'react-redux'
import { useFonts } from 'expo-font'

import ProfileDetails from './ProfileDetails'
import Reels from './Reels'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import Header from '../../components/Header'

const UserProfile = () => {
  const { user } = useRoute().params
  const { theme } = useSelector(state => state.user)

  const [_profile, setProfile] = useState(null)

  useLayoutEffect(() => {
    (async () => {
      const _user = await (await getDoc(doc(db, 'users', user?.id))).data()
      setProfile(_user)
    })()
  }, [])

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <View style={[profile.container, { backgroundColor: theme ? color.dark : color.white }]}>
      <Header
        showBack
        showTitle
        showNotification
        title={_profile?.username}
        showAratar={_profile?.photoURL ? true : false}
      />
      <ScrollView style={[profile.container, { backgroundColor: theme ? color.dark : color.white }]} showsVerticalScrollIndicator={false}>
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