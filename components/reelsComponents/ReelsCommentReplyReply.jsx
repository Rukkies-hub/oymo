import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { setReelsCommentType, setReplyCommentProps } from '../../features/reelsSlice'
import color from '../../style/color'
import OymoFont from '../OymoFont'

const ReelsCommentReplyReply = ({ reply }) => {
  const dispatch = useDispatch()

  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(setReelsCommentType('replyReply'))
        dispatch(setReplyCommentProps(reply))
      }}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 2
      }}
    >
      <OymoFont message='Reply' fontStyle={{ color: color.white }} />
    </TouchableOpacity>
  )
}

export default ReelsCommentReplyReply