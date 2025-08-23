

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/Providers/AuthProvider';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Video, ResizeMode, Audio } from "expo-av";
import { router, useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('video')

  const user=useAuthStore((state) => state.user)

  

  const [imagePosts, setImagePosts] = useState<any[]>([])
  const [videoPosts, setVideoPosts] = useState<any[]>([])
  const [savedPosts, setSavedPosts] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any[]>([])

  useFocusEffect(
     React.useCallback(() => {
    const fetchSavedPosts = async () => {

      if (!user?.id) return;

      const {data,error} = await supabase.from('profile').select('*').eq('id', user.id)
      //console.log("media",data)
      setUserProfile(data||[])

      const {data: media, error: mediaError} = await supabase.from('Posts').select('*').eq('user_id', user.id)
      if (mediaError) {
        console.log('Error fetching media:', mediaError)
        return;
      }
      setImagePosts(
        (media || [])
          .filter(post => post.image)
          .map(post => ({
            id: post.id,
            caption: post.caption,
            image: post.image
          }))
      );
      setVideoPosts(
        (media || [])
          .filter(post => post.video)
          .map(post => ({
            id: post.id,
            caption: post.caption,
            video: post.video
          }))
      );
      

      if (error) {
        console.log('Error fetching posts:', error)
        return;
      }
     
      const { data: bookmarks, error: bookmarkError } = await supabase.from('bookmark').select('post_id')
      .eq('user_id', user.id)
      if (bookmarkError) {
        console.log('Error fetching bookmarks:', bookmarkError)
        return;
      }
      if (!bookmarks || bookmarks.length === 0) {
        setSavedPosts([]);
        return;
      }
      const postIds = bookmarks.map(b => b.post_id)
      
      const { data: posts, error: postsError } = await supabase.from('Posts').select('*').in('id', postIds);
      if (postsError) {
        console.log('Error fetching saved posts:', postsError)
        return;
      }
      setSavedPosts(posts || [])
      console.log('Saved posts:', posts)
      
    }
      fetchSavedPosts()
     // console.log("User Profile:", userProfile[0].name)
  }, [user?.id]))

 

  return (
    <ScrollView>
    <View className="flex-1 bg-black items-center pt-16 ">


      <View className="w-full flex-row justify-end items-center px-8 mb-2" >
        <Pressable className='bg-[#131321] p-3 border rounded-2xl'
        onPress={() => {supabase.auth.signOut()}}>
          <Text className="text-white text-base font-semibold">Logout</Text>
        </Pressable>
      </View>
      {/* Profile Image */}
      <View className="w-28 h-28 rounded-full overflow-hidden border-black  -mb-12 mt-8 z-10"
      >
        <Image
          source={userProfile[0]?.profile ? { uri: userProfile[0]?.profile } : require('../../../assets/images/default.webp')}
          className="w-full h-full"
        />
      </View>
      {/* Name and Bio */}
      <View className='bg-[#131321] px-14 py- pt-16  mx-3  rounded-3xl'>
      <Text className="text-white text-2xl font-medium text-center">{userProfile[0]?.name || 'Anonymous'}</Text>
      <Text className="text-gray-300 text-base mt-1 text-center">{userProfile[0]?.caption || 'No bio available'}</Text>
      {/* Stats */}
      <View className="flex-row justify-between  items-center px-16 mt-4 mb-4">
        <View className="items-center">
          <Text className="text-white text-lg font-bold">132</Text>
          <Text className="text-gray-400 text-xs">Following</Text>
        </View>
        <View className="items-center">
          <Text className="text-white text-lg font-bold">545</Text>
          <Text className="text-gray-400 text-xs">Followers</Text>
        </View>
        {/* <View className="items-center">
          <Text className="text-white text-lg font-bold">9445</Text>
          <Text className="text-gray-400 text-xs">Likes</Text>
        </View> */}
      </View>
      {/* Buttons */}
      <View className="flex-row  justify-between items-center text-center mb-6 mt-4">
        <TouchableOpacity className="bg-yellow-400 rounded-xl px-12 py-2.5 mr-2" activeOpacity={0.7}>
          <Text className="text-black font-medium text-base tracking-wide">Share</Text>
        </TouchableOpacity>
        <TouchableOpacity className="border border-slate-600 rounded-xl px-8 py-2.5" activeOpacity={0.7} onPress={() => router.push('/(tabs)/Profile/EditProfile')}>
          <Text className="text-white font-medium text-base">Edit Profile</Text>
        </TouchableOpacity>
      </View>
      </View>

      {/* Tabs */}
      <View className="flex-row w-64 mt-8 justify-between border-b border-gray-700 pb-2">
        <TouchableOpacity onPress={() => setActiveTab('video')}  activeOpacity={0.7}>
          <Text className={activeTab === 'video' ? 'text-white font-semibold text-lg' : 'text-gray-400 font-semibold text-lg'}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('photo')} activeOpacity={0.7}>
          <Text className={activeTab === 'photo' ? 'text-white font-semibold text-lg' : 'text-gray-400 font-semibold text-lg'}>Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('saved')} activeOpacity={0.7}>
          <Text className={activeTab === 'saved' ? 'text-white font-semibold text-lg' : 'text-gray-400 font-semibold text-lg'}>Saved</Text>
        </TouchableOpacity>
      </View>

      {/* Section for posts based on active tab */}
      <View className="flex-1 w-full items-center justify-center mt-6">
        {activeTab === 'video' && (
          videoPosts.length > 0 ? (
            <View className="w-full px-8 flex-row flex-wrap justify-between">
              {videoPosts.map((post, idx) => (
                <View key={post.id} className="mb-6 items-center" style={{ width: '48%'}}>
                  <Video
                    source={{ uri: post.video }}
                    shouldPlay={true}
                    isMuted
                    isLooping
                    resizeMode={ResizeMode.COVER}
                    useNativeControls={false}
                    style={{ width: '100%', height: 226, borderRadius: 16 }}
                  />
                 

                  <Text className="text-white text-base font-semibold text-center mt-2">{post.caption}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center min-h-screen mt-12">
              
              <Text className="text-slate-100 text-lg font-semibold mb-2">No videos yet</Text>
              <Text className="text-gray-500 text-base text-center">You haven't posted any videos yet.</Text>
            </View>
          )
        )}
        {activeTab === 'photo' && (
          imagePosts.length > 0 ? (
            <View className="w-full px-8  flex-row flex-wrap justify-between" >
              {imagePosts.map(post => (
                <View key={post.id} className="mb-6  items-center" style={{ width: '48%' }}>
                  <Image source={{ uri: post.image }} className="w-full h-64 rounded-xl mb-2" />
                  <Text className="text-white text-base font-semibold text-center">{post.caption}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center min-h-screen mt-12">
              
              <Text className="text-slate-100 text-lg font-semibold mb-2">No images yet</Text>
              <Text className="text-gray-500 text-base text-center">You haven't posted any images yet.</Text>
            </View>
          )
        )}
        {activeTab === 'saved' && (
          savedPosts.length > 0 ? (
            <View className="w-full px-8 flex-row flex-wrap justify-between">
              {savedPosts.map(post => (
                <View key={post.id} className="mb-6 items-center" style={{ width: '48%' }}>
                  {post.video ? (
                    <>
                      <Video
                        source={{ uri: post.video }}
                        shouldPlay
                        isMuted
                        isLooping
                        resizeMode={ResizeMode.COVER}
                        useNativeControls={false}
                        style={{ width: "94%", height: 226, borderRadius: 16, marginLeft: 10 }}
                      />
                    </>
                  ) : (
                    <Image
                      source={{ uri: post.image }}
                      className="w-[100%] ml-3 mt- flex h-64 rounded-2xl"
                      resizeMode="cover"
                    />
                  )}
                   <Text className="text-white text-base font-semibold text-center mt-2">{post.caption}</Text>
                </View>
                
              ))}
            </View>
          ) : (
            <View className="items-center min-h-screen mt-12">
              <Text className="text-slate-100 text-lg font-semibold mb-2">No saved posts</Text>
              <Text className="text-gray-400 text-base text-center">You haven't saved any posts yet.</Text>
            </View>
          )
        )}
      </View>


       {/* {profileEdit && (
  <View className='' >
      <View className=''>
    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Edit Profile</Text>
    <TextInput
      value={editProfilePic}
      onChangeText={setEditProfilePic}
      placeholder="Paste image URL"
      style={{ backgroundColor: '#333', color: 'white', padding: 8, borderRadius: 8, marginBottom: 12 }}
                //   <Image source={{ uri: post.image||post.video }} className="w-full h-60 rounded-xl mb-2" />
                //   <Text className="text-white text-base font-semibold">{post.caption}</Text>
                //   {post?.video  && (
                //     <View  className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                //       <View className="bg-black/50 rounded-full p-1.5 items-center justify-center">
                //         <MaterialCommunityIcons name="play" size={30} color="white" />
                //       </View>
                //     </View>
                //   )}
                // </View>
                    <View key={post.id} className="mb-6 items-center" style={{ width: '48%' }}>
                  {post.video ? (
                               <>
                              
                               <Video
                                 source={{ uri: post.video }}
                                 shouldPlay
                                 isMuted
                                 isLooping
                                resizeMode={ResizeMode.COVER} 
                                 useNativeControls={false}
                                 style={{ width: "94%", height: 295, borderRadius: 16,marginLeft:10 }}
                
                                 />
                                
                              </>
                             ) : (
                           <Image
                        source={{ uri: post.image }}
                             className="w-[94%] ml-3 mt- flex h-80 rounded-2xl"
                             resizeMode="cover"
                               />
                               )} </View>
                         ))}
           
          ) : ( 
            <View className="items-center  min-h-screen mt-12 ">
              <Text className="text-slate-100 text-lg font-semibold mb-2">No saved posts</Text>
              <Text className="text-gray-400 text-base text-center">You haven't saved any posts yet.</Text>
            </View>
        )  )}
        
        </View>


       {/* {profileEdit && (
  <View className='' >
      <View className=''>
    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Edit Profile</Text>
    <TextInput
      value={editProfilePic}
      onChangeText={setEditProfilePic}
      placeholder="Paste image URL"
      style={{ backgroundColor: '#333', color: 'white', padding: 8, borderRadius: 8, marginBottom: 12 }}
    />
    <TextInput
      value={editName}
      onChangeText={setEditName}
      placeholder="Enter your name"
        style={{ backgroundColor: '#333', color: 'white', padding: 8, borderRadius: 8, marginBottom: 12 }}
    />
    <TextInput
      value={editLocation}
      onChangeText={setEditLocation}
      placeholder="Enter your location"
      style={{ backgroundColor: '#333', color: 'white', padding: 8, borderRadius: 8, marginBottom: 12 }}
    />
    <TextInput
      value={editCaption}
      onChangeText={setEditCaption}
      placeholder="Enter your caption"
      style={{ backgroundColor: '#333', color: 'white', padding: 8, borderRadius: 8, marginBottom: 12 }}
    />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
      <TouchableOpacity
        style={{ backgroundColor: 'green', padding: 12, borderRadius: 8 }}
        onPress={async () => {
          const { error } = await supabase.from('profile').upsert({
            user_id: user?.id,
            name: editName,
            location: editLocation,
            caption: editCaption,
           profile_pic: editProfilePic
          });
          if (!error) setProfileEdit(false);
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ backgroundColor: 'red', padding: 12, borderRadius: 8 }}
        onPress={() => setProfileEdit(false)}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel</Text>
      </TouchableOpacity>
    </View></View>
  </View>)} */}

      </View>
    </ScrollView>
  );
}