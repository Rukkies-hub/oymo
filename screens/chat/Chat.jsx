import React from 'react'
import { View, SafeAreaView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { chat } from '../../style/chat'
import OymoFont from '../../components/OymoFont'
import SearchChat from './components/SearchChat'
import ChatList from './components/ChatList'

const Chat = () => {
  const navigation = useNavigation()
  const { profile } = useSelector(state => state.user)

  return (
    <SafeAreaView style={chat.container}>
      {
        !profile &&
        <View style={chat.setupContainr}>
          <OymoFont message='Creat a profile' fontStyle={chat.setupTitle} fontFamily='montserrat_bold' />
          <OymoFont message='You do not have a profile' fontStyle={chat.setupTitleSub} />
          <OymoFont message='Please create a profile to perform any action' fontStyle={chat.setupTitleSub} />

          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={chat.setupButton}>
            <OymoFont message='Create a profile' fontStyle={chat.setupButtonText} />
          </TouchableOpacity>
        </View>
      }

      {
        profile &&
        <>
          <SearchChat />
          <ChatList />
        </>
      }
    </SafeAreaView>
  )
}

export default Chat