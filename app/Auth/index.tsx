import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

function Auth() {
  return (
    <View className='flex-1 bg-black justify-center items-center px-8'>
      <Text className='text-white text-4xl font-bold mb-4 text-center'>Welcome to Zera</Text>
      <Text className='text-gray-300 text-base mb-20 text-center w-[88%]'>
         Find posts that match your vibe and connect with what truly inspires you.
      </Text>
      <View className='w-full gap-  mb-8 mt-4'>
        <TouchableOpacity
          className='flex- bg-white rounded-2xl border border-slate-700 py-3.5 px-1 mx-7 mr-3'
          style={{ shadowColor: '#fff', shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 }}
            onPress={() => router.push('/Auth/Signup')}
            activeOpacity={0.7}
        >

          <Text className='text-black text-xl font-semibold text-center'>Create Account</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          className='flex-1 bg-black border border-white rounded-xl py-3 ml-3'
          style={{ shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 2 }}
            onPress={() => router.push('/Auth/Signin')}
        >
          <Text className='text-white text-lg font-semibold text-center'>Sign In</Text>
        </TouchableOpacity> */}

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
    </View>
  )
}

export default Auth