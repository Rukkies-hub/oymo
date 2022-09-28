import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { ug } from '../style/upgrade'
import OymoFont from '../components/OymoFont'
import Payment from './editProfile/components/Payment'
import { useLayoutEffect } from 'react'
import { Convert } from "easy-currencies"

const Upgrade = ({ navigation }) => {
  const [amount, setAmount] = useState('')

  useLayoutEffect(() => {
    const convirt = async () => {
      const value = await Convert(2).from("USD").to("NGN")
      setAmount(JSON.stringify(Math.round(value)))
    }

    convirt()
  }, [])

  return (
    <View style={ug.container}>
      <TouchableOpacity style={ug.goBack} onPress={() => navigation.goBack()} />

      <View style={ug.main}>
        <View style={ug.head}>
          <Image source={require('../assets/star.png')} style={ug.star} />

          <OymoFont message='Oymo Premium' fontFamily='montserrat_bold' fontStyle={ug.ht1} />
          <Text style={ug.ht2}>Go <Text style={{ fontFamily: 'boldText' }}>beyond th limits</Text>, get <Text style={{ fontFamily: 'boldText' }}>exclusive features</Text> ans dupport us by suscribing to <Text style={{ fontFamily: 'boldText' }}>Oymo Premium</Text>.</Text>
        </View>

        <Payment amount={amount} />
      </View>
    </View>
  )
}

export default Upgrade