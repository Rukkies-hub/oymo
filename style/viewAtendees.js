import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width, height } = Dimensions.get('window')

export const va = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.faintBlack,
    justifyContent: 'flex-end'
  },

  mainView: {
    backgroundColor: color.white,
    minHeight: 55,
    maxHeight: height - 50,
    width,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },

  nav: {
    width,
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
  },

  image: {
    width: 40,
    height: 40,
    borderRadius: 50
  },

  closeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5
  },

  closeButtonText: {
    color: color.red
  },

  cardList: {
    margin: 10
  }
})

export const cl = StyleSheet.create({
  card: {
    height: 60,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: color.offWhite,
    overflow: 'hidden',
    marginBottom: 10
  },

  left: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  userAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderColor: color.white,
    overflow: 'hidden',
    backgroundColor: color.faintBlack,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },

  userAvatar: {
    width: 50,
    height: 50
  },

  captionUsername: {
    color: color.dark,
    fontSize: 16
  },

  userLocation: {
    color: color.lightText
  }
})