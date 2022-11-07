import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width } = Dimensions.get('window')

export const nav = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  barStyle: {
    backgroundColor: color.white,
    height: 54,
    elevation: 0
  },

  paidImageContainer: {
    position: 'absolute',
    zIndex: 1,
    top: -4,
    right: -4,
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: color.offWhite,
    justifyContent: 'center',
    alignItems: 'center'
  },

  paidImage: {
    width: 10,
    height: 10
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 50
  },

  image: {
    width: 25,
    height: 25
  },

  drawerContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },

  drawerView: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    width: width / 1.5
  },

  headDetails: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },

  avatarPlaceholderView: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center'
  },

  mainAvatar: {
    width: 100,
    height: 100,
    borderRadius: 100
  },

  pointsButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  pointsImage: {
    width: 25,
    height: 25,
    marginRight: 5
  },

  usernameButton: {
    flexDirection: 'row',
    marginTop: 15
  },

  username: {
    fontSize: 20,
    marginRight: 10,
    color: color.white
  },

  coin: {
    color: color.white,
    fontSize: 16
  },

  age: {
    fontSize: 20,
    color: color.white
  },

  divider: {
    backgroundColor: color.white,
    height: 0.5,
    width: width / 1.6,
    marginVertical: 20
  },

  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: color.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  }
})