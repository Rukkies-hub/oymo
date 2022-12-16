import { View, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { galleryMoal } from '../../style/editProfile'
import color from '../../style/color'
import AutoHeightImage from 'react-native-auto-height-image'
import OymoFont from '../../components/OymoFont'
import { deleteObject, getStorage, ref } from 'firebase/storage'
import { arrayRemove, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

const { width } = Dimensions.get('window')

const DeleteGalleryImage = () => {
  const { id, index, photo, theme } = useRoute().params
  const navigation = useNavigation()
  const storage = getStorage()

  const [loading, setLoading] = useState(false)

  const deleteImage = () => {
    setLoading(true)
    const deleteAvatarRef = ref(storage, photo?.photoLink)

    deleteObject(deleteAvatarRef)
      .then(() => {
        navigation.goBack()
        updateDoc(doc(db, 'users', id), {
          gallery: arrayRemove(photo)
        })
        setLoading(false)
      })
  }

  return (
    <View style={galleryMoal.container}>
      <View style={[galleryMoal.sheet, { backgroundColor: theme ? color.dark : color.white }]}>
        <AutoHeightImage source={{ uri: photo?.photoURL }} width={width} />

        <TouchableOpacity style={galleryMoal.delete} onPress={deleteImage}>
          {
            loading ?
              <ActivityIndicator color={color.white} /> :
              <OymoFont message='Delete' fontStyle={{ color: color.white }} />
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default DeleteGalleryImage