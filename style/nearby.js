import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width, height } = Dimensions.get('window')

export const nb = StyleSheet.create({
  containr: {
    flex: 1,
    backgroundColor: color.white,
    padding: 20
  },

  scrollViewContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start'
  },

  user: {
    width: width / 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },

  avatar: {
    width: (width / 4) - 10,
    height: (width / 4) - 10,
    borderRadius: 100
  },

  text: {
    marginTop: 10,
    fontSize: 15
  }
})