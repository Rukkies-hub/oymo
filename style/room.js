import { StyleSheet } from 'react-native'
import color from './color'

export const msg = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    borderRadius: 8,
    overflow: 'hidden'
  },

  messageBackground: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden'
  },

  emptyMessageView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  emptyMessageViewAvatar: {
    width: 100,
    height: 100,
    borderRadius: 100
  },

  emptyMessageViewAvatarMiniView: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: color.offWhite,
    borderRadius: 100,
    overflow: 'hidden',
    position: 'absolute',
    top: -10,
    right: -10,
    shadowColor: color.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8
  },

  emptyMessageViewAvatarMini: {
    width: 40,
    height: 40,
    borderRadius: 100
  },

  emptyMessageViewText1: {
    marginTop: 20,
    fontFamily: 'text',
    fontSize: 16,
    color: color.dark
  },

  messagesFlatlist: {
    flex: 1,
    paddingHorizontal: 10
  },

  messageReply: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: color.offWhite,
    marginTop: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    padding: 5
  },

  messageReplyView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: color.white,
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 5
  },

  messageReplyImage: {
    width: 50,
    height: 50,
    borderRadius: 6
  },

  messageReplyVoicenote: {
    flex: 1,
    position: 'relative',
    height: 35,
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    paddingLeft: 10
  },

  messageReplyVoicenoteButton: {
    backgroundColor: color.faintBlue,
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  canselMessageReply: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12
  }
})

export const iv = StyleSheet.create({
  inputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.offWhite,
    minHeight: 50,
    position: 'relative',
    marginHorizontal: 10,
    borderRadius: 12,
    marginBottom: 10,
  },

  visibleMediaView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  mediaButton: {
    width: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  recordingView: {
    flex: 1,
    width: '100%',
    height: '100%',
    maxHeight: 70,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  recordingText: {
    fontSize: 18,
    fontFamily: 'text',
    color: color.lightText
  },

  messageInput: {
    fontSize: 18,
    flex: 1,
    maxHeight: 70,
    fontFamily: 'text',
    color: color.dark,
    paddingLeft: 10
  },

  sendButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  recordingButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export const sm = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    marginBottom: 10
  },

  messagView: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginRight: 5
  },

  replyView: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  messageReplyMediaTouchableOpacity: {
    padding: 5,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: color.darkBlue,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'hidden'
  },

  messageReplyMedia: {
    width: 50,
    height: 50,
    borderRadius: 8
  },

  messageReplyVoicenoteView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  replyMessageText: {
    color: color.white,
    fontSize: 16,
    textAlign: 'left'
  },

  chatView: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 12
  },

  messageText: {
    color: color.white,
    fontSize: 16,
    textAlign: 'left'
  },

  messageTimestampView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },

  messageTimestamp: {
    color: color.dark,
    fontSize: 8,
    textAlign: 'right',
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10
  },

  messagSeenText: {
    color: color.dark,
    fontSize: 8,
    textAlign: 'right',
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10
  },

  messageMediaView: {
    position: 'relative',
    borderRadius: 20,
    backgroundColor: color.blue,
    overflow: 'hidden'
  },

  messageMediaImage: {
    minWidth: 250,
    minHeight: 250,
    borderRadius: 20
  },

  thumbnailPlaceholdr: {
    minWidth: 250,
    minHeight: 250,
    borderRadius: 20,
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center'
  },

  playView: {
    backgroundColor: color.faintBlack,
    width: 70,
    height: 70,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },

  messageMediaCaptionView: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 5,
    margin: 5,
    backgroundColor: color.darkBlue,
    borderRadius: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },

  mediaCaption: {
    color: color.white,
    fontSize: 16,
    textAlign: 'left'
  },

  messageMediaViewVoicenote: {
    position: 'relative',
    width: 200,
    height: 35,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: color.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    paddingLeft: 10
  },

  playMessagVoicenoteButton: {
    backgroundColor: color.white,
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export const rm = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    marginBottom: 10
  },

  avatar: {
    width: 25,
    height: 25,
    borderRadius: 50
  },

  messagView: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginLeft: 10
  },

  replyView: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12
  },

  messageReplyMediaTouchableOpacity: {
    padding: 5,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'hidden'
  },

  messageReplyMedia: {
    width: 50,
    height: 50,
    borderRadius: 8
  },

  messageReplyVoicenoteView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  replyMessageText: {
    color: color.dark,
    fontSize: 16,
    textAlign: 'left'
  },

  chatView: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopRightRadius: 12
  },

  messageText: {
    color: color.white,
    fontSize: 16,
    textAlign: 'left'
  },

  messageTimestampView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },

  messageTimestamp: {
    color: color.dark,
    fontSize: 8,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 10
  },

  messagSeenText: {
    color: color.dark,
    fontSize: 8,
    textAlign: 'right',
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10
  },

  messageMediaView: {
    position: 'relative',
    borderRadius: 20,
    backgroundColor: color.offWhite,
    overflow: 'hidden'
  },

  messageMediaImage: {
    minWidth: 250,
    minHeight: 250,
    borderRadius: 20
  },

  thumbnailPlaceholdr: {
    minWidth: 250,
    minHeight: 250,
    borderRadius: 20,
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center'
  },

  playView: {
    backgroundColor: color.faintBlack,
    width: 70,
    height: 70,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },

  messageMediaCaptionView: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 5,
    margin: 5,
    backgroundColor: color.white,
    borderRadius: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },

  mediaCaption: {
    color: color.dark,
    fontSize: 16,
    textAlign: 'left'
  },

  messageMediaViewVoicenote: {
    position: 'relative',
    width: 200,
    height: 35,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: color.offWhite,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    paddingLeft: 10
  },

  playMessagVoicenoteButton: {
    backgroundColor: color.blue,
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
})