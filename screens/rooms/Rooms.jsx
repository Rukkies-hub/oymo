import { View, Text, ImageBackground, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { _rooms } from '../../style/rooms'
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from '../../hooks/firebase'
import Header from '../../components/Header'
import { LinearGradient } from 'expo-linear-gradient'
import color from '../../style/color'
import OymoFont from '../../components/OymoFont'
import { useNavigation } from '@react-navigation/native'

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const navigation = useNavigation()

  useEffect(() => {
    const getRooms = async () => {
      const querySnapshot = await getDocs(collection(db, 'rooms'))

      setRooms(
        querySnapshot?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        }))
      )
    }
    getRooms()
  }, [])

  return (
    <View style={_rooms.container}>
      <Header
        showBack
        showLogo
        showAratar
        showNotification
      />
      {
        rooms?.length >= 1 &&
        <ScrollView contentContainerStyle={_rooms.scrollView}>
          {
            rooms.map((room, id) => {
              return (
                <TouchableOpacity key={id} onPress={() => navigation.navigate('Room', { room })}>
                  <ImageBackground source={{ uri: room?.image }} style={_rooms.bg}>
                    <LinearGradient colors={['transparent', color.lightText]} style={_rooms.gradient}>
                      <OymoFont message={room?.name} lines={1} fontFamily='montserrat_bold' fontStyle={_rooms.title} />
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              )
            })
          }
        </ScrollView>
      }
    </View>
  )
}

export default Rooms