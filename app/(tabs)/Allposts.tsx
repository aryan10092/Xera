import { useAuthStore } from '@/Providers/AuthProvider';
import { AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Animated, Dimensions, Easing, FlatList, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Video, ResizeMode, Audio } from "expo-av";
import LoadingAnimation from '@/components/LoadingAnimation';

const { height: screenHeight } = Dimensions.get('window');

export default function Allposts() {


  const userId = useAuthStore((state) => state.user?.id || null)
  const user = useAuthStore((state) => state.user || null)

 
const [searchText, setSearchText] = useState('');
const [filteredUsers, setFilteredUsers] = useState<any[]>([])



// Fetching users from Supabase when searchText changes 
useEffect(() => {
  const fetchUsers = async () => {
    if (!searchText.trim()) {
      setFilteredUsers([]);
      return;
    }
    const { data, error } = await supabase
      .from('profile')
      .select('id, name, profile, caption')
      .ilike('name', `%${searchText.trim()}%`);
    if (!error && data) {
      setFilteredUsers(data);
    }
  
  console.log('Filtered users:', data);}
  fetchUsers();
}, [searchText]);


//Fetching user details from profile table

  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('profile')
        .select('id, name, profile, caption')
        .eq('id', userId)
        .single();
      if (!error && data) {
        setUserDetails(data);
      }
    };
    fetchUserDetails();
  }, [userId]);

  // Tracks liked post IDs for this user (from Supabase)
  const [likedPosts, setLikedPosts] = useState<number[]>([])

  // Fetching liked posts for this user from Supabase
  useEffect(() => {
    const fetchLikedPosts = async () => {
      const { data, error } = await supabase
        .from('user_likes')
        .select('post_id')
        .eq('user_id', userId)
      if (!error && data) {
        setLikedPosts(data.map((row: any) => row.post_id))
      }
    };
    fetchLikedPosts()
  }, [userId]);

  const [openComment, setOpenComment] = useState<number | null>(null)
  const [commentText, setCommentText] = useState('')
  // const queryClient = useQueryClient()

  // Fetch posts from Supabase

   async function fetchAllPosts() {
    const { data, error } = await supabase.from('Posts').select('*').order('created_at', { ascending: false });
    console.log('Posts query refetched. Data:', data, 'Error:', error);
    if (error) throw error;
    return data;
  }

  const { data: posts = [], isLoading, isError, refetch: refetchPosts } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts
  });

  useFocusEffect(
    React.useCallback(() => {
      refetchPosts();
    }, [refetchPosts])
  );
   
  // scrolling to the specific post
const scrollRef = useRef<FlatList<any>>(null);
const { postId } = useLocalSearchParams()

useEffect(() => {
    if (postId && posts.length > 0) {
      const index = posts.findIndex(post => post.id == postId);
      if (index !== -1 && scrollRef.current) {
        scrollRef.current.scrollToIndex({ index, animated: true });
      }
    }
  }, [postId, posts]);
  
  // Like mutation: add like row
  const likeMutation = useMutation({
    mutationFn: async (postId: number) => {
      const { error } = await supabase.from('user_likes').insert({ user_id: userId, post_id: postId })
      if (error) throw error
      return postId
    },
    onSuccess: (postId: number) => {
      setLikedPosts(prev => [...prev, postId])
      fetchLikeCounts()
    }
  });

  // Unlike mutation: remove like row
  const unlikeMutation = useMutation({
    mutationFn: async (postId: number) => {
      const { error } = await supabase.from('user_likes').delete().eq('user_id', userId).eq('post_id', postId)
      if (error) throw error
      return postId
    },
    onSuccess: (postId: number) => {
      setLikedPosts(prev => prev.filter(id => id !== postId))
      fetchLikeCounts()
    }
  });

  // Like counts per post from Supabase
  const [likeCounts, setLikeCounts] = useState<{ [key: number]: number }>({});

  // Fetching like counts for all posts from Supabase
  const fetchLikeCounts = async () => {
    // Fetch all likes for all posts
    const { data, error } = await supabase
      .from('user_likes')
      .select('post_id');

      //console.log("Fetched like data:", data)
    if (!error && data) {
      // Aggregate like counts per post
      const counts: { [key: number]: number } = {}
      data.forEach((row: any) => {
        const pid = Number(row.post_id);
        if (pid) {
          counts[pid] = (counts[pid] || 0) + 1
        }
      });
      setLikeCounts(counts)
    }
  };

  useEffect(() => {
    fetchLikeCounts()
  }, [posts])


const [bookmark, setBookmark] = useState<number[]>([])

const fetchBookmarks = async () => {
  const { data, error } = await supabase
    .from('bookmark')
    .select('post_id')
    .eq('user_id', userId)
  if (!error && data) {
    setBookmark(data.map((row: any) => row.post_id))
  }
}

useEffect(() => {
  fetchBookmarks()
}, [posts])

const addbookmark = useMutation({
  mutationFn: async (postId: number) => {
      const { error } = await supabase.from('bookmark').insert({ user_id: userId, post_id: postId })
      if (error) throw error
      return postId
    },
    onSuccess: (postId: number) => {
      setBookmark(prev => [...prev, postId])
      fetchBookmarks()
    }
  })

const removebookmark=useMutation({
  mutationFn: async (postId: number) => {
      const { error } = await supabase.from('bookmark').delete().eq('user_id', userId).eq('post_id', postId)
      if (error) throw error
      return postId
    },
    onSuccess: (postId: number) => {
      setBookmark(prev => prev.filter(id => id !== postId))
      fetchBookmarks()
    }
  })

  // Comments logic using Supabase comments table
  const [commentsList, setCommentsList] = useState<{ [key: number]: Array<{ id: number, user_id: string, comment: string, created_at: string, name: string, avatar: string | null }> }>({});

  // Fetching comments for all posts
  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*');
    if (!error && data) {
      const grouped: { [key: number]: Array<{ id: number, user_id: string, comment: string, created_at: string,name: string, avatar: string | null }> } = {};
      data.forEach((row: any) => {
        if (row.post_id) {
          if (!grouped[row.post_id]) grouped[row.post_id] = [];
          grouped[row.post_id].push(row);
        }
      });
      setCommentsList(grouped)
    }
  };

  useEffect(() => {
    fetchComments();
  }, [posts]);
  const [slideAnim] = useState(new Animated.Value(screenHeight));

  const openCommentModal = (postId: number) => {
    setOpenComment(postId);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  };

  const closeCommentModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setOpenComment(null);
      setCommentText('');
    });
  };

  const addComment = async () => {
    if (commentText.trim() && openComment) {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: openComment,
          user_id: userId,
          comment: commentText.trim(),
          name: userDetails?.name || 'Anonymous',
          avatar: userDetails?.profile || null,
          created_at: new Date().toISOString()
        });
      if (!error) {
        setCommentText('');
        fetchComments();
      }
    }
  };
  useEffect(() => {
  if (posts && posts.length > 0) {
    const initialMuteStatus: { [key: number]: boolean } = {};
    posts.forEach((post: any) => {
      initialMuteStatus[post.id] = true; 
    });
    setVideoMuteStatus(initialMuteStatus);
  }
}, [posts]);

  const [videoMuteStatus, setVideoMuteStatus] = useState<{ [key: number]: boolean }>({});

const toggleMute = (postId: number) => {
  setVideoMuteStatus(prev => ({
    ...prev,
    [postId]: !prev[postId]
  }));
}

  const currentPost = openComment ? posts.find((post: any) => post.id === openComment) : null;

    const renderPost = ({ item: post }: { item: any }) => (
    <View
      key={post.id}
      className="mx-7 mb-8 rounded-3xl overflow-hidden bg-[#000000] border border-[#292a3d]"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pr-6 pb-4 mt-4">
        <Pressable
          onPress={() =>
            router.push({ pathname: "/OtherUserProfile", params: { userId: post.user_id } })
          }
          className="flex-row items-center gap-2"
        >
          <Image
            source={post.avatar ? { uri: post.avatar } : require("../../assets/images/default.webp")}
            className="w-8 h-8 rounded-full bg-gray-200"
          />
          <Text className="text-white text-sm font-semibold">{post.user}</Text>
        </Pressable>
        <Text className="text-xs text-slate-300 tracking-wide">
          {new Date(post.created_at).toLocaleDateString()}
        </Text>
      </View>

      {/* Media */}
      <View className="relative">
        {post.video ? (
          <>
          <Video
            source={{ uri: post.video }}
            shouldPlay={true} 
            isMuted={videoMuteStatus[post.id] ?? true}
            isLooping
            resizeMode={ResizeMode.COVER}
            style={{ width: "94%", height: 295, borderRadius: 16, marginLeft: 10 }}
          />
          <Pressable
            onPress={() => toggleMute(post.id)}
            style={{
              position: 'absolute',
              right: 20,
              bottom: 20,
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: 20,
              padding: 7,
            }}
          >
            <FontAwesome5
              name={videoMuteStatus[post.id] ? "volume-mute" : "volume-up"}
              size={18}
              color="#fff"
            />
          </Pressable>
        </>
        ) : (
          <Image
            source={{ uri: post.image }}
            className="w-[94%] ml-3 flex h-80 rounded-2xl"
            resizeMode="cover"
          />
        )}
      </View>

      {/* Caption */}
      <View className="px-5 mt-6 pb-2">
        <Text className="text-white text-md mb-1 font-normal">{post.caption}</Text>
      </View>

      {/* Actions */}
      <View className="flex-row items-center justify-between px-5 pr-6 pb-4 pt-3">
        <View className="flex-row items-center gap-0.5">
          {/* Like */}
          <Pressable
            className="flex-row items-center min-w-[48px] justify-center gap-1.5"
            onPress={() => {
              const alreadyLiked = likedPosts.includes(post.id);
              if (alreadyLiked) unlikeMutation.mutate(post.id);
              else likeMutation.mutate(post.id);
            }}
          >
            {likedPosts.includes(post.id) ? (
              <FontAwesome5 name="heart" size={18} color="#fff" solid />
            ) : (
              <AntDesign name="hearto" size={18} color="#fff" />
            )}
            <Text className="text-slate-200 text-sm font-medium tracking-wide w-[20px] ">
              {likeCounts[post.id] ?? 0}
            </Text>
          </Pressable>

          {/* Comment */}
          <Pressable
            className="flex-row items-center gap-1.5"
            onPress={() => openCommentModal(post.id)}
          >
            <FontAwesome name="comment-o" size={19} color="#fff" style={{ marginBottom: 3 }} />
            <Text className="text-slate-200 text-sm font-medium w-[20px]">
              {commentsList[post.id]?.length || 0}
            </Text>
          </Pressable>

          {/* Bookmark */}
          <Pressable
            className="mb-0.5 flex-row"
            onPress={() => {
              const alreadyBookmarked = bookmark.includes(post.id);
              if (alreadyBookmarked) removebookmark.mutate(post.id);
              else addbookmark.mutate(post.id);
            }}
          >
            {bookmark.includes(post.id) ? (
              <FontAwesome name="bookmark" size={19} color="#fff" />
            ) : (
              <FontAwesome name="bookmark-o" size={19} color="#fff" />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        ref={scrollRef}
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
         getItemLayout={(_, index) => ({
    length: 470, 
    offset: 470 * index,
    index,
  })}
        ListHeaderComponent={
          <View >
            {/* Categories */}
            <View className="pl-6 mb-4 mt-6 pt-10 flex-row items-center gap-3">
              <View className="bg-[#181818] p-3 rounded-full shadow-lg">
                <FontAwesome5 name="th-large" size={24} color="#fff" />
              </View>
              <View>
                <Text className="text-white text-lg font-semibold mb-1 tracking-wider">
                  All Categories
                </Text>
                <Text className="text-white/70 text-sm tracking-wider">
                  Explore posts from every category
                </Text>
              </View>
            </View>

            {/* Search */}
            <View className="flex-row items-center px-6 py-2 mt-3 mb-5 mx-7 border bg-black border-[#292a3d] rounded-xl shadow-2xl gap-2">
              <Feather name="search" size={18} color="#cbd5e1" style={{ paddingTop: 2 }} />
              <TextInput
                placeholder="Search"
                placeholderTextColor="#cbd5e1"
                value={searchText}
                onChangeText={setSearchText}
                style={{
                  flex: 1,
                  color: "white",
                  fontSize: 16,
                  paddingVertical: 2,
                  backgroundColor: "transparent",
                }}
              />
            </View>

            {/* Filtered Users */}
            {filteredUsers.length > 0 && (
              <View className="bg-black px-5 mb-6 mx-6 justify-center">
                {filteredUsers.map((user) => (
                  <TouchableOpacity
                    key={user.id}
                    className="flex-row items-center mb-4 pl-4 pt-3 gap-1 bg-[#131321] rounded-xl"
                    onPress={() =>
                      router.push({ pathname: "/OtherUserProfile", params: { userId: user.id } })
                    }
                  >
                    <Image
                      source={
                        user.profile
                          ? { uri: user.profile }
                          : require("../../assets/images/default.webp")
                      }
                      className="w-14 h-14 rounded-full mr-3 border-2 border-slate-700"
                    />
                    <View className="flex-col">
                      <Text className="text-white text-base">{user.name}</Text>
                      <Text className="text-white/70 text-sm">{user.caption}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Loading/Error */}
            {isLoading&& <View className="flex-1 bg-black justify-center items-center min-h-screen "><LoadingAnimation /></View>}
            {isError && <Text className="text-red-500 text-center min-h-screen">Failed to load posts.</Text>}
            {!isLoading && posts.length === 0 && (
              <Text className="text-white text-center min-h-screen">No posts found.</Text>
            )}
          </View>
        }
        contentContainerStyle={{
   
    backgroundColor: "black", 
  }}
      />

    {/* Comment Modal */}
  
    <Modal
      visible={openComment !== null}
      transparent={true}
      animationType="none"
      onRequestClose={closeCommentModal}
    >
      <View className="flex-1 justify-end m-0 p-0">
      
        <Pressable 
          className="flex-1" 
          onPress={closeCommentModal}
        />
        <Animated.View 
          className="bg-[#000000] rounded-t-3xl border-t border-[#23243a]"
          style={{
            transform: [{ translateY: slideAnim }],
            height: screenHeight * 0.65
          }}
        >
          {/* Comments List */}
          <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
            <View className="mt-4 ml-3">
              <Text className="text-white text-lg font-bold mb-4">Comments ({commentsList[openComment!]?.length || 0})</Text>
            </View>
            {(commentsList[openComment!]?.length || 0) === 0 ? (
              <View className="flex-1 items-center justify-center py-20">
                <FontAwesome5 name="comment-slash" size={48} color="#ff6b35" />
                <Text className="text-slate-400 text-lg font-medium mt-4">No comments yet</Text>
                <Text className="text-slate-500 text-sm text-center mt-2">Be the first to share your thoughts!</Text>
              </View>
            ) : (
              commentsList[openComment!]?.map((comment, index) => (
                <View key={comment.id} className="mb-4 p-4 bg-[#000000] rounded-2xl border border-[#292a3d]">
                  <View className="flex-row justify-between items-center mb-2">
                    <View className='flex-row items-center gap-2'>
                    <View className="w-8 h-8 bg-[#ffb86c] rounded-full items-center justify-center">
                      {/* <Text className="text-[#181818] font-bold text-sm">
                        {userDetails?.name.charAt(0).toUpperCase()}
                      </Text> */}
                      <Image
                  source={comment.avatar ? { uri: comment.avatar } : require('../../assets/images/default.webp')}
                  className="w-8 h-8 rounded-full bg-gray-200" />
                    </View>
                    <Text className="text-white font-semibold text-sm">{comment.name}</Text>
                    </View>
                    <View className='flex-row items-center gap-1'>
                    <Text className="text-slate-400 text-xs">{new Date(comment.created_at).toLocaleString()}</Text>
                   {/* <MaterialIcons name="delete" size={20} color="#ef4444" /> */}

                  </View>
                  </View>
                  <Text className="text-white text-base leading-6">{comment.comment}</Text>
                </View>
              ))
            )}
          </ScrollView>

          {/* Comment Input */}
      
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
            className="border-t border-[#23243a] bg-[#]"
          >
            <View className="flex-row items-center gap-2 p-4 pb-3">
              <View className="flex-1 bg-[#000000] rounded-2xl px-4 py-3 border border-[#292a3d] min-h-[48px]">
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Write a comment..."
                  placeholderTextColor="#b8b9d1"
                  className="text-white text-base"
                  multiline
                  maxLength={200}
                  style={{ 
                    textAlignVertical: 'center',
                    minHeight: 24,
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={addComment}
                disabled={!commentText.trim()}
                className={`p-3 py-6 rounded-2xl  ${commentText.trim() ? 'bg-[]' : 'bg-[#000000]'}`}
                activeOpacity={0.7}
                style={{ minHeight: 48, justifyContent: 'center' }}
              >
                <Feather 
                  name="send" 
                  size={20} 
                  color={'#b8b9d1'} 
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
              
        </Animated.View>
      
      </View>
    </Modal>
   
   
    </>
  );
}