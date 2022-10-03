import { View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { Feather } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import color from '../../style/color'
import { pRo } from '../../style/profileReels'
import OymoFont from '../../components/OymoFont'

const ReelsOption = () => {
  const navigation = useNavigation()
  const { reel } = useRoute().params
  const { profile } = useSelector(state => state.user)

  const deleteReel = async () => {
    navigation.goBack()
    await deleteDoc(doc(db, 'reels', reel?.id))
  }

  return (
    <View style={pRo.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flex: 1, width: '100%' }}
      />
      <View style={pRo.sheet}>
        <View style={pRo.previewView}>
          <Image source={{ uri: reel?.thumbnail }} style={pRo.previewImage} />

          <View style={{ flex: 1 }}>
            <OymoFont message={reel?.description} fontStyle={pRo.previewTitle} lines={1} />
            <OymoFont message={`Video - ${profile?.username}`} fontStyle={pRo.previewSubTitle} lines={1} fontFamily='montserrat_light' />
          </View>
        </View>
        <TouchableOpacity onPress={deleteReel} activeOpacity={0.5} style={pRo.deleteButton}>
          <Feather name='trash-2' size={20} color={color.white} />
          <OymoFont message='Delete' fontStyle={pRo.deleteButtonText} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ReelsOption