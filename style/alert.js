import { StyleSheet } from 'react-native'
import color from './color'

export const al = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  bubble: {
    maxWidth: 500,
    borderRadius: 20,
    minHeight: 100,
    padding: 10,
    margin: 10,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden'
  },

  title: {
    fontSize: 20
  },
  
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderTopColor: color.borderColor
  },

  bottomButtons: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center'
  },

  divider: {
    width: 1,
    height: 45
  }
})