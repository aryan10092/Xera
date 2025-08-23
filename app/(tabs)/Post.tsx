import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/Providers/AuthProvider';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video, ResizeMode, Audio } from "expo-av";
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface MediaItem {
  uri: string;
  type: 'image' | 'video';
  thumbnail?: string;
}

export default function Post() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  const [isPosting, setIsPosting] = useState(false)

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      
      if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
        Alert.alert('Permission Required', 'Camera and media library permissions are required to post media.')
        return false
      }
    }
    return true
  }

  const pickImage = async () => {
    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false, 
        quality: 0.8,
        aspect: [4, 3],
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage: MediaItem = {
          uri: result.assets[0].uri,
          type: 'image' as const,
        }
        setSelectedMedia(newImage) 
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image')
    }
  }

  const pickVideo = async () => {
    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: false,
        quality: 0.8,
        videoMaxDuration: 60, 
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        try {
          const thumbnail = await VideoThumbnails.getThumbnailAsync(result.assets[0].uri, {
            time: 0,
            quality: 0.8,
          });
          const newVideo: MediaItem = {
            uri: result.assets[0].uri,
            type: 'video' as const,
            thumbnail: thumbnail.uri,
          };
          setSelectedMedia(newVideo)
          //console.log("Thumbnail generated:", thumbnail.uri);
        } catch (error) {
          const newVideo: MediaItem = {
            uri: result.assets[0].uri,
            type: 'video' as const,
          };
          setSelectedMedia(newVideo);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video')
    }
  }
  // useEffect(()=>{
  //   console.log("Selected media changed:", selectedMedia);
  // }, [selectedMedia])

  const takePhoto = async () => {
    const hasPermission = await requestPermissions()
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage: MediaItem = {
          uri: result.assets[0].uri,
          type: 'image',
        };
        setSelectedMedia(newImage)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo')
    }
  };

  const clearMedia = () => {
    setSelectedMedia(null);
  }

  const user = useAuthStore((state) => state.user || null)
  const [userDetails, setUserDetails] = useState<any>(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('id, name, profile, caption')
        .eq('id', user?.id)
        .single();
      if (!error && data) {
        setUserDetails(data);
      }
    };
    fetchUserDetails();
  }, [user?.id]);

  const handlePost = async () => {
    
    if (!selectedMedia) {
      Alert.alert('No Media', 'Please select an image or video to post.')
      return;
    }

    if (!caption.trim()) {
      Alert.alert('Caption Required', 'Please add a caption to your post.')
      return;
    }
    if (!category.trim()) {
      Alert.alert('Category Required', 'Please select a category for your post.')
      return;
    }
    setIsPosting(true)
    
    try {
      // posting delay
       
      const result = await creatingPost.mutateAsync()

    if (result) {
      Alert.alert('Success', 'Your post has been published!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setCaption('')
            setCategory('')
            setTags('')
            setSelectedMedia(null)
          },
        },
      ])}
    } catch (error) {
      Alert.alert('Error', 'Failed to post. Please try again.')
    } finally {
  setIsPosting(false)
  queryClient.invalidateQueries({ queryKey: ['posts'] })
  router.replace('/Allposts')
    }
  }

  const formatTags = (tagString: string) => {
    return tagString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
  }


  const creatingPost = useMutation({
    mutationFn: async () => {
      const {data, error } = await supabase.from('Posts').insert({
        user_id: user?.id,  
        user: user?.user_metadata?.displayName || 'Anonymous',
        caption,
        category,
        image: selectedMedia?.type === 'image' ? selectedMedia.uri : null,
        video: selectedMedia?.type === 'video' ? selectedMedia.uri : null,
        avatar: userDetails?.profile || null
      }).select();

      if (error) {
        Alert.alert('Error', 'Failed to create post. Please try again.')
       console.log(error)
      }
      return data
     
    },
  
  onSuccess: (data) => {
    console.log('Mutation success, invalidating posts. Data:', data);
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  }
});

  return (
    
    <View style={{ backgroundColor: '#000000', paddingTop: 52, paddingBottom:32 }} className="min-h-screen" >
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-3 pb-4 border-b border-[#2f314c] bg-[#000000]">
        <Text className="text-white text-xl font-medium tracking-wide ">Create Post</Text>
        <TouchableOpacity
          onPress={handlePost}
          disabled={isPosting}
          style={{
            paddingHorizontal: 13,
            paddingVertical: 6,
            borderRadius: 8,
           
            opacity: 1,
          }}
          activeOpacity={0.7}
          className='bg-slate-100'
        >
          <Text className="text-[#000000] font-medium text-lg tracking-wide">
            {isPosting ? 'Posting' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={10}
      style={{ flex: 1 }}
    >
      
  <ScrollView className="flex-1 px-6 " showsVerticalScrollIndicator={true} style={{ backgroundColor: '#000000', paddingTop: 18, flexGrow: 1 }} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Media Selection */}
        <View className="gap-3">
          <Text className="text-slate-200 text-md font-semibold mb-3 tracking-wide">Select Media</Text>
          {/* Media Buttons */}
          <View className="flex-row gap-4 mb-8">
            <TouchableOpacity 
              onPress={pickImage}
              className="flex-1 bg-[#000000] p-4
               rounded-xl items-center border  border-[#42424b]"
            >
              <MaterialCommunityIcons name="image-plus" size={32} color="#e2e8f0" />
              <Text className="text-slate-200 text-sm font-medium mt-2 ">Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={pickVideo}
              className="flex-1 bg-[#000000] p-4 rounded-xl items-center border border-[#42424b]"
            >
              <MaterialCommunityIcons name="video-plus" size={32} color="#e2e8f0" />
              <Text className="text-slate-200 text-sm font-medium mt-2">Video</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={takePhoto}
              className="flex-1 bg-[#000000] p-4 rounded-xl items-center border border-[#42424b]"
            >
              <MaterialCommunityIcons name="camera" size={32} color="#e2e8f0" />
              <Text className="text-slate-200 text-sm font-medium mt-2">Camera</Text>
            </TouchableOpacity>
          </View>

          {/* Selected Media Preview */}
          {selectedMedia && (
            <View className="mb-6">
              <View className="flex-row justify-between  items-center mb-3">
                <Text className="text-slate-200 text-md font-medium">
                  Selected Media
                </Text>
                <TouchableOpacity
                  onPress={clearMedia}
                  className="bg-red-500 px-3 py-1 rounded-full"
                >
                  <Text className="text-white text-sm font-medium">Clear</Text>
                </TouchableOpacity>
              </View>
            

              
                <View style={{ position: 'relative',paddingTop:7 }}>
                     
                  {selectedMedia.type === 'video' ? (
               <>
             <Video
                 source={{ uri:  selectedMedia.uri }}
                 shouldPlay
                 isLooping
                 isMuted
              resizeMode={ResizeMode.COVER} 
                useNativeControls={false}
                style={{ width: 200, height: 200, borderRadius: 12}}
  
                 />
                 {/* <View style={{ position: 'absolute', top: '40%', left: '42%' }}>
               <MaterialCommunityIcons name="play" size={48} color="white" />
             </View> */}
              </>
             ) : (
           <Image
        source={{ uri: selectedMedia.thumbnail || selectedMedia.uri }}
            style={{
                      width: 200,
                      height: 200,
                      borderRadius: 12
                    }}
                    contentFit="cover"
               />
               )}
                </View>
              </View>
                 
          )}
        </View>

        {/* Caption Input */}
        <View className="mb-6 gap-3">
          <Text className="text-slate-200 text-md font-semibold mb-1">Caption</Text>
          <View className="flex-row items-center bg-[#000000] rounded-xl p-3  border border-[#42424b]">
          <FontAwesome name="commenting-o" size={20} color="#e2e8f0" style={{paddingLeft:3}} />
          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder="What's on your mind?"
            placeholderTextColor="#6b7280"
            multiline
            numberOfLines={4}
            className="flex-1 text-white text-base ml-3 pt-4 "
            textAlignVertical="top"
          />
          </View> 
        </View>

      

        <View className="mt-4  gap-3">
          <Text className="text-slate-200 text-md font-semibold mb-3">Category</Text>
          <View className="flex-row items-center ml-3 bg-[#000000] rounded-xl p- borde border-[#42424b]">
            <MaterialCommunityIcons name="shape-outline" size={20} color="#e2e8f0" />
            <View style={{ flex: 1, marginLeft: 14 }}>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['Fitness', 'Music', 'Food', 'Entertainment', 'Tech', 'Art', 'Travel', 'Other'].map(cat => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={{ marginRight: 10, backgroundColor: category === cat ? '#ffb86c' : '#23243a', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8 }}
                  >
                    <Text style={{ color: category === cat ? '#181818' : '#fff', fontWeight: 'bold' }}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

      
        {category.trim() && (
          <View className='mt-6 ml-1'>
            {/* <Text className="text-slate-200 text-md font-light mb-3">Selected Category</Text> */}
            <View style={{ alignSelf: 'flex-start', minWidth: 60, maxWidth: 120 }} className="bg-[#ffb86c] px-3 py-1 rounded-full items-center">
              <Text className="text-[#1a1b2e] text-sm font-semibold ">{category}</Text>
            </View>
          </View>
        )}

      </ScrollView>
      </KeyboardAvoidingView>
    </View>
    
  );
}

