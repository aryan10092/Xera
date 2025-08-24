import LottieView from 'lottie-react-native';
import React from 'react';
import { View } from 'react-native';

export default function LoadingAnimation() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
      <LottieView
        source={require('../assets/loading-animation.json')} 
        autoPlay
        loop
        style={{ width: 150, height: 150 }}
      />
    </View>
  );
}