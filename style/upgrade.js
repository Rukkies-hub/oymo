import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width } = Dimensions.get('window')

export const ug = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.transparent,
    position: 'relative'
  },

  goBack: {
    flex: 1
  },

  main: {
    backgroundColor: color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },

  head: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 20
  },

  star: {
    width: 120,
    height: 120
  },

  ht1: {
    fontSize: 20,
    marginTop: 10,
    color: color.dark
  },

  ht2: {
    fontFamily: 'text',
    textAlign: 'center',
    marginTop: 10,
    color: color.dark
  },

  suscriptionButton: {
    backgroundColor: color.black,
    margin: 10,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12
  },

  suscriptionButtonText: {
    color: color.white,
    fontSize: 16
  }
})