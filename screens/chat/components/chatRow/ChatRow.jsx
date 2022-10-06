import React, { useState, useLayoutEffect } from 'react'
import { View, Pressable } from 'react-native'

import getMatchedUserInfo from '../../../../lib/getMatchedUserInfo'
import { useNavigation } from '@react-navigation/native'
import { db } from '../../../../hooks/firebase'
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import Avatar from './components/Avatar'
import Username from './components/Username'
import { useSelector } from 'react-redux'
import { chat } from '../../../../style/chat'
import color from '../../../../style/color'
import OymoFont from '../../../../components/OymoFont'

const ChatRow = ({ matchDetails }) => {
  const { user, profile } = useSelector(state => state.user)
  const navigation = useNavigation()

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  const [matchedUserInfo, setMatchedUserInfo] = useState(null)
  const [lastMessage, setLastMessage] = useState('')
  const [unreadMessage, setUnreadMessage] = useState([])

  useLayoutEffect(() => {
    (() => {
      setMatchedUserInfo(getMatchedUserInfo(matchDetails?.users, id))
    })()
  }, [matchDetails])

  useLayoutEffect(() => {
    (() => {
      onSnapshot(query(collection(db, 'matches', matchDetails?.id, 'messages'),
        orderBy('timestamp', 'desc')),
        limit(1),
        snapshot =>
          setLastMessage(
            snapshot?.docs[0]?.data()?.voiceNote ?
              matchedUserInfo?.username == undefined ?
                'Voice note...' :
                `${matchedUserInfo?.username} Sent you a voice note...` :
              snapshot?.docs[0]?.data()?.mediaType == 'video' ?
                `${snapshot?.docs[0]?.data()?.username != profile?.username ? snapshot?.docs[0]?.data().username : 'You'} ${snapshot?.docs[0]?.data()?.username == profile?.username ? 'sent a video' : 'Sent you a video'}...` :
                snapshot?.docs[0]?.data()?.mediaType == 'image' ?
                  `${snapshot?.docs[0]?.data()?.username != profile?.username ? snapshot?.docs[0]?.data().username : 'You'} ${snapshot?.docs[0]?.data()?.username == profile?.username ? 'sent an image' : 'Sent you an image'}...` :
                  snapshot?.docs[0]?.data()?.message || snapshot?.docs[0]?.data()?.caption
          )
      )
    })()
  }, [matchDetails, db])

  useLayoutEffect(() => {
    (async () => {
      onSnapshot(query(collection(db, 'matches', matchDetails?.id, 'messages'),
        where('userId', '!=', id),
        where('seen', '==', false)
      ),
        snapshot => {
          setUnreadMessage(
            snapshot?.docs?.map(doc => ({
              id: doc?.id
            }))
          )
        })
    })()
  }, [db])

  return (
    <Pressable onPress={() => navigation.navigate('Message', { matchDetails })} style={chat.chatRow}>
      <View style={chat.chatRowView}>
        <View style={{ position: 'relative' }}>
          <View
            style={{
              borderWidth: unreadMessage?.length > 0 ? 2 : 0,
              borderColor: unreadMessage?.length > 0 ? color.red : null,
              borderRadius: 100
            }}
          >
            {
              matchedUserInfo &&
              <Avatar user={matchedUserInfo?.id} />
            }
          </View>
          {
            unreadMessage?.length > 0 &&
            <View style={chat.unreadMessageView}>
              <OymoFont message={unreadMessage?.length} fontStyle={chat.unreadMessageViewText} />
            </View>
          }
        </View>
        {
          matchedUserInfo &&
          <View style={chat.chatInfoView}>
            <Username user={matchedUserInfo?.id} />
            <OymoFont message={lastMessage || 'Say Hi!'} fontStyle={chat.lastMessage} />
          </View>
        }
      </View>
    </Pressable>
  )
}

export default ChatRow