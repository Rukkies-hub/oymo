import { StyleSheet } from "react-native"
import color from "./color"

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
    backgroundColor: color.transparent
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
    width: 100,
    height: 100,
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
  }
})