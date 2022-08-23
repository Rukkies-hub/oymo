import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'
import color from '../../../style/color'
import { useFonts } from 'expo-font'
import { Foundation } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'

const { width } = Dimensions.get('window')

import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { useSelector } from 'react-redux'
import { gender } from '../../../style/editProfile'
import OymoFont from '../../../components/OymoFont'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  })
})

const Gender = () => {
  const { user, profile } = useSelector(state => state.user)
  const navigation = useNavigation()

  const [maleLoading, setMaleLoading] = useState(false)
  const [femaleLoading, setFemaleLoading] = useState(false)

  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => { })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  const maleGender = async () => {
    setMaleLoading(true)
    await updateDoc(doc(db, 'users', user?.uid), { gender: 'male' })
    setMaleLoading(false)
    schedulePushNotification()
    navigation.goBack()
  }

  const femaleGender = async () => {
    setFemaleLoading(true)
    await updateDoc(doc(db, 'users', user?.uid), { gender: 'female' })
    setFemaleLoading(false)
    schedulePushNotification()
    navigation.goBack()
  }

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf'),
  })

  if (!loaded) return null

  return (
    <View style={gender.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={gender.goBackButton} />

      <View style={gender.sheet}>
        <OymoFont message='Warning!!!' fontFamily='montserrat_bold' fontStyle={gender.warning} />
        <OymoFont
          message='You only have one chance to change this information'
          fontFamily='montserrat_bold'
          fontStyle={gender.caption}
        />

        <TouchableOpacity onPress={maleGender} style={gender.maleButton}>
          {
            !maleLoading ?
              <>
                <Foundation name='male-symbol' size={24} color={color.white} />
                <OymoFont message='Male (Man)' fontStyle={gender.buttonText} />
              </> :
              <ActivityIndicator size='small' color={color.white} />
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={femaleGender} style={gender.femaleButton}>
          {
            !femaleLoading ?
              <>
                <Foundation name='female-symbol' size={24} color={color.white} />
                <OymoFont message='Female (Woman)' fontStyle={gender.buttonText} />
              </> :
              <ActivityIndicator size='small' color={color.white} />
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

async function schedulePushNotification () {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Update successful",
      body: 'Your profile has been updated successfully'
    },
    trigger: { seconds: 1 },
  })
}

async function registerForPushNotificationsAsync () {
  let token
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
  } else {
    alert('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: color.red,
    })
  }

  return token
}

export default Gender