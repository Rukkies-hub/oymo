import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width, height } = Dimensions.get('window')

export const settings = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: color.white
  },

  settingView: {
    paddingHorizontal: 10
  },

  settingViewHead: {
    color: color.red
  },

  settingViewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  }
})