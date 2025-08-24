import { supabase } from '@/lib/supabase';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Video, ResizeMode, Audio } from "expo-av";
import { useAuthStore } from '@/Providers/AuthProvider';
import * as Clipboard from 'expo-clipboard'; 
import LoadingAnimation from '@/components/LoadingAnimation';



export default function OtherUserProfile() {
  const { userId } = useLocalSearchParams()
  const currentUserId = useAuthStore(state => state.user?.id || null)
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)
  
  const [copied, setCopied] = useState(false); 
  const router = useRouter();
  
  useEffect(() => {
    async function fetchProfileAndPosts() {
      setLoading(true);

      const { data: profileData } = await supabase.from('profile').select('*').eq('id', userId).single();
      setProfile(profileData);

      const { data: userPosts } = await supabase.from('Posts').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      setPosts(userPosts || [])
      setTimeout(() => setLoading(false), 1500); 
      //setLoading(false);
    }
    if (userId) fetchProfileAndPosts();
  }, [userId])

  const [isFollowing, setIsFollowing] = useState<boolean | null>(false)


  const [followersCount, setFollowersCount] = useState(0);
const [followingCount, setFollowingCount] = useState(0);


  async function fetchCounts() {
    if (!userId) return;
    // Followers: users who follow this user
    const { count: followers } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId);
    setFollowersCount(followers ?? 0);

    // Following: users this user follows
    const { count: following } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId);
    setFollowingCount(following ?? 0)
    console.log({followers, following})
  }
  fetchCounts();

  useEffect(() => {
    fetchCounts();
  }, [userId,isFollowing])

async function checkFollowing() {
  if (!userId || !currentUserId) return;
  const { data } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', currentUserId)
    .eq('following_id', userId);
  setIsFollowing(data && data.length > 0);
}

useEffect(() => {
  checkFollowing();
}, [userId, currentUserId]);

  
const handleFollow = async () => {
  if (!userId || !currentUserId) return;
  const { error } = await supabase
    .from('follows')
    .insert([{ follower_id: currentUserId, following_id: userId }]);
  if (!error) {
    checkFollowing()
  }
}

const handleUnfollow = async () => {
  if (!userId || !currentUserId) return;
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', currentUserId)
    .eq('following_id', userId);
  if (!error) {
    checkFollowing()
  }
};

  const renderPost = ({ item: post }: { item: any }) => (
    <Pressable
      key={post.id}
      className="mb-6 items-center"
      style={{ width: "48%" }}
      onPress={() =>
        router.push({ pathname: "/Allposts", params: { postId: post.id } })
      }
    >
      <Image
        source={{ uri: post.image || post.video }}
        className="w-full h-64 rounded-xl mb-2"
      />
      <Text className="text-white text-base font-semibold text-center mt-2">
        {post.caption}
      </Text>
    </Pressable>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      ListHeaderComponent={
        <View className="items-center pt-16 bg-black">
          {/* Back Button */}
          <View className="flex justify-start w-full pl-6 pt-3">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-[#1f1f1f] rounded-full items-center justify-center mb-1"
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Profile Picture */}
          <View className="w-28 h-28 rounded-full overflow-hidden border-black mb-4">
            <Image
              source={
                profile?.profile
                  ? { uri: profile.profile }
                  : require("../assets/images/default.webp")
              }
              className="w-full h-full"
            />
          </View>

          {/* Name & Bio */}
          <Text className="text-white text-2xl font-medium text-center">
            {profile?.name || "Anonymous"}
          </Text>
          <Text className="text-gray-300 text-base mt-1 text-center">
            {profile?.caption || "No bio available"}
          </Text>

          {/* Stats */}
          <View className="flex-row justify-between items-center px-16 mt-5 mb-4 gap-12">
            <View className="items-center">
              <Text className="text-white text-lg font-bold">
                {followingCount}
              </Text>
              <Text className="text-gray-400 text-xs">Following</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-lg font-bold">
                {followersCount}
              </Text>
              <Text className="text-gray-400 text-xs">Followers</Text>
            </View>
          </View>

          {/* Buttons */}
          <View className="flex-row justify-between items-center text-center mb-6 mt-2">
            <TouchableOpacity
                   className="bg-yellow-400 rounded-xl w-32  py-2.5 mr-2 items-center"
                    activeOpacity={0.7}
                   onPress={async () => {
                   await Clipboard.setStringAsync(`https://yourapp.com/profile/${userId}`);
                 setCopied(true);
                   setTimeout(() => setCopied(false), 1500); // Hide after 1.5s
                     }}
                     >
                  <Text className="text-black font-medium text-base tracking-wide">{copied ? 'Copied' : 'Share'}</Text>
                 </TouchableOpacity>
            <TouchableOpacity
              className="border border-slate-600 rounded-xl items-center w-32 py-2.5"
              activeOpacity={0.7}
              onPress={isFollowing ? handleUnfollow : handleFollow}
            >
              <Text className="text-white font-medium text-base">
                {isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      renderItem={renderPost}
      contentContainerStyle={{
        paddingHorizontal: 16,
        backgroundColor: "black",
        paddingBottom: 40,
        minHeight: "100%",
      }}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      ListEmptyComponent={
        !loading
    ? <Text className="text-gray-500 text-center text-lg mt-8 min-h-screen">No posts yet.</Text>
    : null
      }
      ListFooterComponent={
        loading ? (
          <View className='mt-24'>
          <LoadingAnimation /></View>
        ) : null
      }
    />
  );
}