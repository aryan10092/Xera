
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  return (
    <View className="flex-1 bg-black items-center pt-12">
      {/* Profile Image */}
      <View className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-600 mb-4">
        <Image
          source={require('../../assets/images/man1.jpg')}
          className="w-full h-full"
        />
      </View>
      {/* Name and Bio */}
      <Text className="text-white text-2xl font-semibold">Jonathan Crowe</Text>
      <Text className="text-gray-300 text-base mt-1">Videomaker and photographer <Text className="text-lg">✨</Text></Text>
      {/* Stats */}
      <View className="flex-row justify-between w-64 mt-6 mb-4">
        <View className="items-center">
          <Text className="text-white text-lg font-bold">132</Text>
          <Text className="text-gray-400 text-xs">Following</Text>
        </View>
        <View className="items-center">
          <Text className="text-white text-lg font-bold">5456</Text>
          <Text className="text-gray-400 text-xs">Followers</Text>
        </View>
        <View className="items-center">
          <Text className="text-white text-lg font-bold">9445</Text>
          <Text className="text-gray-400 text-xs">Likes</Text>
        </View>
      </View>
      {/* Buttons */}
      <View className="flex-row w-64 justify-between mb-6">
        <TouchableOpacity className="bg-yellow-400 rounded-full px-8 py-2 mr-2">
          <Text className="text-black font-bold text-base">Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-800 rounded-full px-8 py-2">
          <Text className="text-white font-bold text-base">Message</Text>
        </TouchableOpacity>
      </View>
      {/* Tabs */}
      <View className="flex-row w-64 justify-between border-b border-gray-700 pb-2">
        <Text className="text-white font-bold text-base">Video</Text>
        <Text className="text-gray-400 font-bold text-base">Photo</Text>
        <Text className="text-gray-400 font-bold text-base">Reels</Text>
      </View>
      {/* ...add content for tabs below if needed... */}
    </View>
  );
}