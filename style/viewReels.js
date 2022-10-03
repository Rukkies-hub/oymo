import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width, height } = Dimensions.get('window')

export const reels = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center'
  },

  goBackButton: {
    position: 'absolute',
    top: 60,
    left: 0,
    marginHorizontal: 30,
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.faintBlack,
    zIndex: 1
  },

  videoContainer: {
    flex: 1,
    width,
    backgroundColor: color.transparent
  },

  gradietContainer: {
    position: 'absolute',
    bottom: 0,
    width,
    minHeight: 100,
    zIndex: 1
  },

  userInfoView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    marginBottom: 20,
    marginLeft: 10
  },

  reelsInfoText: {
    color: color.white,
    fontSize: 16
  },

  userInfoUsername: {
    color: color.white,
    fontSize: 14
  },

  contolesView: {
    marginVertical: 30,
    position: 'absolute',
    right: 0,
    bottom: height / 5,
    margin: 20,
    backgroundColor: color.faintBlack,
    borderRadius: 50
  },

  avatarButton: {
    width: 50,
    height: 50,
    borderWidth: 4,
    borderRadius: 100,
    borderColor: color.white,
    overflow: 'hidden'
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50
  },

  contoles: {
    paddingVertical: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },

  commentButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },

  commentButtonText: {
    color: color.white,
    marginTop: 5
  }
})