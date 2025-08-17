import Categories from '@/components/Categories';
import Story from '@/components/Story';
import { story } from '@/mockdata';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


function Home() {
  
  return (
   <SafeAreaView edges={['bottom']}>
     <View className='bg-[#181824] min-h-screen flex    '>

      {/* header */}
      <View className='bg-[#23253e] rounded-xl pt-10 pb-6 m-1.5'>

        {/* topbar */}
      <View className='flex justify-between items-center flex-row pt-8 px-8'>
        <View>
      <Text className='text-white mb-2 text-lg'>You're legendary!</Text>
       <Text className='text-white text-md font-thin  tracking-widest'>Creators go live, real-time!</Text>
       </View>

        <View className='bg-slate-700 p-2.5 rounded-full'>
       <Ionicons name="notifications-outline" size={24} color="white" />
       </View>
     </View>

    {/* status bar */}
  <ScrollView horizontal showsHorizontalScrollIndicator={false} >
    <View className=' flex-row px-5 gap-4' >
      {story.map((item, index) => (
        <Story key={index} name={item.name} imageUrl={item.imageUrl} />
      ))}
    </View>
  </ScrollView>

      {/* search bar */}
  <View className='flex-row items-center px-6 py-2 mt-7 mx-7 border-2 bg-[#2e324f] border-[#56587a91] rounded-full  shadow-2xl gap-2'>
      <Feather name="search" size={20} color="white" style={{ paddingTop:2 }} />
      <TextInput
        placeholder="Search"
        placeholderTextColor="#cbd5e1"
        style={{ flex: 1, color: 'white', fontSize: 16, paddingVertical: 2, backgroundColor: 'transparent' }}
        underlineColorAndroid="transparent"
      />
    </View>
</View>

   {/* Categories */}

   {/* <Text className='text-white mb-2 text-lg px-8 font-semibold'>Categories</Text>

   <ScrollView horizontal showsHorizontalScrollIndicator={false} >
    <View className=' flex-row px-5 gap-4' >
      {story.map((item, index) => (
        <Story key={index} name={item.name} imageUrl={item.imageUrl} />
      ))}
    </View>
  </ScrollView> */}

    <Categories />

     </View>
     
   </SafeAreaView>
  )
}

export default Home