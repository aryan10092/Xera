import Story from '@/components/Story';
import { supabase } from '@/lib/supabase';
import { useAuthStore, type AuthState } from '@/Providers/AuthProvider';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Video, ResizeMode, Audio } from "expo-av";
import { categories } from '@/components/Categories';

function Home() {
  const session = useAuthStore((state: AuthState) => state.session)
  const userId = session?.user?.id

  const router = useRouter();

   

   const [followers, setFollowers] = useState<any[]>([])
   const [following, setFollowing] = useState<any[]>([])
   const followerIdsSet = new Set(followers.map(f => f.id));
  const followingIdsSet = new Set(following.map(f => f.id));

const bothFollowerAndFollowing = followers.filter(f => followingIdsSet.has(f.id));

// Only followers (not following)
const onlyFollowers = followers.filter(f => !followingIdsSet.has(f.id));

// Only following (not followers)
const onlyFollowing = following.filter(f => !followerIdsSet.has(f.id));

// Combine all unique users
const statusBarUsers = [
  ...bothFollowerAndFollowing,
  ...onlyFollowers,
  ...onlyFollowing,
];
  useEffect(() => {
    async function fetchFollowedata() {
      // follower IDs
      const { data: followRows } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('following_id', userId);

      const followerIds = followRows?.map(row => row.follower_id) ?? [];

      // follower profiles
      if (followerIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profile')
          .select('id, name, profile')
          .in('id', followerIds);

        setFollowers(profiles ?? []);
      } else {
        setFollowers([]);
      }

        const { data: followingRows } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId);

    const followingIds = followingRows?.map(row => row.following_id) ?? [];

    let followingProfiles: any[] = [];
    if (followingIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profile')
        .select('id, name, profile')
        .in('id', followingIds);
      followingProfiles = profiles ?? [];
    }

    setFollowing(followingProfiles);
    }
    if (userId) fetchFollowedata();
  }, [userId, followers, following]);

  const [allUsers, setAllUsers] = useState<any[]>([])

 useEffect(() => {
        async function fetchAllUsers() {
    const { data, error } = await supabase.from('profile').select('*');
    if (error) {
      console.log('Error fetching all users:', error);
      setAllUsers([]);
    } else {
      setAllUsers(data || []);
    }
  };
  fetchAllUsers();
}, []);

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
    <ScrollView className='flex-1'>
      
        <View className='bg-[#000000] min-h-screen flex'>
          {/* header */}
          <View className='bg-[#000000] border shadow-xl shadow-slate-200 rounded-xl pt-10 pb-6 m-1.5'>
            {/* topbar */}
          <View className='flex justify-between items-center flex-row pt-8 px-8'>
            <View>
              <Text className='text-white mb-1 text-lg'>Unleash Your Creativity</Text>
              <Text className='text-slate-300 text-sm font-thin tracking-widest'>Every Post Matters Make Yours Count!</Text>
            </View>
            <View className='bg-[#1f1f1f] p-0.5 rounded-full'>
              <MaterialCommunityIcons name="alpha-z" size={32} color="#fff" />
            </View>
          </View>

          {/* status bar */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className='flex-row px-5 gap-4'>
             {statusBarUsers.length > 0 ? (
      statusBarUsers.map((user) => (
        <Story
          key={`user-${user.id}`}
          name={user.name}
          imageUrl={user.profile}
          onPress={() => router.push({ pathname: '/OtherUserProfile', params: { userId: user.id } })}
        />
      ))
    ):( allUsers.map((user) => (
      <Story
        key={user.id}
        name={user.name}
        imageUrl={user.profile}
        onPress={() => router.push({ pathname: '/OtherUserProfile', params: { userId: user.id } })}
      />
    )))}
            </View>
          </ScrollView>
        </View>

        <View>
          <View className='flex-row justify-between items-center px-6 mb-2.5 mt-5'>
            <Text className='text-white text-lg font-semibold tracking-wider'>Categories</Text>
            <Link href="/Allposts" className='text-slate-200 text-md font-light mt-1 pr-3 tracking-widest'>See All</Link>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Pressable className='flex-row gap-4 pl-5 pt-3 mb-1'>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`flex-row items-center  rounded-full py-1 pl-1.5 pr-3 gap-0.5 border ${selectedCategory === category.name ? 'bg-slate-100' : 'bg-[#000000]'}`}
                  style={{ elevation: 6 }}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <View className={` ${selectedCategory === category.name ? 'bg-slate-200' : 'bg-[#1f1f1f]'} rounded-full p-1.5 mr-2 shadow-sm`}>
                    {React.cloneElement(category.icon, { size: 20, color: selectedCategory === category.name ? '#000' : '#fff' })}
                  </View>
                  <Text className={` text-lg font-semibold ${selectedCategory === category.name ? 'text-black' : 'text-[#f3f4fa]'}`}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </Pressable>
          </ScrollView>
        </View>

        {/* Post Section */}
        <View className=' mt-8'>
  {/* <Text className='text-white text-lg font-semibold mb-3'>{selectedCategory} Posts</Text> */}
  {filteredPosts && filteredPosts.length > 0 ? (
    filteredPosts.map((post, idx) => (
      <Pressable
        onPress={() => router.push({ pathname: '/Allposts', params: { postId: post.id } })}
        key={post.id}
        className="mx-7 mb-8 rounded-3xl overflow-hidden bg-[#000000] border border-[#292a3d]"
      >
        {/* User Info */}
        <View className="flex-row items-center justify-between px-5 pr-6 pb-4 mt-4">
          <Pressable onPress={() => router.push({ pathname: '/OtherUserProfile', params: { userId: post.user_id } })} className="flex-row items-center gap-2">
            <Image
              source={post.avatar ? { uri: post.avatar } : require('../../assets/images/default.webp')}
              className="w-8 h-8 rounded-full bg-gray-200"
            />
            <Text className="text-white text-sm font-semibold">{post.user}</Text>
          </Pressable>
          <Text className="text-xs text-slate-300 tracking-wide">
            {new Date(post.created_at).toLocaleDateString()}
          </Text>
        </View>

        {/* Post image or video */}
        <View className="relative">
          {post.video ? (
            <Video
              source={{ uri: post.video }}
              shouldPlay
              isMuted
              isLooping
              resizeMode={ResizeMode.COVER}
              useNativeControls={false}
              style={{ width: "94%", height: 295, borderRadius: 16, marginLeft: 10 }}
            />
          ) : (
            post.image && (
              <Image
                source={{ uri: post.image }}
                className="w-[94%] ml-3 flex h-80 rounded-2xl"
                resizeMode="cover"
              />
            )
          )}
        </View>

        {/* Caption */}
        <View className="px-5 mt-6 pb-2">
          <Text className="text-white text-md mb-1 font-normal">{post.caption}</Text>
        </View>
      </Pressable>
    ))
  ) : (
    <Text className='text-slate-400 px-6 mt-6'>No posts found for this category.</Text>
  )}
</View>
      </View>
    </ScrollView>
  );
}

export default Home