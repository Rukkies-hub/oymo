import React, { useState } from 'react'
import { View, TouchableOpacity, ActivityIndicator } from 'react-native'
import color from '../../../style/color'

import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'

import { useSelector } from 'react-redux'
import OymoFont from '../../../components/OymoFont'
import { theme } from '../../../style/editProfile'

const AppTheme = () => {
  const { user } = useSelector(state => state.user)

  const [lightLoading, setLightLoading] = useState(false)
  const [darkLoading, setDarkLoading] = useState(false)

  const lightMode = async () => {
    setLightLoading(true)
    await updateDoc(doc(db, 'users', user?.uid), { theme: 'light' })
    setLightLoading(false)
  }

  const darkMode = async () => {
    setDarkLoading(true)
    await updateDoc(doc(db, 'users', user?.uid), { theme: 'dark' })
    setDarkLoading(false)
  }

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <View style={{ marginTop: 20 }}>
      <OymoFont message='App theme' fontFamily='montserrat_bold' fontStyle={{ color: color.red }} />
      <View style={theme.buttonsContainer}>
        <TouchableOpacity onPress={lightMode} style={theme.button}>
          <View style={theme.overlayView}>
            <Entypo name='light-down' size={30} color={color.white} />
          </View>
          {
            lightLoading ?
              <ActivityIndicator color={color.red} size='small' /> :
              <OymoFont message='Light' fontStyle={{ color: color.dark }} />
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={darkMode} style={theme.button}>
          <View style={theme.overlayView}>
            <MaterialCommunityIcons name='theme-light-dark' size={25} color={color.white} />
          </View>
          {
            darkLoading ?
              <ActivityIndicator color={color.red} size='small' /> :
              <OymoFont message='Dark' fontStyle={{ color: color.dark }} />
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AppTheme
// in use