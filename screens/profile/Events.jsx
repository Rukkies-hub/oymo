import React, { useState, useLayoutEffect } from 'react'
import { View, Text, Pressable, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'

import color from '../../style/color'

import { useNavigation } from '@react-navigation/native'
import { collection, getDocs, limit, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import OymoFont from '../../components/OymoFont'

import { pReels as pEvents } from '../../style/profileReels'
import { useSelector } from 'react-redux'

const Events = () => {
  const navigation = useNavigation()
  const { user, profile } = useSelector(state => state.user)

  const [events, setEvents] = useState([])
  const [eventsLimit, setLimit] = useState(50)

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  useLayoutEffect(() => {
    return onSnapshot(query(collection(db, 'events'),
      where('user', '==', id), limit(eventsLimit)),
      snapshot => setEvents(
        snapshot?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        }))
      )
    )
  }, [eventsLimit, db])

  const getEvents = async () => {
    const queryEvents = await getDocs(query(collection(db, 'events'), where('user', '==', id), limit(eventsLimit)))

    setEvents(
      queryEvents?.docs?.map(doc => ({
        id: doc?.id,
        ...doc?.data()
      }))
    )
  }

  return (
    <>
      {
        events?.length < 1 ?
          <View style={pEvents.indicatorContainer}>
            <ActivityIndicator size='large' color={color.black} />
          </View> :
          <>
            {
              events?.map((event, index) => {
                return (
                  <Pressable
                    key={index}
                    onPress={() => navigation.navigate('Event', { event })}
                    delayLongPress={500}
                    style={pEvents.reelsList}
                  >
                    <Image source={{ uri: event?.image }} style={pEvents.reelsThumb} />

                    <View style={{ flex: 1 }}>
                      <OymoFont message={event?.type} lines={1} fontStyle={pEvents.desctiption} />
                      <OymoFont message={`Location - ${event?.location}`} lines={1} fontStyle={pEvents.username} />

                      <View style={pEvents.statsContainer}>
                        <View style={pEvents.statsContainerRow}>
                          <OymoFont message={event?.going} lines={1} fontStyle={pEvents.reelsCount} />
                          <OymoFont message='Attendees' lines={1} fontStyle={pEvents.reelsCountText} />
                        </View>
                        <View style={pEvents.statsContainerRow}>
                          <OymoFont message={event?.limit} lines={1} fontStyle={pEvents.reelsCount} />
                          <OymoFont message='Sits available' lines={1} fontStyle={pEvents.reelsCountText} />
                        </View>
                      </View>
                    </View>
                  </Pressable>
                )
              })
            }
          </>

      }
    </>
  )
}

export default Events