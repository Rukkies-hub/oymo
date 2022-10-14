import { View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { collection, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { Feather } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import color from '../../style/color'
import { pRo } from '../../style/profileReels'
import OymoFont from '../../components/OymoFont'

const EventOption = () => {
  const navigation = useNavigation()
  const { event } = useRoute().params
  const { profile, theme } = useSelector(state => state.user)

  const deleteEvent = async () => {
    if (event?.attendees != undefined && event?.attendees?.length >= 1) {
      // event?.attendees.forEach(async (user, index) => {
      //   await deleteDoc(doc(db, 'users', user, 'events', event?.id))
      // })
      // const querySnapshot = await getDocs(collection(db, 'events', event?.id, 'attendees'))
      // querySnapshot.forEach(async (doc) => {
      //   await deleteDoc(doc(db, 'events', event?.id, 'attendees', doc.data()?.profile?.id))
      // })
      // await deleteDoc(doc(db, 'events', event?.id))
      // navigation.goBack()
      
    }
  }

  return (
    <View style={pRo.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flex: 1, width: '100%' }}
      />
      <View style={[pRo.sheet, { backgroundColor: theme ? color.dark : color.white }]}>
        <View style={[pRo.previewView, { backgroundColor: theme ? color.lightText : color.white }]}>
          <Image source={{ uri: event?.image }} style={pRo.previewImage} />

          <View style={{ flex: 1 }}>
            <OymoFont message={event?.description} fontStyle={{ ...pRo.previewTitle, color: theme ? color.white : color.black }} lines={1} />
            <OymoFont message={`Event - ${profile?.username}`} fontStyle={{ ...pRo.previewSubTitle, color: theme ? color.white : color.dark }} lines={1} fontFamily='montserrat_light' />
          </View>
        </View>
        <TouchableOpacity onPress={deleteEvent} activeOpacity={0.5} style={pRo.deleteButton}>
          <Feather name='trash-2' size={20} color={color.white} />
          <OymoFont message='Delete' fontStyle={pRo.deleteButtonText} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default EventOption