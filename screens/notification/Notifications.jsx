import React from 'react'
import { View, SafeAreaView, TouchableOpacity } from 'react-native'
import Header from '../../components/Header'
import color from '../../style/color'
import { AntDesign, Fontisto, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { collection, deleteDoc, doc, getDocs, increment, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { SwipeListView } from 'react-native-swipe-list-view'
import UserInfo from './components/UserInfo'
import UserAvatar from './components/UserAvatar'
import { useSelector } from 'react-redux'
import { notify } from '../../style/notification'
import OymoFont from '../../components/OymoFont'
import * as NavigationBar from 'expo-navigation-bar'

const Notifications = () => {
  const navigation = useNavigation()
  const focus = useIsFocused()
  const { user, profile, theme } = useSelector(state => state.user)
  const { notifications } = useSelector(state => state.notification)

  if (focus) {
    NavigationBar.setBackgroundColorAsync(theme ? color.dark : color.white)
    NavigationBar.setButtonStyleAsync(theme ? 'light' : 'dark')
  }

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  const viewNotification = async notification => {
    if (!notification?.seen) {
      await updateDoc(doc(db, 'users', id, 'notifications', notification?.notification), {
        seen: true
      }).then(async () => {
        if (notification?.activity == 'likes' || notification?.activity == 'comment likes') {
          navigation.navigate('ViewReel', { reel: notification?.reel })
          await updateDoc(doc(db, 'users', id), { notificationCount: increment(-1) })
        }
        else if (notification?.activity == 'comment' || notification?.activity == 'comments') {
          navigation.navigate('ReelsComment', { item: notification?.reel })
          await updateDoc(doc(db, 'users', id), { notificationCount: increment(-1) })
        }
        else if (notification?.activity == 'reply') {
          navigation.navigate('ReelsComment', { item: notification?.reel })
          await updateDoc(doc(db, 'users', id), { notificationCount: increment(-1) })
        }
        else if (notification?.activity == 'joined') {
          navigation.navigate('Event', { event: notification?.event })
          await updateDoc(doc(db, 'users', id), { notificationCount: increment(-1) })
        }
      })
    } else {
      if (notification?.activity == 'likes' || notification?.activity == 'comment likes') {
        navigation.navigate('ViewReel', { reel: notification?.reel })
        await updateDoc(doc(db, 'users', id), { notificationCount: increment(-1) })
      }
      else if (notification?.activity == 'comment' || notification?.activity == 'comments') {
        navigation.navigate('ReelsComment', { item: notification?.reel })
        await updateDoc(doc(db, 'users', id), { notificationCount: increment(-1) })
      }
      else if (notification?.activity == 'reply') {
        navigation.navigate('ReelsComment', { item: notification?.reel })
        await updateDoc(doc(db, 'users', id), { notificationCount: increment(-1) })
      }
      else if (notification?.activity == 'joined') {
        navigation.navigate('Event', { event: notification?.event })
        await updateDoc(doc(db, 'users', id), { notificationCount: increment(-1) })
      }
    }
  }

  const markAllAsRead = async () => {
    if (profile?.coins < 1) return
    const snapshot = await getDocs(query(collection(db, 'users', id, 'notifications'), where('seen', '==', false)))
    snapshot?.forEach(async allDoc => {
      await updateDoc(doc(db, 'users', id, 'notifications', allDoc?.id), { seen: true })
    })
    await updateDoc(doc(db, 'users', id), { notificationCount: 0 })
    await updateDoc(doc(db, 'users', id), { coins: increment(-1) })
  }

  const clearAll = async () => {
    if (profile?.coins < 1) return
    const snapshot = await getDocs(collection(db, 'users', id, 'notifications'))
    snapshot?.forEach(async allDoc => {
      await deleteDoc(doc(db, 'users', id, 'notifications', allDoc?.id), { seen: true })
    })
    await updateDoc(doc(db, 'users', id), { notificationCount: 0 })
    await updateDoc(doc(db, 'users', id), { coins: increment(-1) })
  }

  const deleteNotification = async item => {
    if (profile?.coins < 1) return
    await deleteDoc(doc(db, 'users', id, 'notifications', item?.id))
    await updateDoc(doc(db, 'users', id), { notificationCount: increment(-1) })
    await updateDoc(doc(db, 'users', id), { coins: increment(-1) })
  }


  const markAsRead = async item => {
    if (profile?.coins < 1) return
    if (item?.seen) {
      await updateDoc(doc(db, 'users', id, 'notifications', item?.id), { seen: false })
      await updateDoc(doc(db, 'users', id), { notificationCount: increment(1) })
      await updateDoc(doc(db, 'users', id), { coins: increment(-1) })
    }
    else {
      await updateDoc(doc(db, 'users', id, 'notifications', item?.id), { seen: true })
      await updateDoc(doc(db, 'users', id), { notificationCount: increment(-1) })
      await updateDoc(doc(db, 'users', id), { coins: increment(-1) })
    }
  }

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey)
  }

  const renderHiddenItem = ({ item }) => (
    <View style={notify.hiddenContolersView}>
      <TouchableOpacity onPress={() => markAsRead(item)} style={[notify.markAsReadButton, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
        <Ionicons name='checkmark-done' size={24} color={item?.seen ? (theme ? color.white : color.dark) : color.blue} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteNotification(item)} style={[notify.deleteNotification, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
        <Feather name='trash-2' size={20} color={color.red} />
      </TouchableOpacity>
    </View >
  )

  return (
    <SafeAreaView style={[notify.container, { backgroundColor: theme ? color.dark : color.white }]}>
      <Header showBack showTitle title='Notifications' showAratar showNotification />

      {
        notifications.length >= 1 &&
        <>
          <View style={notify.headerView}>
            <TouchableOpacity onPress={markAllAsRead} style={[notify.markAllAsReadButton, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
              <OymoFont message='Mark all as read' fontStyle={{ color: theme ? color.white : color.dark }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={clearAll} style={[notify.clearAllButton, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
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
              style={[notify.notification, { backgroundColor: notification?.seen == false ? (theme ? color.lightText : color.offWhite) : (theme ? color.dark : color.white) }]}
            >
              <View style={notify.avatarView}>
                <UserAvatar user={notification?.user?.id} />
                <View
                  style={[
                    notify.notificationTypeView,
                    {
                      backgroundColor:
                        notification?.activity == 'likes' ||
                          notification?.activity == 'comment likes' ? color.red :
                          notification?.activity == 'joined' ? color.blue : color.green
                    }
                  ]}
                >
                  {
                    notification?.activity == 'likes' || notification?.activity == 'comment likes' ?
                      <AntDesign name='heart' size={10} color={color.white} /> :
                      notification?.activity == 'joined' ?
                        <MaterialIcons name="event" size={10} color={color.white} /> :
                        <Fontisto name='comment' size={10} color={color.white} />
                  }
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                  <UserInfo user={notification?.user?.id} />
                  <OymoFont
                    message={notification?.activity == 'likes' ? 'likes your post' : notification?.activity == 'joined' ? 'Joined your event' : 'commented on your post'}
                    fontStyle={{...notify.activityTxt, color: theme ? color.white : color.dark}}
                    fontFamily='montserrat_light'
                  />
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