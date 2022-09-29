import { View, Text, ImageBackground, KeyboardAvoidingView, Image, FlatList, Keyboard, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { iv, msg } from '../../style/room'
import MessageHeader from './components/MessageHeader'
import { useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import OymoFont from '../../components/OymoFont'
import Avatar from './components/Avatar'
import SenderMessage from './components/SenderMessage'
import RecieverMessage from './components/recieverMessage/RecieverMessage'
import color from '../../style/color'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import { addDoc, collection, doc, increment, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { useLayoutEffect } from 'react'

const Room = () => {
  const { room } = useRoute().params
  const navigation = useNavigation()
  const { user, profile } = useSelector(state => state.user)
  const { messageReply } = useSelector(state => state.message)

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [height, setHeight] = useState(50)

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  useLayoutEffect(() =>
    (() => {
      onSnapshot(query(collection(db, 'rooms', room?.id, 'messages'), orderBy('timestamp', 'desc')),
        snapshot =>
          setMessages(snapshot?.docs?.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
          )
      )
    })()
    , [room, db])

  const sendMessage = async () => {
    if (profile?.coins < 1) return
    if (input != '') {
      await addDoc(collection(db, 'rooms', room?.id, 'messages'), {
        userId: id,
        message: input,
        timestamp: serverTimestamp()
      })
      setInput('')
      await updateDoc(doc(db, 'users', id), { coins: increment(-1) })
    }
  }

  return (
    <View style={msg.container}>
      <MessageHeader room={room} />

      <ImageBackground source={require('../../assets/chatBG.png')} style={msg.messageBackground}>
        <BlurView intensity={110} tint='light' style={msg.messageBackground}>
          <KeyboardAvoidingView style={{ flex: 1 }}>
            {
              !messages.length ?
                <View style={msg.emptyMessageView}>
                  <View style={{ position: 'relative' }}>
                    <Avatar room={room} />
                    <View style={msg.emptyMessageViewAvatarMiniView}>
                      <Image source={{ uri: profile?.photoURL }} style={msg.emptyMessageViewAvatarMini} />
                    </View>
                  </View>
                </View> :
                <FlatList
                  inverted={-1}
                  style={msg.messagesFlatlist}
                  data={messages}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item?.id}
                  renderItem={({ item: message }) => (
                    message?.userId === id ?
                      <SenderMessage key={message?.id} messages={message} /> :
                      <RecieverMessage key={message?.id} messages={message} />
                  )}
                />
            }

            <View
              style={[
                iv.inputView,
                {
                  borderTopLeftRadius: messageReply ? 0 : 12,
                  borderTopRightRadius: messageReply ? 0 : 12,
                }]
              }
            >
              <TextInput
                multiline
                value={input}
                onChangeText={setInput}
                onSubmitEditing={sendMessage}
                onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
                placeholder='Aa..'
                placeholderTextColor={color.lightText}
                style={[iv.messageInput, { height }]}
              />

              <TouchableOpacity onPress={sendMessage} style={iv.sendButton}>
                <FontAwesome5 name='paper-plane' color={color.lightText} size={20} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </BlurView>
      </ImageBackground>
    </View>
  )
}

export default Room