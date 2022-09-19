import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

export const login = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: Dimensions.get('window').width
  },

  KeyboardView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  heading: {
    width: '100%',
    alignItems: 'flex-start'
  },

  headingText: {
    color: color.white,
    fontSize: 40
  },

  headingSubText: {
    fontSize: 16,
    color: color.white
  },

  inputView: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.lightBorderColor,
    borderRadius: 12,
    overflow: 'hidden'
  },

  input: {
    flex: 1,
    fontFamily: 'text',
    color: color.white
  },

  errorText: {
    color: color.red,
    marginHorizontal: 20,
  },

  passwordView: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.lightBorderColor,
    borderRadius: 12,
    marginTop: 20,
    overflow: 'hidden'
  },

  peekButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center'
  },

  authButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },

  authButton: {
    flex: 1,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },

  googleLoginButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.white,
    borderRadius: 12,
    marginLeft: 20
    // flex: 1,
    // height: 50,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: color.white,
    // borderRadius: 12
  },

  googleImage: {
    width: 25,
    height: 25
  },

  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },

  buttomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  }
})