import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';


function Categories() {

    const categories = [
        { id: 1, name: 'Popular',icon:<MaterialCommunityIcons name="fire" size={23} color="orange" /> },
         { id: 3, name: 'Music', icon: <MaterialCommunityIcons name="music-note" size={22} color="pink" /> },
        { id: 2, name: 'Games', icon: <Ionicons name="game-controller-outline" size={20} color="lightblue" /> },
        { id: 8, name: 'Entertainment', icon: <MaterialCommunityIcons name="popcorn" size={20} color="white" /> },
        
        { id: 4, name: 'Fitness', icon: <MaterialCommunityIcons name="dumbbell" size={20} color="lightgreen" /> },
       
        { id: 5, name: 'Art', icon: <MaterialCommunityIcons name="palette" size={22} color="white" /> },
        { id: 7, name: 'Health', icon: <MaterialCommunityIcons name="heart" size={20} color="violet" /> },
        
        { id: 6, name: 'Technology', icon: <MaterialCommunityIcons name="laptop" size={20} color="lightgray" /> },
        
    ];

  return (
    <View>
        <View className='flex-row justify-between items-center px-6 mb-2.5 mt-3'>
        <Text className='text-white  text-lg  font-semibold tracking-wider  '>Categories</Text>
        <Link href="/Allposts" className='text-slate-200 text-md font-light mt-1 pr-3 tracking-widest'>See All</Link>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} >

        <Pressable className='flex-row  gap-4 pl-5  pt-3'>
            {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className='flex-row items-center  bg-[#2f314c] rounded-full py-2 pl-1.5 pr-3 gap-1 shadow-md'
                  style={{ elevation: 6 }} >

                  <View className='bg-[#42424b] rounded-full p-1.5 mr-2 shadow-sm'>
                    {React.cloneElement(category.icon, { size: 20, color: '#ffb86c' })}
                  </View>
                  <Text className='text-[#f3f4fa] text-lg  font-semibold'>{category.name}</Text>
                </TouchableOpacity>
            ))}
        </Pressable>
    </ScrollView>
    </View>
  )
}

export default Categories