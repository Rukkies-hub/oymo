import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { al } from '../../style/alert'
import OymoFont from '../../components/OymoFont'
import { useSelector } from 'react-redux'
import color from '../../style/color'

const Aleart = ({ title, showTitle, body, showBody, showDivider, showCancel, showOk }) => {
  const { theme } = useSelector(state => state.user)
  return (
    <View style={al.container}>
      <View style={[al.bubble, { backgroundColor: theme ? color.dark : color.white }]}>
        {
          showTitle &&
          <OymoFont message={title} fontFamily='montserrat_bold' fontStyle={{ ...al.title, color: theme ? color.white : color.dark }} />
        }
        {
          showBody &&
          <OymoFont message={body} fontStyle={{ color: theme ? color.white : color.dark }} />
        }
        <View style={[al.bottom, { borderTopColor: theme ? color.lightBorderColor : color.borderColor }]}>
          {
            showCancel &&
            <TouchableOpacity>
              <OymoFont message='Cancel' />
            </TouchableOpacity>
          }
          {
            showDivider &&
            <View style={al.divider} />
          }
          {
            showOk &&
            <TouchableOpacity>
              <OymoFont message='Ok' />
            </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  )
}

export default Aleart