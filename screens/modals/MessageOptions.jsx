import React, { useEffect } from 'react'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'

import { useNavigation, useRoute } from '@react-navigation/native'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { deleteObject, getStorage, ref } from 'firebase/storage'
import { useDispatch, useSelector } from 'react-redux'
import { mo } from '../../style/messageOptions'
import OymoFont from '../../components/OymoFont'
import color from '../../style/color'
import { setMessageReply } from '../../features/messageSlice'

const MessageOptions = () => {
  const { messages, matchDetails } = useRoute().params
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)

  const navigation = useNavigation()

  const storage = getStorage()

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  const deleteMessage = async () => {
    if (messages?.mediaLink) {
      const mediaRef = ref(storage, messages?.mediaLink)

      deleteObject(mediaRef)
        .then(async () => {
          await deleteDoc(doc(db, 'matches', matchDetails?.id, 'messages', messages?.id))
            .then(() => navigation.goBack())
        })
    } else {
      navigation.goBack()
      await deleteDoc(doc(db, 'matches', matchDetails?.id, 'messages', messages?.id))
    }
  }

  return (
    <View style={mo.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={mo.goBack} />

      <View style={mo.optionsView}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
            dispatch(setMessageReply(messages))
          }}
          activeOpacity={0.5}
          style={mo.replyButton}
        >
          <OymoFont message='Reply' fontStyle={{ color: color.dark }} />
        </TouchableOpacity>

        {
          messages?.userId == id &&
          <TouchableOpacity onPress={deleteMessage} activeOpacity={0.5} style={mo.deleteButton}>
            <OymoFont message='Delete message' fontStyle={{ color: color.red }} />
          </TouchableOpacity>
        }
      </View>
    </View>
  )
}

export default MessageOptions