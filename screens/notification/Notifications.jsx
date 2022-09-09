import React from 'react'
import { View, SafeAreaView, TouchableOpacity } from 'react-native'
import Header from '../../components/Header'
import color from '../../style/color'
import { AntDesign, Fontisto, Feather, Ionicons } from '@expo/vector-icons'
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { useNavigation } from '@react-navigation/native'
import { SwipeListView } from 'react-native-swipe-list-view'
import UserInfo from './components/UserInfo'
import UserAvatar from './components/UserAvatar'
import { useSelector } from 'react-redux'
import { notify } from '../../style/notification'
import OymoFont from '../../components/OymoFont'

const Notifications = () => {
  const navigation = useNavigation()
  const { user } = useSelector(state => state.user)
  const { notifications } = useSelector(state => state.notification)

  const viewNotification = async notification => {
    if (!notification?.seen) {
      await updateDoc(doc(db, 'users', user?.uid, 'notifications', notification?.notification), {
        seen: true
      }).then(() => {
        if (notification?.activity == 'likes' || notification?.activity == 'comment likes') navigation.navigate('ViewReel', { reel: notification?.reel })
        else if (notification?.activity == 'comment' || notification?.activity == 'comments') navigation.navigate('ReelsComment', { item: notification?.reel })
        else if (notification?.activity == 'reply') navigation.navigate('ReelsComment', { item: notification?.reel })
      })
    } else {
      if (notification?.activity == 'likes' || notification?.activity == 'comment likes') navigation.navigate('ViewReel', { reel: notification?.reel })
      else if (notification?.activity == 'comment' || notification?.activity == 'comments') navigation.navigate('ReelsComment', { item: notification?.reel })
      else if (notification?.activity == 'reply') navigation.navigate('ReelsComment', { item: notification?.reel })
    }
  }

  const markAllAsRead = async () => {
    const snapshot = await getDocs(query(collection(db, 'users', user?.uid, 'notifications'), where('seen', '==', false)))
    snapshot?.forEach(async allDoc => {
      await updateDoc(doc(db, 'users', user?.uid, 'notifications', allDoc?.id), {
        seen: true
      })
    })
  }

  const clearAll = async () => {
    const snapshot = await getDocs(collection(db, 'users', user?.uid, 'notifications'))
    snapshot?.forEach(async allDoc => {
      await deleteDoc(doc(db, 'users', user?.uid, 'notifications', allDoc?.id), {
        seen: true
      })
    })
  }

  const deleteNotification = async item =>
    await deleteDoc(doc(db, 'users', user?.uid, 'notifications', item?.id))


  const markAsRead = async item => {
    if (item?.seen)
      await updateDoc(doc(db, 'users', user?.uid, 'notifications', item?.id), { seen: false })
    else
      await updateDoc(doc(db, 'users', user?.uid, 'notifications', item?.id), { seen: true })
  }

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey)
  }

  const renderHiddenItem = ({ item }) => (
    <View style={notify.hiddenContolersView}>
      <TouchableOpacity onPress={() => markAsRead(item)} style={notify.markAsReadButton}>
        <Ionicons name='checkmark-done' size={24} color={item?.seen ? color.dark : color.blue} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteNotification(item)} style={notify.deleteNotification}>
        <Feather name='trash-2' size={20} color={color.red} />
      </TouchableOpacity>
    </View >
  )

  return (
    <SafeAreaView style={notify.container}>
      <Header showBack showTitle title='Notifications' showAratar showNotification />

      {
        notifications.length >= 1 &&
        <>
          <View style={notify.headerView}>
            <TouchableOpacity onPress={markAllAsRead} style={notify.markAllAsReadButton}>
              <OymoFont message='Mark all as read' fontStyle={{ color: color.dark }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={clearAll} style={notify.clearAllButton}>
              <Feather name='trash-2' size={20} color={color.red} />
            </TouchableOpacity>
          </View>
        </>
      }

      <SwipeListView
        data={notifications}
        keyExtractor={item => item?.id}
        style={{
          flex: 1,
          paddingHorizontal: 10
        }}
        rightOpenValue={-140}
        previewRowKey={'0'}
        previewOpenValue={-80}
        previewOpenDelay={3000}
        renderHiddenItem={renderHiddenItem}
        onRowDidOpen={onRowDidOpen}
        renderItem={({ item: notification }) => {
          return (
            <TouchableOpacity
              onPress={() => viewNotification(notification)}
              activeOpacity={1}
              style={[notify.notification, { backgroundColor: notification?.seen == false ? color.offWhite : color.white }]}
            >
              <View style={notify.avatarView}>
                <UserAvatar user={notification?.user?.id} />
                <View style={[notify.notificationTypeView, { backgroundColor: notification?.activity == 'likes' || notification?.activity == 'comment likes' ? color.red : color.green }]}>
                  {
                    notification?.activity == 'likes' || notification?.activity == 'comment likes' ?
                      <AntDesign name='heart' size={10} color={color.white} /> :
                      <Fontisto name='comment' size={10} color={color.white} />
                  }
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                  <UserInfo user={notification?.user?.id} />
                  <OymoFont message={notification?.activity == 'likes' ? 'likes your post' : 'commented on your post'} fontStyle={notify.activityTxt} fontFamily='montserrat_light' />
                </View>
                <OymoFont message={notification?.timestamp?.toDate().toDateString()} fontStyle={notify.date} />
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </SafeAreaView >
  )
}

export default Notifications