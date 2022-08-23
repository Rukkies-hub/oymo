import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useFonts } from 'expo-font'
import color from '../../../style/color'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

const LookingFor = () => {
  const { user, profile } = useSelector(state => state.user)

  const navigation = useNavigation()

  const [lookingFor, setLookingFor] = useState(profile?.lookingFor)

  const lookingForMen = async () => {
    setLookingFor('male')
    try {
      await updateDoc(doc(db, 'users', user?.uid), { lookingFor: 'male' })
    } catch (error) { return }
  }

  const lookingForWomen = async () => {
    setLookingFor('female')
    try {
      await updateDoc(doc(db, 'users', profile?.uid), { lookingFor: 'female' })
    } catch (error) { return }
  }

  const [loaded] = useFonts({
    text: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <View style={{ marginTop: 20 }}>
      <Text
        style={{
          color: color.red,
          fontFamily: 'boldText'
        }}
      >
        Interested in
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10
        }}
      >
        <TouchableOpacity
          onPress={lookingForMen}
          style={{
            flex: 1,
            backgroundColor: lookingFor == 'male' ? color.red : color.offWhite,
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: lookingFor == 'male' ? color.white : color.dark
            }}
          >
            Men
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={lookingForWomen}
          style={{
            flex: 1,
            backgroundColor: lookingFor == 'female' ? color.red : color.offWhite,
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12
          }}
        >
          <Text
            style={{
              fontFamily: 'text',
              color: lookingFor == 'female' ? color.white : color.dark
            }}
          >
            Women
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LookingFor