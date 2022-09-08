import { Dimensions, StyleSheet } from "react-native"
import color from "./color"

const { width } = Dimensions.get('window')

export const sr = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  mainView: {
    marginHorizontal: 10,
    flexDirection: 'row'
  },

  input: {
    paddingVertical: 10,
    marginRight: 20,
    fontSize: 18,
    flex: 1,
    color: color.dark
  },

  preview: {
    aspectRatio: 9 / 16,
    backgroundColor: color.black,
    width: 60
  },

  bottomView: {
    flexDirection: 'row',
    margin: 10
  },

  cancelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderColor: color.borderColor,
    borderWidth: 1,
    borderRadius: 8,
    height: 45,
    marginRight: 5
  },

  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: color.red,
    borderRadius: 8,
    height: 45,
    marginLeft: 5
  }
})