import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { setCommentAutoFocus, setReelsCommentType, setReplyCommentProps } from '../../features/reelsSlice'

import color from '../../style/color'
import { _comments } from '../../style/reelsComment'
import OymoFont from '../OymoFont'

const ReelsCommentReply = ({ comment }) => {
  const dispatch = useDispatch()

  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(setReelsCommentType('reply'))
        dispatch(setReplyCommentProps(comment))
        dispatch(setCommentAutoFocus(true))
      }}
      style={_comments.replyCommentButton}
    >
      <OymoFont message='Reply' fontStyle={{ color: color.white }} />
    </TouchableOpacity>
  )
}

export default ReelsCommentReply