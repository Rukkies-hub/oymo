import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import { events } from '../../../style/events'
import color from '../../../style/color'
import { LinearGradient } from 'expo-linear-gradient'
import OymoFont from '../../../components/OymoFont'
import { useNavigation } from '@react-navigation/native'

const Card = ({ event }) => {
  const navigation = useNavigation()
  
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Event', { event })}>
      <ImageBackground source={{ uri: event?.image }} style={events.card}>
        <LinearGradient colors={['transparent', color.lightText]} style={events.gradient}>
          <OymoFont message={event?.title} lines={1} fontFamily='montserrat_bold' fontStyle={events.title} />
          <OymoFont message={event?.description} lines={1} fontStyle={events.description} />
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  )
}

export default Card