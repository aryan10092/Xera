import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';


type StoryProps = {
  name: string;
  imageUrl?: any;
  onPress: () => void;
};

function Story({ name, imageUrl, onPress }: StoryProps) {


  return (
    <Pressable onPress={onPress} className="pt-10 flex-col justify-center items-center">
        <View className="bg-slate-300 rounded-full items-center " style={{ borderRadius: 999 }}>
          <Image
            source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl || require('../assets/images/default.webp')}
            className="w-20 h-20 rounded-full"
          />
        </View>
      {/* </LinearGradient> */}
      <Text className="text-white pt-2 text-sm">{name}</Text>
    </Pressable>
  );
}

export default Story