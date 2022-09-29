import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width, height } = Dimensions.get('window')

export const _event = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  gradient: {
    flex: 1,
    maxHeight: height - 200 / 2
  },

  main: {
    flex: 1,
    backgroundColor: color.deepBlueSea
  },

  mainView: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10
  },

  title: {
    color: color.white,
    fontSize: 45
  },

  gender: {
    color: `${color.offWhite}89`
  },

  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },

  mainText: {
    color: color.white,
    fontSize: 25
  },

  day: {
    color: `${color.offWhite}89`
  },

  location: {
    color: color.white,
    fontSize: 18
  },

  description: {
    color: color.white,
    fontSize: 16
  },

  bottomView: {
    marginTop: 10,
    backgroundColor: color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },

  bottomViewSides: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10
  },

  bottomViewSidesLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  bottomViewSidesRight: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100
  },

  avatars: {
    flexDirection: 'row',
    position: 'relative',
    marginLeft: 10
  },

  userAvatarView: {
    left: -10
  },

  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginLeft: 10
  },

  more: {
    borderWidth: 2,
    borderColor: color.white,
    backgroundColor: color.red,
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -25
  },

  moreText: {
    color: color.white,
    fontSize: 16
  },

  progressSpace: {
    fontSize: 16,
    marginRight: 5,
    color: color.red
  },

  notInProgressSpace: {
    fontSize: 16,
    marginRight: 5,
    color: color.lightText
  },

  progress: {
    fontSize: 16,
    color: color.red
  },

  notInProgress: {
    fontSize: 16,
    color: color.lightText
  },

  joinButton: {
    height: 50,
    borderRadius: 12,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  joinButtonText: {
    color: color.white,
    fontSize: 20
  },
  
  joinButtonTextInactive: {
    color: color.dark,
    fontSize: 20
  },
})