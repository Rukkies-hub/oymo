import { useFonts } from 'expo-font'
import React from 'react'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import color from '../../style/color'

const { width } = Dimensions.get('window')

const SetupModal = ({ navigation }) => {

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    lightText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Light.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.faintBlack,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          flex: 1,
          backgroundColor: color.transparent,
          width
        }}
      />
      <View
        style={{
          width: width - 20,
          minHeight: 10,
          backgroundColor: color.white,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}
      >
        <Text
          style={{
            fontFamily: 'boldText',
            fontSize: 20,
            marginBottom: 20
          }}
        >
          Creat a profile
        </Text>
        <Text
          style={{
            fontFamily: 'text',
            color: color.dark
          }}
        >
          You do not have a profile.
        </Text>
        <Text
          style={{
            fontFamily: 'text',
            color: color.dark
          }}
        >
          Please create a profile to perform any action
        </Text>

        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
            navigation.navigate('EditProfile')
          }}
          style={{
            width: '100%',
            height: 40,
            backgroundColor: color.red,
            marginTop: 20,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: color.white
            }}
          >
            Create a profile
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          flex: 1,
          backgroundColor: color.transparent,
          width
        }}
      />
    </View>
  )
}

export default SetupModal
// in use