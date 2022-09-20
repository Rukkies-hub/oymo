import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width } = Dimensions.get('window')

export const ps = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  headText: {
    fontSize: 16,
    marginVertical: 20,
    marginHorizontal: 10,
    color: color.lightText
  },

  infoView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
  },

  titleText: {
    fontSize: 20,
    color: color.dark
  },

  passionCount: {
    color: color.dark,
    fontSize: 20
  },

  scrollViewContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 30,
    paddingBottom: 20
  },

  scrollView: {
    flex: 1,
    marginBottom: 20
  },

  passionsContainerView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },

  passionButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 2,
    borderRadius: 50,
    marginBottom: 10,
    marginRight: 10
  },

  passion: {
    fontSize: 12,
    textTransform: 'capitalize',
    fontFamily: 'text'
  },

  updateButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },

  updateButtonText: {
    color: color.white,
    fontSize: 18
  }
})