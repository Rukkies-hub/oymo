import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { al } from '../../style/alert'
import OymoFont from '../../components/OymoFont'
import { useSelector } from 'react-redux'
import color from '../../style/color'
import { useNavigation, useRoute } from '@react-navigation/native'
import { BlurView } from 'expo-blur'

const Alert = () => {
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
    <BlurView style={al.container} tint={theme ? 'dark' : 'light'} intensity={100}>
      <View style={[al.bubble, { backgroundColor: theme ? color.dark : color.white }]}>
        {
          showTitle &&
          <OymoFont message={title} fontFamily='montserrat_bold' fontStyle={{ ...al.title, color: theme ? color.white : color.dark }} />
        }
        {
          showBody &&
          <OymoFont message={body} fontStyle={{ color: theme ? color.white : color.dark, marginTop: 10, textAlign: 'center' }} />
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={[al.okButton, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
              <OymoFont message='Ok' fontFamily='montserrat_bold' fontStyle={{ color: theme ? color.white : color.indigo }} />
            </TouchableOpacity>
          }
        </View>
      </View>
    </BlurView>
  )
}

export default Alert