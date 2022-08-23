import React, { useEffect, useState, useRef } from 'react'
import { View, Text, TouchableOpacity, Image, Modal, ActivityIndicator, Platform } from 'react-native'

import { Paystack } from 'react-native-paystack-webview'

import { paystackPublic, testpPaystackPublic } from '@env'
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

let date = new Date()
date.setMonth(date.getMonth() + 2)
let newDate = new Date(date)

const Payment = () => {
  const {user, profile} = useSelector(state => state.user)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [transaction, setTransaction] = useState(null)

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

  useEffect(() => {
    if (transaction) goPro()
  }, [transaction])


  const goPro = async () => {
    if (transaction?.message === 'Approved') {
      setLoading(true)
      await updateDoc(doc(db, 'users', user?.uid), {
        paid: true,
        transaction: transaction?.transaction,
        trxref: transaction?.trxref,
        expires: newDate
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
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <Paystack
          paystackKey={paystackPublic}
          amount={'2500.00'}
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
          marginTop: 20,
          backgroundColor: color.transparent,
          borderWidth: 2,
          borderColor: color.goldDark,
          height: 50,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        {
          !loading ?
            <>
              <Image
                source={require('../../../assets/vip.png')}
                style={{
                  width: 30,
                  height: 30,
                  marginRight: 10
                }}
              />
              <Text
                style={{
                  color: color.goldDark,
                  fontFamily: 'text'
                }}
              >
                Go Premium
              </Text>
            </> :
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
      body: `Account upgraded successfully\n expires on ${new Date(date).toISOString()}`,
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