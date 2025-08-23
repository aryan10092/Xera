import Story from '@/components/Story';
import { supabase } from '@/lib/supabase';
import { story } from '@/mockdata';
import { useAuthStore, type AuthState } from '@/Providers/AuthProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Home() {
  const session = useAuthStore((state: AuthState) => state.session);

  const categories = [
    { id: 1, name: 'Entertainment', icon: <MaterialCommunityIcons name="popcorn" size={20} color="white" /> },
    { id: 8, name: 'Food', icon: <MaterialCommunityIcons name="food" size={22} color="orange" /> },
    { id: 3, name: 'Music', icon: <MaterialCommunityIcons name="music-note" size={22} color="pink" /> },
    { id: 2, name: 'Games', icon: <Ionicons name="game-controller-outline" size={20} color="lightblue" /> },
    { id: 4, name: 'Fitness', icon: <MaterialCommunityIcons name="dumbbell" size={20} color="lightgreen" /> },
    { id: 5, name: 'Art', icon: <MaterialCommunityIcons name="palette" size={22} color="white" /> },
    { id: 7, name: 'Travel', icon: <MaterialCommunityIcons name="heart" size={20} color="violet" /> },
    { id: 6, name: 'Tech', icon: <MaterialCommunityIcons name="laptop" size={20} color="lightgray" /> },
    { id: 9, name: 'Sports', icon: <MaterialCommunityIcons name="soccer" size={20} color="green" /> },
    { id: 10, name: 'Other', icon: <MaterialCommunityIcons name="fire" size={20} color="blue" /> }
  ];

  // Default category is Entertainment
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name)
    const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { data, error } = await supabase.from('Posts').select('*').order('created_at', { ascending: false });
      if (error) {
        console.log('Error fetching posts:', error);
        setPosts([]);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  // Filter posts by selected category
  const filteredPosts = posts.filter(post => post.category === selectedCategory);
  useEffect(() => {
    console.log('Filtered Posts:', filteredPosts);
  }, [filteredPosts]);

  return (
    <SafeAreaView edges={['bottom']}>
      <View className='bg-[#000000] min-h-screen flex'>
        {/* header */}
        <View className='bg-[#000000] border shadow-2xl shadow-slate-200 rounded-xl pt-10 pb-6 m-1.5'>
          {/* topbar */}
          <View className='flex justify-between items-center flex-row pt-8 px-8'>
            <View>
              <Text className='text-white mb-2 text-lg'>You're legendary</Text>
              <Text className='text-slate-300 text-md font-thin tracking-widest'>Creators go live, real-time!</Text>
            </View>
            <View className='bg-[#1f1f1f] p-2.5 rounded-full'>
              <Ionicons name="notifications-outline" size={24} color="white" />
            </View>
          </View>
          {/* status bar */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className='flex-row px-5 gap-4'>
              {story.map((item, index) => (
                <Story key={index} name={item.name} imageUrl={item.imageUrl} />
              ))}
            </View>
          </ScrollView>
        </View>

        <View>
          <View className='flex-row justify-between items-center px-6 mb-2.5 mt-3'>
            <Text className='text-white text-lg font-semibold tracking-wider'>Categories</Text>
            <Link href="/Allposts" className='text-slate-200 text-md font-light mt-1 pr-3 tracking-widest'>See All</Link>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Pressable className='flex-row gap-4 pl-5 pt-3'>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`flex-row items-center bg-[#000000] rounded-full py-2 pl-1.5 pr-3 gap-0.5 border ${selectedCategory === category.name ? 'border-[#f3f4fa]' : 'border-[#42424b]'}`}
                  style={{ elevation: 6 }}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <View className='bg-[#1f1f1f] rounded-full p-1.5 mr-2 shadow-sm'>
                    {React.cloneElement(category.icon, { size: 20, color: '#fff' })}
                  </View>
                  <Text className='text-[#f3f4fa] text-lg font-semibold'>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </Pressable>
          </ScrollView>
        </View>

        {/* Post Section */}
        <View className='px-6 mt-6'>
          <Text className='text-white text-lg font-semibold mb-3'>{selectedCategory} Posts</Text>
          {filteredPosts && filteredPosts.length > 0 ? (
            filteredPosts.map((post, idx) => (
              <View key={idx} className='bg-[#1f1f1f] rounded-xl p-4 mb-4'>
                <Text className='text-[#f3f4fa] text-base font-bold mb-1'>{post.title}</Text>
                <Text className='text-slate-300 text-sm mb-2'>{post.description}</Text>
                {/* Add more post details as needed */}
              </View>
            ))
          ) : (
            <Text className='text-slate-400'>No posts found for this category.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Home