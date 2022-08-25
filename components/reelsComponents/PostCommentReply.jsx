import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { setPostCommentType, setReplyCommentProps } from '../../features/reelsSlice'

import color from '../../style/color'
import { vrc } from '../../style/reelsComment'
import OymoFont from '../OymoFont'

const PostCommentReply = ({ comment }) => {
  const dispatch = useDispatch()

  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(setPostCommentType('reply'))
        dispatch(setReplyCommentProps(comment))
      }}
      style={vrc.pcrButton}
    >
      <OymoFont message='Reply' fontStyle={{ color: color.white }} />
    </TouchableOpacity>
  )
}

export default PostCommentReply