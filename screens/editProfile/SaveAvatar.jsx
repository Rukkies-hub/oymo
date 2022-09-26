import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Dimensions, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import AutoHeightImage from 'react-native-auto-height-image'
import color from '../../style/color'
import { useFonts } from 'expo-font'
import { Feather } from '@expo/vector-icons'

import uuid from 'uuid-random'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { useSelector } from 'react-redux'
import { editProfile } from '../../style/editProfile'
import OymoFont from '../../components/OymoFont'

const { width } = Dimensions.get('window')

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  })
})

const SaveAvatar = () => {
  const { user, profile } = useSelector(state => state.user)
  const { result } = useRoute().params
  const navigation = useNavigation()

  const storage = getStorage()

  const [loading, setLoading] = useState(false)

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  // notification
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // console.log(response)
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  const saveAvatar = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.response)

      xhr.responseType = 'blob'
      xhr.open('GET', result?.uri, true)
      xhr.send(null)
    })

    const link = `avatars/${id}/${uuid()}`

    const photoRef = ref(storage, link)

    if (result?.uri && result?.type == 'image') {
      if (profile?.photoURL) {
        setLoading(true)
        const deleteAvatarRef = ref(storage, profile?.photoLink)

        deleteObject(deleteAvatarRef)
          .then(() => {
            uploadBytes(photoRef, blob)
              .then(snapshot => {
                getDownloadURL(snapshot?.ref)
                  .then(downloadURL => {
                    updateDoc(doc(db, 'users', profile?.id), {
                      photoURL: downloadURL,
                      photoLink: link
                    }).then(() => {
                      navigation.goBack()
                      schedulePushNotification('Update successful', 'Your display picture has been updated successfully')
                      setLoading(false)
                    }).catch(() => setLoading(false))
                  })
              })
          })
      } else {
        setLoading(true)
        uploadBytes(photoRef, blob)
          .then(snapshot => {
            getDownloadURL(snapshot?.ref)
              .then(downloadURL => {
                updateDoc(doc(db, 'users', id), {
                  photoURL: downloadURL,
                  photoLink: link
                }).then(() => {
                  navigation.goBack()
                  schedulePushNotification('Update successful', 'Your display picture has been updated successfully')
                  setLoading(false)
                }).catch(() => setLoading(false))
              })
          })
      }
    }
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf'),
  })

  if (!loaded) return null

  return (
    <View style={editProfile.saveAfatarContainer}>
      <AutoHeightImage width={width} source={{ uri: result?.uri }} style={editProfile.autoHeightImage} />
      <View style={editProfile.controlersContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={editProfile.cancelButton}>
          <OymoFont message='Cancel' fontStyle={editProfile.cancelButtonText} />
        </TouchableOpacity>

        <TouchableOpacity onPress={saveAvatar} style={editProfile.savebutton}>
          {
            !loading ?
              <>
                <Feather name='corner-left-up' size={24} color={loading == true ? color.red : color.white} />
                <OymoFont message='Save' fontStyle={editProfile.savebuttonText} />
              </> :
              <ActivityIndicator color={color.white} size='small' />
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

async function schedulePushNotification (title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: require('../../assets/newMessage.mp3')
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

export default SaveAvatar