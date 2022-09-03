import { StyleSheet } from "react-native"
import color from "./color"

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
  }
})