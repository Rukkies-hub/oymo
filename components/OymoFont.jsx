import { View, Text } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font'

const OymoFont = ({ message, fontStyle, fontFamily }) => {
  const [loaded] = useFonts({
    pacifico: require('../assets/fonts/Pacifico/Pacifico-Regular.ttf'),
    montserrat_light: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Light.ttf'),
    montserrat_medium: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    montserrat_bold: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <Text style={{ ...fontStyle, fontFamily: fontFamily || 'montserrat_medium' }}>{message}</Text>
  )
}

export default OymoFont