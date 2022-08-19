import { View, Text } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font'

const OymoFont = ({ message, fontStyle, fontFamily }) => {
  const [loaded] = useFonts({
    pacifico: require('../assets/fonts/Pacifico/Pacifico-Regular.ttf'),
    montserrat_medium: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <Text style={{ ...fontStyle, fontFamily: fontFamily || 'montserrat_medium' }}>{message}</Text>
  )
}

export default OymoFont