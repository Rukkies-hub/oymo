import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width } = Dimensions.get('window')

export const _rooms = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  scrollView: {
    flex: 1,
    padding: 10
  },

  bg: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden'
  },

  gradient: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-end'
  },

  title: {
    color: color.white,
    fontSize: 25
  }
})