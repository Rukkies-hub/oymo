import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width, height } = Dimensions.get('window')

export const match = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  nope: {
    textAlign: 'center',
    color: color.red,
    fontFamily: 'text',
    borderWidth: 4,
    borderRadius: 20,
    borderColor: color.red,
    position: 'absolute',
    top: 0,
    right: 20,
    width: 150
  },

  match: {
    textAlign: 'center',
    color: color.lightGreen,
    fontFamily: 'text',
    borderWidth: 4,
    borderRadius: 20,
    borderColor: color.lightGreen,
    position: 'absolute',
    top: 0,
    left: 20,
    width: 160
  },

  card: {
    backgroundColor: color.transparent,
    width,
    height: height - 112,
    marginTop: -25,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden'
  },

  cardImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },

  cardGradient: {
    width: '100%',
    minHeight: 60,
    position: 'absolute',
    bottom: 0,
    padding: 20,
    marginBottom: -2
  },

  userDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  usernameButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  username: {
    fontSize: 30,
    color: color.white,
    marginBottom: 10,
    textTransform: 'capitalize'
  },

  age: {
    fontSize: 30,
    color: color.white,
    marginBottom: 10,
    marginLeft: 10
  },

  moreInfoButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },

  detailesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10
  },

  detail: {
    fontSize: 18,
    color: color.white
  },

  about: {
    color: color.white,
    fontSize: 18,
    marginTop: 10
  },

  passionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap'
  },

  passions: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    marginBottom: 10,
    marginRight: 10,
    backgroundColor: color.faintBlack
  },

  passion: {
    color: color.white,
    fontSize: 12,
    textTransform: 'capitalize'
  },

  indicator: {
    flex: 1,
    backgroundColor: color.transparent,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export const nm = StyleSheet.create({
  container: {
    flex: 1
  },

  screenGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between'
  },

  glitchView: {
    alignItems: 'center'
  },

  itis: {
    color: color.lightGreen,
    textAlign: 'center',
    marginTop: 300,
    fontSize: 30,
    textTransform: 'uppercase'
  },

  glitch: {
    color: color.lightGreen,
    fontSize: 120
  }
})