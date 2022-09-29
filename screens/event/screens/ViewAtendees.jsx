import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { va } from '../../../style/viewAtendees'
import OymoFont from '../../../components/OymoFont'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import UserList from './components/UserList'

const ViewAtendees = () => {
  const { event } = useRoute().params
  const navigation = useNavigation()

  const [limit, setLimit] = useState(null)
  const [attendees, setAttendees] = useState([])

  useEffect(() => {
    const getAtendees = async () => {
      const querySnapshot = await getDocs(collection(db, 'events', event?.id, 'attendees'))

      if (querySnapshot?.docs?.length >= 1)
        setAttendees(
          querySnapshot?.docs?.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
        )
    }
    getAtendees()
  }, [db])

  return (
    <View style={va.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ flex: 1 }} />
      <View style={va.mainView}>
        <View style={va.nav}>
          <Image source={{ uri: event?.image }} style={va.image} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={va.closeButton}>
            <OymoFont message='Close' fontStyle={va.closeButtonText} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={attendees}
          keyExtractor={item => item?.id}
          style={va.cardList}
          renderItem={({ item }) => {
            return (<UserList attendee={item} />)
          }}
        />
      </View>
    </View>
  )
}

export default ViewAtendees