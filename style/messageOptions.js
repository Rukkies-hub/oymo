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
  },

  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 100,
    alignSelf: 'center'
  },

  username: {
    color: color.white,
    fontSize: 20,
    textAlign: 'left',
    marginLeft: 10
  },

  distance: {
    color: color.white,
    textAlign: 'left',
    marginLeft: 10
  },

  userDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20
  }
})