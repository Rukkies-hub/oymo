import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width, height } = Dimensions.get('window')

export const up = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  goBack: {
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    top: 40,
    left: 20,
    backgroundColor: color.faintBlack
  },

  photoURL: {
    flex: 1
  },

  gradient: {
    width,
    height: (height / 2) + 60,
    position: 'relative',
    justifyContent: 'flex-end'
  },

  stats: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end'
  },

  statsCol: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  mainStat: {
    color: color.white,
    fontSize: 25
  },

  subStat: {
    color: color.white
  },

  bottom: {
    height: (height / 2) + 130,
    marginTop: -130
  },

  sheet: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden'
  },

  detailesView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 100,
    paddingHorizontal: 30

  },

  username: {
    fontSize: 20
  },

  right: {
    flexDirection: 'row'
  },

  aboutView: {
    paddingHorizontal: 20,
    marginTop: 10
  },

  heading: {
    fontSize: 16
  },

  subText: {
    marginTop: 10
  },

  infoListContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  infoList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10
  },

  title: {
    fontSize: 14,
    color: color.dark
  },

  info: {
    fontSize: 14,
    color: color.dark,
    marginLeft: 5
  }
})