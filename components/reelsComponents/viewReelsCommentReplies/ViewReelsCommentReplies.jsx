import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native'

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

import { db } from '../../../hooks/firebase'

import color from '../../../style/color'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { vrc } from '../../../style/reelsComment'
import UserAvatar from './components/UserAvatar'
import UserInfo from './components/UserInfo'
import OymoFont from '../../OymoFont'
import LikeReelsReply from '../LikeReelsReply'
import ReelsCommentReplyReply from '../ReelsCommentReplyReply'
const { width } = Dimensions.get('window')

const ViewReelsCommentReplies = ({ comment, screen }) => {
  const { user, profile } = useSelector(state => state.user)
  const { showExpand } = useSelector(state => state.reels)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()

  const [replies, setReplies] = useState([])

  useEffect(() => {
    (() => {
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
  }, [user, db])

  return (
    <View style={{ marginTop: 10 }}>
      <FlatList
        data={replies}
        keyExtractor={item => item?.id}
        style={{ flex: 1 }}
        renderItem={({ item: reply }) =>
          <View style={vrc.vrcrContainer}>
            <UserAvatar _user={reply?.user?.id} />
            <View>
              <View style={vrc.replyInfoContainer}>
                <UserInfo _user={reply?.user?.id} />
                <View style={{ flexDirection: 'row' }}>
                  <View style={vrc.replyShell}>
                    <UserInfo _user={reply?.reelComment?.user?.id} />
                    <OymoFont message={reply?.reply} fontStyle={{ color: color.white }} />
                  </View>
                </View>
              </View>

              <View style={vrc.commentActions}>
                <LikeReelsReply reply={reply} screen={screen} />
                <ReelsCommentReplyReply comment={reply} />
              </View>
            </View>
          </View>
        }
      />
    </View>
  )
}

export default ViewReelsCommentReplies