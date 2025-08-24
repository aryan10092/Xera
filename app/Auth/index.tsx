import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

function Auth() {
  return (
    <Animatable.View animation="fadeInUp" className='flex-1 bg-black justify-center items-center  px-8'>
      <Text className='text-white text-4xl font-bold mb-4 text-center'>Welcome to Xera</Text>
      <Text className='text-gray-300 text-base mb-5 text-center w-[88%]'>
         Find posts that match your vibe and connect with what truly inspires you.
      </Text>

      

  <LottieView
  source={require('../../assets/Abstraction.json')}
  autoPlay
  loop
  style={{ width: 220, height: 260, marginBottom: 16 }}
/>
      <View className='w-full  mt-8'>
        <TouchableOpacity
          className='flex- bg-white rounded-2xl border border-slate-700 py-3.5 px-1 mx-7 mr-3'
          style={{ shadowColor: '#fff', shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 }}
            onPress={() => router.push('/Auth/Signup')}
            activeOpacity={0.7}
        >

          <Text className='text-black text-xl font-semibold text-center'>Create Account</Text>
        </TouchableOpacity>

         <View className="flex-row justify-center mt-6 mb-8">
                      <Text className="text-gray-300 text-base">
                        Already have an account?{' '}
                      </Text>
                      <TouchableOpacity onPress={() => router.push('/Auth/Signin')} activeOpacity={0.7}>
                        <Text className="text-white text-base font-semibold">

                          Sign In
                        </Text>
                      </TouchableOpacity>
                    </View>
      </View>
    </Animatable.View>
  )
}

export default Auth