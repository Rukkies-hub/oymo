import { Dimensions, StyleSheet } from "react-native"
import color from "./color"

const { width, height } = Dimensions.get('window')

export const reels = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  listContainer: {
    flex: 1,
    overflow: 'hidden'
  },

  videoContainer: {
    flex: 1,
    width,
    height: height - 108,
    backgroundColor: color.transparent,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden'
  },

  controlersContainer: {
    position: 'absolute',
    bottom: 0,
    width,
    height: height / 3,
    zIndex: 1
  },

  captionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    marginBottom: 20,
    marginLeft: 10
  },

  captionUsername: {
    color: color.white,
    fontSize: 16
  }
})