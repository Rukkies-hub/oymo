import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width } = Dimensions.get('window')

export const likes = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  setupView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  setupViewSub: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 20,
    minHeight: 10,
    backgroundColor: color.white,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    alignSelf: 'center'
  },

  cp: {
    fontSize: 20,
    marginBottom: 20
  },

  ep: {
    width: '100%',
    height: 40,
    backgroundColor: color.red,
    marginTop: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },

  nav: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: color.borderColor
  },

  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  likesContainer: {
    flex: 1,
    backgroundColor: color.white,
    padding: 10
  },

  likesListContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },

  rightView: {
    flex: 1,
    marginLeft: 10
  },

  aboutText: {
    fontFamily: 'text',
    color: color.dark
  },

  infoContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  infoView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10
  },

  infoText: {
    fontSize: 14,
    color: color.dark,
    marginLeft: 5
  },

  controlesView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10
  },

  nopeButton: {
    backgroundColor: color.offWhite,
    paddingHorizontal: 10,
    height: 35,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },

  matchButon: {
    backgroundColor: color.goldDark,
    paddingHorizontal: 10,
    height: 35,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },

  loading: {
    flex: 1,
    backgroundColor: color.transparent,
    justifyContent: 'center',
    alignItems: 'center'
  },

  avatar: {
    maxHeight: 250,
    borderRadius: 12
  },

  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.offWhite
  },

  username: {
    fontSize: 20,
    color: color.dark
  }
})