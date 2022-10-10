import React, { useEffect, useRef, useState } from 'react'

import {
  View,
  SafeAreaView,
  Pressable,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native'

import Header from '../../components/Header'

const { width } = Dimensions.get('screen')

import AutoHeightImage from 'react-native-auto-height-image'

import { FontAwesome5 } from '@expo/vector-icons'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

import { Video } from 'expo-av'

import uuid from 'uuid-random'

import Bar from '../../components/Bar'
import { useSelector } from 'react-redux'
import { pm } from '../../style/previewMessageImage'
import color from '../../style/color'

import { admin } from '@env'

import * as NavigationBar from 'expo-navigation-bar'

const PreviewMessageImage = () => {
  const { profile, user, theme } = useSelector(state => state.user)
  const { matchDetails, media } = useRoute().params
  const navigation = useNavigation()
  const video = useRef(null)

  const storage = getStorage()

  const [input, setInput] = useState('')
  const [height, setHeight] = useState(50)
  const [sendLoading, setSendLoading] = useState(false)
  const [status, setStatus] = useState({})
  const [disableButton, setDisableButton] = useState(false)

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  const focused = useIsFocused()

  if (focused) {
    NavigationBar.setBackgroundColorAsync(theme ? color.dark : color.white)
    NavigationBar.setButtonStyleAsync(theme ? 'light' : 'dark')
  }

  useEffect(() => {
    (() => {
      Keyboard.addListener('keyboardDidHide', () => Keyboard.dismiss)
    })()
  }, [])

  const sendMessage = async () => {
    if (media?.type == 'image') {
      if (profile?.coins < 100) return

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', media?.uri, true)
        xhr.send(null)
      })

      setDisableButton(true)
      setSendLoading(true)

      const mediaRef = ref(storage, `messages/${matchDetails?.id}/image/${uuid()}`)

      uploadBytes(mediaRef, blob)
        .then(snapshot => {
          getDownloadURL(snapshot?.ref)
            .then(async downloadURL => {
              await addDoc(collection(db, 'matches', matchDetails?.id, 'messages'), {
                userId: id,
                username: profile?.username,
                photoURL: matchDetails?.users[id].photoURL,
                mediaLink: snapshot?.ref?._location?.path,
                mediaType: media?.type,
                media: downloadURL,
                caption: input,
                seen: false,
                timestamp: serverTimestamp(),
              })


              setInput('')
              setSendLoading(false)
              setDisableButton(false)
              navigation.navigate('Message', { matchDetails })
              await updateDoc(doc(db, 'users', id), { coins: increment(-100) })
              await updateDoc(doc(db, 'admin', admin), { messages: increment(1) })
              await updateDoc(doc(db, 'admin', admin), { imageMessages: increment(1) })
              await updateDoc(doc(db, 'matches', matchDetails?.id), { timestamp: serverTimestamp() })
            })
        })
    }


    if (media?.type == 'video' && media?.thumbnail) {
      if (profile?.coins < 100) return

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', media?.uri, true)
        xhr.send(null)
      })

      const thumbnailBlob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', media?.thumbnail, true)
        xhr.send(null)
      })

      setDisableButton(true)
      setSendLoading(true)

      const mediaRef = ref(storage, `messages/${matchDetails?.id}/'video'/${uuid()}`)
      const thumbnailRef = ref(storage, `messages/${matchDetails?.id}/${'thumbnail'}/${uuid()}`)

      uploadBytes(mediaRef, blob)
        .then(snapshot => {
          getDownloadURL(snapshot?.ref)
            .then(downloadURL => {
              uploadBytes(thumbnailRef, thumbnailBlob)
                .then(thumbnailSnapshot => {
                  getDownloadURL(thumbnailSnapshot?.ref)
                    .then(async thumbnailDownloadURL => {
                      await addDoc(collection(db, 'matches', matchDetails?.id, 'messages'), {
                        userId: id,
                        username: profile?.username,
                        photoURL: matchDetails?.users[id].photoURL,
                        mediaLink: snapshot?.ref?._location?.path,
                        mediaType: media?.type,
                        media: downloadURL,
                        thumbnail: thumbnailDownloadURL,
                        caption: input,
                        duration: media?.duration,
                        mediaSize: {
                          width: media?.width,
                          height: media?.height
                        },
                        seen: false,
                        timestamp: serverTimestamp(),
                      })

                      setInput('')
                      setSendLoading(false)
                      setDisableButton(false)
                      navigation.navigate('Message', { matchDetails })
                      await updateDoc(doc(db, 'users', id), { coins: increment(-100) })
                      await updateDoc(doc(db, 'admin', admin), { messages: increment(1) })
                      await updateDoc(doc(db, 'admin', admin), { videoMessages: increment(1) })
                      await updateDoc(doc(db, 'matches', matchDetails?.id), { timestamp: serverTimestamp() })
                    })
                })
            })
        })
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <SafeAreaView style={[pm.safeView, { backgroundColor: theme ? color.dark : color.white }]}>
        <Bar color={theme ? 'light' : 'dark'} />
        <Header showBack showTitle title={`Preview ${media?.type}`} />

        {
          media?.type == 'image' &&
          <AutoHeightImage
            source={{ uri: media?.uri }}
            width={width}
            style={{ flex: 1 }}
            resizeMode='contain'
          />
        }

        {
          media?.type == 'video' &&
          <Pressable
            onPress={() => status?.isPlaying ? video?.current?.pauseAsync() : video?.current?.playAsync()}
            style={{ flex: 1 }}
          >
            <Video
              ref={video}
              source={{ uri: media?.uri }}
              style={{ flex: 1 }}
              resizeMode='contain'
              isLooping={true}
              onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
          </Pressable>
        }

        <View style={[pm.inputView, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
          <TextInput
            multiline
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
            placeholder='Aa..'
            placeholderTextColor={theme ? color.white : color.lightText}
            style={[pm.input, { height, color: theme ? color.white : color.dark }]}
          />

          <TouchableOpacity onPress={sendMessage} disabled={disableButton} style={pm.sendButton}>
            {
              sendLoading ?
                <ActivityIndicator color={theme ? color.white : color.lightText} size='small' /> :
                <FontAwesome5 name='paper-plane' color={theme ? color.white : color.lightText} size={20} />
            }
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default PreviewMessageImage