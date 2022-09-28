import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width } = Dimensions.get('window')

export const events = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    position: 'relative'
  },

  fab: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: color.red,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100
  },

  cardList: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10
  },

  card: {
    flex: 1,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10
  },

  gradient: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-end'
  },

  title: {
    color: color.white,
    fontSize: 25
  },

  description: {
    color: color.white,
    fontSize: 16
  }
})

export const create = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.faintBlack
  },

  imgBg: {
    padding: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },

  profileDetailes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 100
  },

  blurView: {
    width: 80,
    height: 80,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.offWhite
  },

  eventInfoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    borderRadius: 12,
    marginLeft: 10
  },

  title: {
    color: color.white,
    fontSize: 20
  },

  location: {
    color: color.white
  },

  scroll: {
    flex: 1,
    backgroundColor: color.white
  },

  input: {
    marginHorizontal: 10,
    marginTop: 10,
    height: 45,
    flex: 1,
    backgroundColor: color.offWhite,
    borderRadius: 12,
    padding: 10,
    fontFamily: 'text'
  },

  dateView: {
    flexDirection: 'row',
    marginTop: 10
  },

  dateInputView: {
    padding: 10,
    flex: 1
  },

  dateInput: {
    marginTop: 5,
    height: 45,
    flex: 1,
    backgroundColor: color.offWhite,
    borderRadius: 12,
    padding: 10,
    fontFamily: 'text'
  },

  save: {
    marginHorizontal: 10,
    backgroundColor: color.red,
    flex: 1,
    maxHeight: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },

  saveText: {
    color: color.white
  }
})