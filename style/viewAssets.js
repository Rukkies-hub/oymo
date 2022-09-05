import { Dimensions, StyleSheet } from "react-native"
import color from "./color"

const { width } = Dimensions.get('window')

export const img = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export const vid = StyleSheet.create({
  background: {
    backgroundColor: color.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
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

  poster: {
    resizeMode: 'contain',
    height: '100%',
    overflow: 'hidden'
  },

  video: {
    flex: 1,
    minWidth: width,
    minHeight: 300
  }
})