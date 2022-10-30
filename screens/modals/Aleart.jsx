import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { al } from '../../style/alert'
import OymoFont from '../../components/OymoFont'
import { useSelector } from 'react-redux'
import color from '../../style/color'
import { useNavigation, useRoute } from '@react-navigation/native'

const Aleart = () => {
  const {
    theme,
    showTitle,
    title,
    body,
    showBody,
    showDivider,
    showCancel,
    showOk
  } = useRoute().params

  const navigation = useNavigation()

  return (
    <View style={al.container}>
      <View style={[al.bubble, { backgroundColor: theme ? color.dark : color.white }]}>
        {
          showTitle &&
          <OymoFont message={title} fontFamily='montserrat_bold' fontStyle={{ ...al.title, color: theme ? color.white : color.dark }} />
        }
        {
          showBody &&
          <OymoFont message={body} fontStyle={{ color: theme ? color.white : color.dark, marginTop: 10 }} />
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={[al.cancelButton, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
              <OymoFont message='Ok' />
            </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  )
}

export default Aleart