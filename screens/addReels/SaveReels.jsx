import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native'

import Header from '../../components/Header'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import uuid from 'uuid-random'
import Bar from '../../components/Bar'

import * as Notifications from 'expo-notifications'

import * as Device from 'expo-device'
import color from '../../style/color'
import { useSelector } from 'react-redux'
import { sr } from '../../style/saveReel'
import OymoFont from '../../components/OymoFont'
import { admin } from '@env'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  })
})

const SaveReels = () => {
  const { user, profile } = useSelector(state => state.user)
  const navigation = useNavigation()
  const { source, thumbnail, mediaType } = useRoute().params

  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  const storage = getStorage()

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response)
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  const saveReel = async () => {
    if (profile?.coin < 100) return

    if (mediaType === 'video') {
      setLoading(true)
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', source, true)
        xhr.send(null)
      })

      const thumbnailBlob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', thumbnail, true)
        xhr.send(null)
      })

      const sourceRef = ref(storage, `reels/${id}/video/${uuid()}`)

      const thumbnailRef = ref(storage, `reels/${id}/thumbnail/${uuid()}`)

      uploadBytes(sourceRef, blob)
        .then(snapshot => {
          getDownloadURL(snapshot.ref)
            .then(downloadURL => {
              uploadBytes(thumbnailRef, thumbnailBlob)
                .then(thumbnailSnapshot => {
                  getDownloadURL(thumbnailSnapshot.ref)
                    .then(async thumbnailDownloadURL => {
                      navigation.navigate('Reels')
                      await addDoc(collection(db, 'reels'), {
                        user: { id: id },
                        media: downloadURL,
                        mediaLink: snapshot?.ref?._location?.path,
                        thumbnail: thumbnailDownloadURL,
                        thumbnailLink: thumbnailSnapshot?.ref?._location?.path,
                        description,
                        likesCount: 0,
                        commentsCount: 0,
                        timestamp: serverTimestamp()
                      })
                      setLoading(false)
                      setDescription('')
                      schedulePushNotification()
                      await updateDoc(doc(db, 'users', id), { coins: increment(-100) })
                      await updateDoc(doc(db, 'admin', admin), { reels: increment(1) })
                    })
                })
            })
        })
    }
  }

  return (
    <View style={sr.container}>
      <Bar color='dark' />
      <Header showBack showTitle title='Save reel' />

      <View style={sr.mainView}>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={150}
          placeholder="What's on your mind..."
          placeholderTextColor={color.dark}
          style={sr.input}
        />
        <Image source={{ uri: source }} style={sr.preview} />
      </View>

      <View style={{ flex: 1 }} />

      <View style={sr.bottomView}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={sr.cancelButton}>
          <OymoFont message='Cancel' fontStyle={{ color: color.dark }} />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={loading}
          onPress={saveReel}
          style={sr.saveButton}
        >

          {
            !loading ?
              <>
                <Feather name='corner-left-up' size={24} color={loading == true ? color.red : color.white} />
                <OymoFont
                  message='Save'
                  fontStyle={{
                    marginLeft: 10,
                    color: loading == true ? color.red : color.white
                  }}
                />
              </> :
              <ActivityIndicator color={color.white} size='small' />
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

async function schedulePushNotification () {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Post saved',
      body: 'Yippee!! Your post has been saved successfully.\nPull to refresh',
      data: { data: 'goes here' },
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
    console.log(token)
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

export default SaveReels