import { Dimensions, StyleSheet } from "react-native"
import color from "./color"

const { width } = Dimensions.get('window')

export const rc = StyleSheet.create({
  container: {
    flex: 1
  },

  headerView: {
    marginTop: 30,
    height: 40,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10
  },

  goBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },

  headerInfoView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  headerCommentsCount: {
    fontSize: 16,
    color: color.white
  },

  headerCommentsCountText: {
    fontSize: 16,
    color: color.white,
    marginLeft: 10
  },

  viewReelsCommentsButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10
  },

  viewReelsCommentsButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: color.white
  }
})

export const _comments = StyleSheet.create({
  flatList: {
    flex: 1,
    marginHorizontal: 10
  },

  flatListRenderItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 10
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 50
  },

  avatarPlaceholderView: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: color.faintBlack,
    justifyContent: 'center',
    alignItems: 'center'
  },

  commentContainer: {
    maxWidth: width - 50,
    alignItems: 'flex-start'
  },

  commentShell: {
    marginLeft: 10,
    backgroundColor: color.lightBorderColor,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  commentUserInfo: {
    color: color.white,
    fontSize: 14
  },

  comment: {
    color: color.white,
    fontSize: 14
  },

  commentBottom: {
    width: '100%',
    paddingHorizontal: 10
  },

  commentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 4
  },

  likeComment: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  likeCommentCounter: {
    marginRight: 3
  },

  replyCommentButton: {
    paddingHorizontal: 10,
    paddingVertical: 2
  }
})

export const rcr = StyleSheet.create({
  flatList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10
  },

  avatar: {
    width: 25,
    height: 25,
    borderRadius: 50
  },

  avatarPlaceholderView: {
    width: 25,
    height: 25,
    borderRadius: 50,
    backgroundColor: color.faintBlack,
    justifyContent: 'center',
    alignItems: 'center'
  },

  infoContainer: {
    marginLeft: 10,
    backgroundColor: color.lightBorderColor,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  infoUsername: {
    color: color.white,
    fontSize: 14
  },

  replyContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },

  rcContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  likeReelsReply: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  showReplyExpand: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10
  },

  showReplyExpandText: {
    marginLeft: 5,
    fontSize: 14,
    color: color.white
  }
})

export const ci = StyleSheet.create({
  emojiView: {
    paddingHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  inputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: color.white,
    minHeight: 50,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: 10,
    borderRadius: 12,
    marginBottom: 10
  },

  input: {
    fontSize: 18,
    flex: 1,
    minHeight: 50,
    maxHeight: 150,
    fontFamily: 'text',
    color: color.dark,
    paddingRight: 40 + 50,
    paddingVertical: 5
  },

  sendButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0
  }
})

export const vrc = StyleSheet.create({
  headView: {
    marginTop: 30,
    height: 40,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },

  commentsCountView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  commentsCount: {
    fontSize: 16,
    color: color.white
  },

  commentsCountText: {
    fontSize: 16,
    color: color.white,
    marginLeft: 10
  },

  scrollViewMainView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 10,
    paddingHorizontal: 10
  },

  avatar: {
    width: 25,
    height: 25,
    borderRadius: 50
  },

  avatarPlaceholderView: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: color.faintBlack,
    justifyContent: 'center',
    alignItems: 'center'
  },

  commentContainer: {
    width: '100%',
    alignItems: 'flex-start'
  },

  replyContainer: {
    marginLeft: 10,
    backgroundColor: color.lightBorderColor,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    maxWidth: width - 55
  },

  commentControlerView: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 5
  },

  commentControlerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 4
  },

  vrclcContainer: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  pcrButton: {
    paddingHorizontal: 10,
    paddingVertical: 2
  },

  vrcrContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10
  },

  replyInfoContainer: {
    marginLeft: 10,
    backgroundColor: color.lightBorderColor,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  infoUsername: {
    color: color.white,
    fontSize: 14
  },

  replyShell: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    maxWidth: width - 120
  },

  commentActions: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
})