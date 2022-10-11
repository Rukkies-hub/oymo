import { View, Text, Pressable, Platform, UIManager, LayoutAnimation } from 'react-native'
import React from 'react'
import { useState } from 'react'
import Avatar from './Avatar'
import { rm } from '../../../../style/room'
import OymoFont from '../../../../components/OymoFont'
import color from '../../../../style/color'
import UserInfo from './UserInfo'
import { useSelector } from 'react-redux'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) UIManager.setLayoutAnimationEnabledExperimental(true)

const RecieverMessage = ({ messages }) => {
  const { theme } = useSelector(state => state.user)
  const [showTime, setShowTime] = useState(false)
  const [numberOfLines, setNumberOfLines] = useState(10)

  return (
    <Pressable
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        setShowTime(!showTime)
        setNumberOfLines(numberOfLines == 10 ? 1000 : 10)
      }}
      delayLongPress={500}
      style={{
        flexDirection: 'row',
        marginBottom: 10
      }}
    >
      <Avatar user={messages?.userId} />
      <View style={rm.messagView}>
        <Pressable
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            setShowTime(!showTime)
            setNumberOfLines(numberOfLines == 10 ? 1000 : 10)
          }}
          delayLongPress={500}
        >
          {
            messages?.message &&
            <View>
              <View style={[rm.chatView, { backgroundColor: messages?.message ? (theme ? color.dark : color.offWhite) : color.transparent }]}>
                <UserInfo user={messages?.userId} />
                <OymoFont message={messages?.message} fontStyle={{...rm.replyMessageText, color: theme ? color.white : color.dark}} />
              </View>
              {
                messages?.timestamp &&
                <>
                  {
                    showTime &&
                      <OymoFont
                        message={new Date(messages?.timestamp?.seconds * 1000 + messages?.timestamp?.nanoseconds / 1000000).toDateString()}
                        fontStyle={{...rm.messageTimestamp, color: theme ? color.white : color.dark}}
                      />
                  }
                </>
              }
            </View>
          }
        </Pressable>
      </View>
    </Pressable>
  )
}

export default RecieverMessage