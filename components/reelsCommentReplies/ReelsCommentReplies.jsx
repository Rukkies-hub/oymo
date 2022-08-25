import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import color from '../../style/color'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Octicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { rcr } from '../../style/reelsComment'
import UserAvatar from './components/UserAvatar'
import UserInfo from './components/UserInfo'
import Reply from './components/Reply'
import LikeReelsReply from '../reelsComponents/LikeReelsReply'
import ReelsCommentReplyReply from '../reelsComponents/ReelsCommentReplyReply'

const ReelsCommentReplies = ({ comment, background }) => {
  const navigation = useNavigation()
  const route = useRoute()

  const { user } = useSelector(state => state.user)
  const { showExpand } = useSelector(state => state.reels)

  const [replies, setReplies] = useState([])

  useEffect(() => {
    const unsub = (() => {
      onSnapshot(query(collection(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'replies'), orderBy('timestamp', 'asc')),
        snapshot =>
          setReplies(
            snapshot?.docs?.map(doc => ({
              id: doc?.id,
              ...doc?.data()
            }))
          )
      )
    })()
    return unsub
  }, [user, db])

  return (
    <View style={{ marginTop: 10 }}>
      <FlatList
        data={replies?.splice(0, 1)}
        keyExtractor={item => item?.id}
        style={{ flex: 1 }}
        renderItem={({ item: reply }) =>
          <View style={rcr.flatList}>
            <UserAvatar _user={reply?.user?.id} />
            <View>
              <View style={rcr.infoContainer}>
                <UserInfo _user={reply?.user?.id} />
                <View style={rcr.replyContainer}>
                  <Reply _user={reply?.reelComment?.user?.id} reply={reply?.reply} />
                </View>
              </View>

              {
                route.name != 'ReelsComment' &&
                <View style={rcr.rcContainer}>
                  <LikeReelsReply reply={reply} />
                  <ReelsCommentReplyReply reply={reply} />
                </View>
              }

              {
                showExpand &&
                <TouchableOpacity
                  onPress={() => navigation.navigate('ViewReelsComments', { comment, background })}
                  style={rcr.showReplyExpand}
                >
                  <Octicons name='reply' size={18} color={color.white} />
                  <Text style={rcr.showReplyExpandText}>
                    {replies?.length} {replies?.length > 1 ? 'Replies' : 'Reply'}
                  </Text>
                </TouchableOpacity>
              }
            </View>
          </View>
        }
      />
    </View>
  )
}

export default ReelsCommentReplies