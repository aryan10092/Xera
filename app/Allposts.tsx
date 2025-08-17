import { AntDesign, FontAwesome } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Animated, Dimensions, Easing, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { posts } from '../postdata';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: screenHeight } = Dimensions.get('window');

export default function Allposts() {

  const [like, setLike] = useState(0);
  const [likeCounts, setLikeCounts] = useState(posts.map(post => post.likes));
  const [openComment, setOpenComment] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState(posts.map(post => [
    "Great workout! 💪",
    "This is exactly what I needed today",
    "Amazing progress, keep it up!",
    "Love the energy in this post"
  ] as string[]));
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

  const addComment = () => {
    if (commentText.trim() && openComment) {
      setCommentsList(prev => prev.map((comments, idx) => 
        idx === openComment - 1 ? [...comments, commentText.trim()] : comments
      ));
      setCommentText('');
    }
  };

  const currentPost = openComment ? posts.find(post => post.id === openComment) : null;

  return (
    <>
    <ScrollView className="bg-[#000000] flex-1" contentContainerStyle={{ paddingVertical: 48 }}>
      <View className="pl-6 mb-8 mt-4  flex-row items-center gap-3">
        <View className="bg-[#181818] p-3 rounded-full shadow-lg">
        <FontAwesome5 name="th-large" size={24} color="#fff" />
        </View>
        <View>
        <Text className="text-white text-lg font-semibold mb-1 tracking-wider">All Categories</Text>
        <Text className="text-white/70 text-sm tracking-wider">Explore posts from every category</Text>
        </View>
      </View>
        {posts.map((post) => (
          <View
            key={post.id}
            className="mx-7 mb-8  rounded-3xl overflow-hidden bg-[#000000] border border-[#292a3d]"
            
          >
            <View className="flex-row items-center  justify-between px-5 pr-6 pb-4 mt-4 ">
              <View className="flex-row items-center gap-2">
              <Image
                source={post.avatar}
                className="w-8 h-8 rounded-full bg-gray-200" />

              <Text className="text-white text-sm font-semibold">{post.user}</Text>
            </View>
            <Text className=" text-xs text-slate-300  tracking-wide">5w ago</Text>
           </View>

          {/* Post image with rounded corners and time */}
          <View className="relative">
            <Image
              source={post.image}
              className="w-[94%] ml-3 mt- flex h-80 rounded-2xl"
              resizeMode="cover"
            />

            {/* <Text className="absolute top-5 right-5 text-xs text-white bg-black/70 px-3 py-2 rounded-full font-semibold">5w ago</Text>
           */}
          </View>
          {/* Caption below image */}
          <View className="px-5 mt-6 pb-2">
            <Text className="text-white text-md mb-1 font-normal">{post.caption}</Text>
          </View>
          {/* User info and actions */}
          <View className="flex-row items-center justify-between px-5 pr-6 pb-4 pt-3 ">
            {/* <View className="flex-row items-center gap-2">
              <Image
                source={post.avatar}
                className="w-8 h-8 rounded-full bg-gray-200" />

              <Text className="text-white text-sm font-semibold">{post.user}</Text>
            </View> */}
            <View className="flex-row items-center gap-2">
              <View
                className="flex-row items-center  min-w-[48px] justify-center"
                onTouchEnd={() => {
                  if (like === post.id) {
                    setLike(0);
                    setLikeCounts(likeCounts => likeCounts.map((count, idx) => post.id - 1 === idx ? count - 1 : count));
                  } else {
                    setLike(post.id);
                    setLikeCounts(likeCounts => likeCounts.map((count, idx) => post.id - 1 === idx ? count + 1 : count));
                  }
                }}
              >
                {like === post.id ? (
                  <FontAwesome5
                    name="heart"
                    size={18}
                    color="#fff"
                    solid
                  />
                ) : (
                  <AntDesign name="hearto" size={17} color="#fff" />
                )}
                <Text className="text-slate-200 text-xs font-semibold tracking-wide w-[24px] text-center">{likeCounts[post.id - 1]}</Text>

              </View>
              <TouchableOpacity
                className="flex-row items-center gap-1 mb-"
                onPress={() => openCommentModal(post.id)}
                activeOpacity={0.7}
              >
                <FontAwesome name="comment-o" size={18} color="#fff" style={{marginBottom: 3}}/>
                <Text className="text-slate-200 text-xs font-semibold w-[20px]">{post.comments + commentsList[post.id - 1].length}</Text>
              </TouchableOpacity>
              <View className='mb-' >
                <FontAwesome name="bookmark-o" size={18} color="#fff" />
              </View>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>

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
              <Text className="text-white text-lg font-bold mb-4">Comments ({commentsList[openComment! - 1]?.length || 0})</Text>
            </View>
            {commentsList[openComment! - 1]?.length === 0 ? (
              <View className="flex-1 items-center justify-center py-20">
                <FontAwesome5 name="comment-slash" size={48} color="#ff6b35" />
                <Text className="text-slate-400 text-lg font-medium mt-4">No comments yet</Text>
                <Text className="text-slate-500 text-sm text-center mt-2">Be the first to share your thoughts!</Text>
              </View>
            ) : (
              commentsList[openComment! - 1]?.map((comment, index) => (
                <View key={index} className="mb-4 p-4 bg-[#000000] rounded-2xl border border-[#292a3d]">
                  <View className="flex-row justify-between items-center mb-2">
                    <View className='flex-row items-center gap-2'>
                    <View className="w-8 h-8 bg-[#ffb86c] rounded-full items-center justify-center">
                      <Text className="text-[#181818] font-bold text-sm">
                        {comment.charAt(0).toUpperCase()}
                      </Text>
                    </View> 
                    <Text className="text-white font-semibold text-sm">User{index + 1}</Text>
                    </View>
                    <View className='flex-row items-center gap-1'>
                    <Text className="text-slate-400 text-xs">{index + 1}m ago</Text>
                   <MaterialIcons name="delete" size={20} color="#ef4444" />

                  </View>
                  </View>
                  <Text className="text-white text-base leading-6">{comment}</Text>
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
            <View className="flex-row items-center gap-3 p-4 pb-0">
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
                className={`p-3 py-6 rounded-2xl border border-[#292a3d ${commentText.trim() ? 'bg-[]' : 'bg-[#000000]'}`}
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
