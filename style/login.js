import { Dimensions, StyleSheet } from "react-native"
import color from "./color"

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

  signupButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },

  googleLoginButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.white,
    borderRadius: 12
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
  }
})