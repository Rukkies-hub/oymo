import { View, Text, ImageBackground, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { _event } from '../../style/event'
import { useRoute } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import color from '../../style/color'
import Header from '../../components/Header'
import { useSelector } from 'react-redux'
import OymoFont from '../../components/OymoFont'
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import Avatar from './components/Avatar'
import UserAvatar from './components/UserAvatar'

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const Event = () => {
  const { event } = useRoute().params
  const { profile, user } = useSelector(state => state.user)

  const [activeButton, setActiveButton] = useState(true)
  const [eventState, setEventState] = useState('open')
  const [limit, setLimit] = useState(null)
  const [attendees, setAttendees] = useState([])

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  useEffect(() =>
    onSnapshot(doc(db, 'events', event?.id), doc => {
      setLimit(doc.data()?.limit)

      if (doc.data()?.limit < 1) setEventState('close')
    })
    , [])

  useEffect(() => {
    const getEvents = async () => {
      const querySnapshot = await getDoc(doc(db, 'users', id, 'events', event?.id))

      if (querySnapshot?.exists()) {
        setActiveButton(false)
      } else {
        setActiveButton(true)
      }
    }
    getEvents()
  }, [])

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

  const join = async () => {
    const querySnapshot = await getDoc(doc(db, 'users', id, 'events', event?.id))
    if (querySnapshot?.exists()) console.log('this document already exit')
    else {
      if (event?.user == id) {
        alert('Sorry, you can not join your own event')
      } else {
        await setDoc(doc(db, 'events', event?.id, 'attendees', id), { profile })
        await updateDoc(doc(db, 'events', event?.id), { limit: increment(-1) })
        setLimit(limit - 1)
        await setDoc(doc(db, 'users', id, 'events', event?.id), { event })
        setActiveButton(false)

        await addDoc(collection(db, 'users', event?.user, 'notifications'), {
          action: 'event',
          activity: 'joined',
          text: 'Joind your event',
          notify: event?.user,
          id: event?.id,
          seen: false,
          event,
          user: { id: id },
          timestamp: serverTimestamp()
        })
      }
    }

  }

  const cancelJoin = async () => {
    await deleteDoc(doc(db, 'events', event?.id, 'attendees', id))
    await deleteDoc(doc(db, 'users', id, 'events', event?.id))
    await updateDoc(doc(db, 'events', event?.id), { limit: increment(1) })
    setActiveButton(true)
  }

  return (
    <View style={_event.container}>
      <ImageBackground source={{ uri: event?.image }} style={_event.bg}>
        <LinearGradient colors={['transparent', color.black]} style={_event.gradient}>
          <Header
            showBack
            textColor={color.white}
            backgroundColor={color.transparent}
          />
          <View style={_event.mainView}>
            <OymoFont message={event?.title} fontStyle={_event.title} fontFamily='montserrat_bold' />
            <View style={_event.dateView}>
              <View style={_event.dateSides}>
                <View style={{ flexDirection: 'row' }}>
                  <Feather name="calendar" size={20} color={color.green} />
                  <View style={{ marginTop: -3, marginLeft: 10 }}>
                    <OymoFont
                      message={`${new Date(JSON.parse(event?.date)).getDate()} ${monthNames[new Date(JSON.parse(event?.date)).getMonth()]}`}
                      fontStyle={_event.mainText}
                      fontFamily='montserrat_bold'
                    />
                    <OymoFont message={days[new Date(JSON.parse(event?.date)).getDay()]} fontStyle={_event.day} />
                  </View>
                </View>
              </View>

              <View style={_event.dateSides}>
                <View style={{ flexDirection: 'row' }}>
                  <MaterialIcons name="access-time" size={20} color={color.green} />
                  <View style={{ marginTop: -3, marginLeft: 10 }}>
                    <OymoFont
                      message={`${new Date(JSON.parse(event?.time)).getHours()}:${new Date(JSON.parse(event?.time)).getMinutes()}`}
                      fontStyle={_event.mainText}
                      fontFamily='montserrat_bold'
                    />
                    <OymoFont
                      message={`Untill ${new Date(JSON.parse(event?.duration)).getHours()}:${new Date(JSON.parse(event?.duration)).getMinutes()}`}
                      fontStyle={_event.day}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={_event.dateView}>
              <View style={_event.dateSides}>
                <View style={{ flexDirection: 'row' }}>
                  <FontAwesome name="map-marker" size={24} color={color.green} />
                  <View style={{ marginTop: -3, marginLeft: 10 }}>
                    <OymoFont
                      message={event?.location}
                      fontStyle={_event.location}
                      fontFamily='montserrat_bold'
                    />
                  </View>
                </View>
              </View>
            </View>
            <OymoFont message={event?.description} fontStyle={_event.description} />
          </View>

          <View style={_event.bottomView}>
            <View style={_event.bottomViewSides}>
              <View style={_event.bottomViewSidesLeft}>
                <Avatar user={event?.user} />
                {
                  attendees?.length >= 1 &&
                  <View style={_event.avatars}>
                    {
                      attendees?.splice(0, 3).map((item, id) => {
                        return (
                          <UserAvatar key={id} user={item?.id} index={id} />
                        )
                      })
                    }
                    <TouchableOpacity style={[_event.more, { zIndex: attendees?.length + 1 }]}>
                      <OymoFont message={`+${attendees?.length + 1}`} fontStyle={_event.moreText} fontFamily='montserrat_bold' />
                    </TouchableOpacity>
                  </View>
                }
              </View>
              <View style={[_event.bottomViewSidesRight, { borderColor: limit <= 0 ? color.lightText : color.red}]}>
                <OymoFont message='Space left' fontStyle={limit <= 0 ? _event.notInProgressSpace : _event.progressSpace} />
                <OymoFont message={limit} fontFamily='montserrat_bold' fontStyle={limit <= 0 ? _event.notInProgress : _event.progress} />
              </View>
            </View>
            {
              activeButton ?
                <TouchableOpacity onPress={() => eventState == 'open' ? join() : null} style={[_event.joinButton, { backgroundColor: eventState == 'open' ? color.red : color.offWhite }]}>
                  <OymoFont message={eventState == 'open' ? 'Going' : 'Closed'} fontStyle={eventState == 'open' ? _event.joinButtonText : _event.joinButtonTextInactive} fontFamily='montserrat_bold' />
                </TouchableOpacity> :
                <TouchableOpacity onPress={cancelJoin} style={[_event.joinButton, { backgroundColor: color.offWhite }]}>
                  <OymoFont message='Cancel event' fontStyle={_event.joinButtonTextInactive} fontFamily='montserrat_bold' />
                </TouchableOpacity>
            }
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  )
}

export default Event