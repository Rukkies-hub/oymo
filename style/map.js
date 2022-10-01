import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width, height } = Dimensions.get('window')

export const map = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  map: {
    width,
    height
  },
})