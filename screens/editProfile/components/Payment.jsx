import React, { useEffect, useState, useRef } from 'react'
import { View, Text, TouchableOpacity, Image, Modal, ActivityIndicator, Platform } from 'react-native'

import { Paystack } from 'react-native-paystack-webview'

import { paystackPublic } from '@env'
import color from '../../../style/color'

import uuid from 'uuid-random'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'

import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { useSelector } from 'react-redux'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
})

const Payment = ({ amount }) => {
  const { user, profile } = useSelector(state => state.user)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [transaction, setTransaction] = useState(null)

  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

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

  useEffect(() => {
    if (transaction) goPro()
  }, [transaction])


  const goPro = async () => {
    if (transaction?.message === 'Approved') {
      setLoading(true)
      await updateDoc(doc(db, 'users', id), {
        coins: 5000
      })
      setLoading(false)
      schedulePushNotification()
    }
  }

  return (
    <View>
      <Modal
        visible={modalVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <Paystack
          paystackKey={paystackPublic}
          amount={`${amount}.00`}
          billingEmail={user?.email}
          activityIndicatorColor='green'
          channels={['card', 'bank', 'ussd']}
          refNumber={`Oymo-${uuid()}`}
          billingName={profile?.displayName || profile?.username}
          onCancel={(e) => {
            setModalVisible(false)
          }}
          onSuccess={(res) => {
            setTransaction(res?.data?.transactionRef)
            setModalVisible(false)
          }}
          autoStart={true}
        />
      </Modal>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          backgroundColor: color.black,
          margin: 10,
          height: 45,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 12
        }}
      >
        {
          !loading ?
            <Text style={{ color: color.white, fontFamily: 'text' }}>
              Subscribe for $2.00
            </Text> :
            <ActivityIndicator color={color.goldDark} size='small' />
        }
      </TouchableOpacity>
    </View>
  )
}

async function schedulePushNotification () {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Oymo',
      body: `Account upgraded successfully`,
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

export default Payment