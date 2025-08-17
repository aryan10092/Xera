import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import React, { useState } from 'react';
import {
    Alert,
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

function Post() {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
        Alert.alert('Permission Required', 'Camera and media library permissions are required to post media.');
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false, 
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage: MediaItem = {
          uri: result.assets[0].uri,
          type: 'image' as const,
        };
        setSelectedMedia(newImage); 
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: false, // Only allow single selection
        quality: 0.8,
        videoMaxDuration: 60, // 60 seconds max
      });

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
          setSelectedMedia(newVideo); // Replace existing media
        } catch (error) {
          const newVideo: MediaItem = {
            uri: result.assets[0].uri,
            type: 'video' as const,
          };
          setSelectedMedia(newVideo); // Replace existing media
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
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
        setSelectedMedia(newImage); // Replace existing media
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const clearMedia = () => {
    setSelectedMedia(null);
  };

  const handlePost = async () => {
    if (!selectedMedia) {
      Alert.alert('No Media', 'Please select an image or video to post.');
      return;
    }

    if (!caption.trim()) {
      Alert.alert('Caption Required', 'Please add a caption to your post.');
      return;
    }

    setIsPosting(true);
    
    try {
      // Simulate posting delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically upload the media and post data to your backend
      Alert.alert('Success', 'Your post has been published!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setCaption('');
            setLocation('');
            setTags('');
            setSelectedMedia(null);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const formatTags = (tagString: string) => {
    return tagString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  return (
    <View style={{ backgroundColor: '#1a1b2e', paddingTop: 52, paddingBottom:32 }} className="min-h-screen" >
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-3 pb-4 border-b border-[#2f314c] bg-[#1a1b2e]">
        <Text className="text-white text-lg font-semibold ">Create Post</Text>
        <TouchableOpacity
          onPress={handlePost}
          disabled={isPosting || !selectedMedia}
          style={{
            paddingHorizontal: 13,
            paddingVertical: 6,
            borderRadius: 6,
            backgroundColor:  '#ffb86c',
            opacity: 1,
          }}
        >
          <Text className="text-[#1a1b2e] font-semibold text-lg tracking-wide">
            {isPosting ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1 px-6 " showsVerticalScrollIndicator={false} style={{ backgroundColor: '#1a1b2e',paddingTop: 18 }}>
        {/* Media Selection */}
        <View className="gap-3">
          <Text className="text-white text-lg font-semibold mb-3">Select Media</Text>
          {/* Media Buttons */}
          <View className="flex-row gap-4 mb-6">
            <TouchableOpacity 
              onPress={pickImage}
              className="flex-1 bg-[#2f314c] p-4
               rounded-xl items-center border border-[#42424b]"
            >
              <MaterialCommunityIcons name="image-plus" size={32} color="#ffb86c" />
              <Text className="text-white text-sm font-medium mt-2">Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={pickVideo}
              className="flex-1 bg-[#2f314c] p-4 rounded-xl items-center border border-[#42424b]"
            >
              <MaterialCommunityIcons name="video-plus" size={32} color="#ffb86c" />
              <Text className="text-white text-sm font-medium mt-2">Video</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={takePhoto}
              className="flex-1 bg-[#2f314c] p-4 rounded-xl items-center border border-[#42424b]"
            >
              <MaterialCommunityIcons name="camera" size={32} color="#ffb86c" />
              <Text className="text-white text-sm font-medium mt-2">Camera</Text>
            </TouchableOpacity>
          </View>

          {/* Selected Media Preview */}
          {selectedMedia && (
            <View className="mb-6">
              <View className="flex-row justify-between  items-center mb-3">
                <Text className="text-white text-md font-medium">
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
                      <Image
                    source={{ uri: selectedMedia.thumbnail || selectedMedia.uri }}
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 12
                    }}
                    contentFit="cover"
                  />
                  
                  {selectedMedia.type === 'video' && (
                    <View style={{ position: 'absolute', top: '43%', left: '22%', right: 0, bottom: 0 }}>
                      <MaterialCommunityIcons name="play" size={40} color="white" />
                    </View>
                  )}
                </View>
              </View>
                 
          )}
        </View>

        {/* Caption Input */}
        <View className="mb-6 gap-3">
          <Text className="text-white text-lg font-semibold mb-3">Caption</Text>
          <View className="flex-row items-center bg-[#2f314c] rounded-xl p-3  border border-[#42424b]">
          <FontAwesome name="commenting-o" size={20} color="#ffb86c" style={{paddingLeft:3}} />
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

        {/* Location Input */}
        <View className="mb-6 gap-3">
          <Text className="text-white text-lg font-semibold mb-3">Location</Text>
          <View className="flex-row items-center bg-[#2f314c] rounded-xl p-3 border border-[#42424b]">
            <Ionicons name="location-outline" size={20} color="#ffb86c" />
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Add location"
              placeholderTextColor="#6b7280"
              className="flex-1 text-white text-base ml-3"
            />
          </View>
        </View>

        {/* Tags Input */}
        <View className="mb-6 gap-3">
          <Text className="text-white text-lg font-semibold mb-3">Tags</Text>
          <View className="flex-row items-center bg-[#2f314c] rounded-xl p-3 border border-[#42424b]">
            <MaterialCommunityIcons name="tag-outline" size={20} color="#ffb86c" />
            <TextInput
              value={tags}
              onChangeText={setTags}
              placeholder="Add tags (separated by commas)"
              placeholderTextColor="#6b7280"
              className="flex-1 text-white text-base ml-3"
            />
          </View>
          
          {/* Tags Preview */}
          {tags.trim() && (
            <View className="flex-row flex-wrap gap-2 mt-3">
              {formatTags(tags).map((tag, index) => (
                <View key={index} className="bg-[#ffb86c] px-3 py-1 rounded-full">
                  <Text className="text-[#1a1b2e] text-sm font-medium">#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        
      </ScrollView>
    </View>
  );
}

export default Post;