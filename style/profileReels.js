import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width } = Dimensions.get('window')

export const pReels = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.transparent
  },

  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 50,
    backgroundColor: color.white
  },

  listFooterComponent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50
  },

  reelsList: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 10
  },

  reelsThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 10
  },

  desctiption: {
    color: color.black,
    fontSize: 15
  },

  username: {
    color: color.dark,
    fontSize: 13
  },

  statsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  },

  statsContainerRow: {
    flexDirection: 'row',
    marginRight: 10
  },

  reelsCount: {
    marginRight: 2
  },

  reelsCountText: {
    color: color.lightText,
    fontFamily: 'text'
  },

  viewMoreButton: {
    alignSelf: 'flex-end',
    marginHorizontal: 10
  }
})

export const pRo = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },

  sheet: {
    minWidth: width,
    backgroundColor: color.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },

  previewView: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: color.offWhite,
    borderRadius: 12,
    paddingBottom: 10
  },

  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 10
  },

  previewTitle: {
    color: color.black,
    fontSize: 18
  },

  previewSubTitle: {
    color: color.dark,
    fontSize: 13
  },

  deleteButton: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.red,
    borderRadius: 12
  },

  deleteButtonText: {
    fontFamily: 'text',
    color: color.white,
    marginLeft: 10
  }
})