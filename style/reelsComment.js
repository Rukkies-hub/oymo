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
  }
})