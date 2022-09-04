import React from 'react'
import { Dimensions,  ImageBackground } from 'react-native'

import AutoHeightImage from 'react-native-auto-height-image'

import { useRoute } from '@react-navigation/native'
import color from '../../style/color'

const ViewAvatar = () => {
  const { avatar } = useRoute().params

  return (
    <ImageBackground
      source={{ uri: avatar }}
      resizeMode='cover'
      blurRadius={100}
      style={{
        flex: 1,
        backgroundColor: color.white,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <AutoHeightImage
        source={{ uri: avatar }}
        width={Dimensions.get('window').width}
        resizeMode='cover'
      />
    </ImageBackground>
  )
}

export default ViewAvatar