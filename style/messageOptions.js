import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width } = Dimensions.get('window')

export const mo = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },

  goBack: {
    flex: 1,
    width: '100%'
  },

  optionsView: {
    minWidth: width,
    backgroundColor: color.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },

  replyButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.offWhite,
    borderRadius: 12
  },

  deleteButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.offWhite,
    borderRadius: 12,
    marginTop: 10
  }
})