import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width, height } = Dimensions.get('window')

export const dob = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.faintBlack,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },

  goBackButton: {
    flex: 1,
    width: '100%'
  },

  sheet: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    backgroundColor: color.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },

  warning: {
    color: color.red,
    fontSize: 30
  },

  caption: {
    marginTop: 10,
    color: color.dark
  },

  mainDate: {
    marginTop: 5,
    fontSize: 20,
    color: color.dark
  },

  calender: {
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  upload: {
    width: '100%',
    height: 45,
    backgroundColor: color.red,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },

  uploadText: {
    color: color.white
  }
})