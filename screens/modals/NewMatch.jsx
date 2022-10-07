import React from 'react'
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { LinearGradient } from 'expo-linear-gradient'

import color from '../../style/color'

import { Glitch } from 'rn-glitch-effect'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { nm } from '../../style/match'
import OymoFont from '../../components/OymoFont'

const NewMatch = () => {
  const navigation = useNavigation()
  const { userSwiped } = useRoute().params

  return (
    <ImageBackground style={nm.container} source={{ uri: userSwiped?.photoURL }}>
      <LinearGradient colors={['transparent', color.lightText]} style={nm.screenGradient}>
        <View style={nm.glitchView}>
          <OymoFont message="It's a" fontStyle={nm.itis} />
          <Glitch
            text={'MATCH'}
            mainColor={color.lightGreen}
            shadowColor={color.red}
            glitchDuration={3000}
            glitchAmplitude={10}
            repeatDelay={10}
            glitchHeight={100}
            textStyle={[nm.glitch, { fontFamily: 'logo' }]}
          />
        </View>

        <View
          style={{
            alignItems: 'center',
            marginTop: 30
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: color.white,
              fontSize: 16
            }}
          >
            <Text style={{ textTransform: 'capitalize' }}>
              {userSwiped?.username + ' '}
            </Text>
            likes you
          </Text>
          <MaterialCommunityIcons name='heart' size={30} color={color.lightGreen} />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
            navigation.navigate('Chat')
          }}
          style={{
            backgroundColor: color.white,
            borderRadius: 12,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20
          }}>
          <Text
            style={{
              color: color.dark,
              fontSize: 20,
              fontFamily: 'text',
              color: color.lightText
            }}
          >
            Say hi to
            <Text
              style={{
                textTransform: 'capitalize'
              }}
            >
              {' ' + userSwiped?.username}
            </Text>
          </Text>
        </TouchableOpacity>

        <View
          style={{
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
              navigation.navigate('Match')
            }}
            style={{
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20
            }}
          >
            <Text
              style={{
                color: color.white,
                fontFamily: 'text',
                fontSize: 16,
                textTransform: 'uppercase'
              }}
            >
              Keep Swiping
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  )
}

export default NewMatch
// in use