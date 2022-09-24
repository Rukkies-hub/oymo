import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width } = Dimensions.get('window')

export const dw = StyleSheet.create({
  imgBg: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40
  },

  avatarView: {
    width: 100,
    height: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.faintBlack,
    position: 'relative'
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100
  },

  scrollView: {
    flex: 1
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  logoutButton: {
    flex: 1,
    marginTop: 30,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.red,
    borderRadius: 12,
    height: 45,
    marginHorizontal: 18
  },

  logoutButtonText: {
    color: color.white,
    marginLeft: 10
  },
})