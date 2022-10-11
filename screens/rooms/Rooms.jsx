import { View, Text, ImageBackground, ScrollView, TouchableWithoutFeedback, FlatList, RefreshControl, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { _rooms } from '../../style/rooms'
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from '../../hooks/firebase'
import Header from '../../components/Header'
import { LinearGradient } from 'expo-linear-gradient'
import color from '../../style/color'
import OymoFont from '../../components/OymoFont'
import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Rooms = () => {
  const { theme } = useSelector(state => state.user)
  const navigation = useNavigation()

  const [rooms, setRooms] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => getRooms())
  }, [])

  const getRooms = async () => {
    const querySnapshot = await getDocs(collection(db, 'rooms'))

    setRooms(
      querySnapshot?.docs?.map(doc => ({
        id: doc?.id,
        ...doc?.data()
      }))
    )
    setRefreshing(false)
  }

  useEffect(() => {
    getRooms()
  }, [])

  return (
    <View style={[_rooms.container, { backgroundColor: theme ? color.dark : color.white }]}>
      <Header
        showBack
        showLogo
        showAratar
        showNotification
      />
      {
        rooms?.length >= 1 &&
        <FlatList
          data={rooms}
          keyExtractor={item => item?.id}
          style={_rooms.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          renderItem={({ item: room }) => {
            return (
              <Pressable onPress={() => navigation.navigate('Room', { room })}>
                <ImageBackground source={{ uri: room?.image }} style={_rooms.bg}>
                  <LinearGradient colors={['transparent', color.lightText]} style={_rooms.gradient}>
                    <OymoFont message={room?.name} lines={1} fontFamily='montserrat_bold' fontStyle={_rooms.title} />
                  </LinearGradient>
                </ImageBackground>
              </Pressable>
            )
          }}
        />
      }
    </View>
  )
}

export default Rooms