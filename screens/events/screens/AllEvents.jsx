import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { events } from '../../../style/events'
import { AntDesign } from '@expo/vector-icons'
import color from '../../../style/color'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import OymoFont from '../../../components/OymoFont'
import Card from './Card'

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

const AllEvents = ({ navigation }) => {
  const [allEvents, setAllEvents] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => getEvents())
  }, [])

  const getEvents = async () => {
    const querySnapshot = await getDocs(query(collection(db, "events"), orderBy('timestamp', 'desc')))

    if (querySnapshot?.docs?.length >= 1)
      setAllEvents(
        querySnapshot?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        }))
      )
    setRefreshing(false)
  }

  useEffect(() => {
    getEvents()
  }, [db])

  return (
    <View style={events.container}>
      <OymoFont message='Welcom to Events' fontFamily='montserrat_bold' fontStyle={{ fontSize: 25, color: color.dark, marginHorizontal: 10 }} />

      <FlatList
        data={allEvents}
        style={events.cardList}
        keyExtractor={item => item?.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => <Card event={item} />}
      />

      <TouchableOpacity style={events.fab} onPress={() => navigation.navigate('Craate')}>
        <AntDesign name="plus" size={24} color={color.white} />
      </TouchableOpacity>
    </View>
  )
}

export default AllEvents