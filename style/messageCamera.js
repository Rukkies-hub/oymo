import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

export const mc = StyleSheet.create({
  containr: {
    flex: 1,
    backgroundColor: color.black
  },

  camera: { 
    flex: 1,
    backgroundColor: color.black,
    aspectRatio: 9 / 16
  },

  goBack: {
    position: 'absolute',
    top: 60,
    left: 0,
    marginHorizontal: 30,
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.faintBlack
  },

  controlersView: {
    position: 'absolute',
    top: 60,
    right: 0,
    marginHorizontal: 20,
    backgroundColor: color.faintBlack,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 50
  },

  flip: {
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 25
  },

  flipText: {
    color: color.white,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 3
  },

  flash: {
    alignContent: 'center',
    justifyContent: 'center'
  },

  flashText: {
    color: color.white,
    fontSize: 12,
    marginTop: 5,
    marginLeft: -2.5
  },

  actionsView: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30
  },

  captureView: {
    flex: 1,
    marginHorizontal: 30
  },

  captureButton: {
    borderWidth: 8,
    borderColor: color.faintRed,
    backgroundColor: color.red,
    borderRadius: 100,
    width: 80,
    height: 80,
    alignSelf: 'center'
  },

  galleryButton: {
    borderWidth: 2,
    borderColor: color.white,
    borderRadius: 12,
    overflow: 'hidden',
    width: 50,
    height: 50
  },

  preview: {
    width: 50,
    height: 50
  }
})