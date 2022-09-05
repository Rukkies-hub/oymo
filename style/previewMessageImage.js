import { Dimensions, StyleSheet } from "react-native"
import color from "./color"

const { width } = Dimensions.get('window')

export const pm = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: color.transparent
  },

  inputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: color.offWhite,
    minHeight: 50,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: 10,
    borderRadius: 12,
    marginVertical: 15
  },

  input: {
    fontSize: 18,
    flex: 1,
    maxHeight: 70,
    color: color.dark
  },

  sendButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
})