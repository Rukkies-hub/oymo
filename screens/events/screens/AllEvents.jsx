import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { events } from '../../../style/events'
import { AntDesign } from '@expo/vector-icons'
import color from '../../../style/color'

const AllEvents = ({navigation}) => {
  return (
    <View style={events.container}>
      <Text>AllEvents</Text>

      <TouchableOpacity style={events.fab} onPress={() => navigation.navigate('Craate')}>
        <AntDesign name="plus" size={24} color={color.white} />
      </TouchableOpacity>
    </View>
  )
}

export default AllEvents