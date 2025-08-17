import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Text, View } from 'react-native';


type StoryProps = {
  name: string;
  imageUrl?: any;
};

function Story({ name, imageUrl }: StoryProps) {


  return (
    <View className="pt-14 flex-col justify-center items-center">
      <LinearGradient
        colors={["#ff6ec4", "#7873f5", ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 999, padding: 2.5 }}
      >
        <View className="bg-slate-700 rounded-full items-center " style={{ borderRadius: 999 }}>
          <Image
            source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl || require('../assets/images/default.webp')}
            className="w-20 h-20 rounded-full"
          />
        </View>
      </LinearGradient>
      <Text className="text-white pt-2 text-sm">{name}</Text>
    </View>
  );
}

export default Story