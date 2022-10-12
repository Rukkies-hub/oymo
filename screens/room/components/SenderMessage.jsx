import { View, Pressable, Platform, UIManager, LayoutAnimation } from 'react-native'
import React, { useState } from 'react'
import { sm } from '../../../style/room'
import OymoFont from '../../../components/OymoFont'
import color from '../../../style/color'
import { useSelector } from 'react-redux'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) UIManager.setLayoutAnimationEnabledExperimental(true)

const SenderMessage = ({ messages }) => {
  const { theme } = useSelector(state => state.user)
  const [numberOfLines, setNumberOfLines] = useState(10)
  const [showTime, setShowTime] = useState(false)

  return (
    <Pressable
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        setShowTime(!showTime)
        setNumberOfLines(numberOfLines == 10 ? 1000 : 10)
      }}
      delayLongPress={500}
      style={sm.container}
    >
      <View style={sm.messagView}>
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
              <View style={[sm.chatView, { backgroundColor: messages?.message ? color.blue : color.transparent }]}>
                <OymoFont message={messages?.message} fontStyle={sm.messageText} />
              </View>
              {
                messages?.timestamp &&
                <>
                  {
                    showTime &&
                    <View style={sm.messageTimestampView}>
                      <OymoFont
                        message={new Date(messages?.timestamp?.seconds * 1000 + messages?.timestamp?.nanoseconds / 1000000).toDateString()}
                        fontStyle={{ ...sm.messageTimestamp, color: theme ? color.white : color.dark }}
                      />
                    </View>
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

export default SenderMessage