import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width, height } = Dimensions.get('window')

export const reels = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  listContainer: {
    flex: 1,
    overflow: 'hidden'
  },

  videoContainer: {
    flex: 1,
    width,
    height: height - 108,
    backgroundColor: color.transparent,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden'
  },

  gradientContainer: {
    position: 'absolute',
    bottom: 0,
    width,
    height: height / 3,
    zIndex: 1
  },

  captionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    marginBottom: 20,
    marginLeft: 10
  },

  captionUsername: {
    color: color.white,
    fontSize: 16
  },

  videoDescription: {
    color: color.white,
    fontSize: 16
  },

  controlersContainer: {
    marginVertical: 30,
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 20
  },

  userAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderColor: color.white,
    overflow: 'hidden',
    backgroundColor: color.faintBlack,
    justifyContent: 'center',
    alignItems: 'center'
  },

  userAvatar: {
    width: 50,
    height: 50
  },

  controleButtonContainer: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 70
  },

  commentsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },

  commentsCount: {
    color: color.white,
    marginTop: 5
  },

  likeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },

  likesCounter: {
    color: color.white,
    marginTop: 5
  }
})