import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/Providers/AuthProvider';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import Ionicons from '@expo/vector-icons/Ionicons';

export default function EditProfile() {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setEditProfilePic(result.assets[0].uri);
    }
  };
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editProfilePic, setEditProfilePic] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const fetchProfile = async () => {
      if (!user?.id) return;
      const { data: profileData, error } = await supabase
        .from('profile')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!error && profileData) {
        setEditName(profileData.name || '');
        setEditLocation(profileData.location || '');
        setEditCaption(profileData.caption || '');
        setEditProfilePic(profileData.profile || '');
      }
    };
    fetchProfile();
  }, [user?.id]);

  const handleSave = async () => {
    setLoading(true);
    const {data, error } = await supabase.from('profile').upsert({
      id: user?.id,
      name: editName,
      location: editLocation,
      caption: editCaption,
      profile: editProfilePic,
    })
    console.log('Upsert result:', data, error)
    setLoading(false);
    if (!error) router.back();
  };

    return (
      <View className="flex-1 bg-black">
       
          <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={10}
                style={{ flex: 1 }}>
           <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>

          <View className="flex-1 px-5 pt-16">
           <View className='flex-row items-center justify-between mt-3' >
             <TouchableOpacity 
                onPress={() => router.back()}
                className="w-10 h-10 bg-[#1f1f1f] rounded-full items-center justify-center mb-6"
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={20} color="white" />
              </TouchableOpacity>
            <Text className="text-white text-xl text-center font-semibold mb-8 mr-8">
              Edit Profile</Text>
              <View></View>
              </View>

            <View className="items-center mb-6 mt-4 relative">
              <Image
                source={editProfilePic ? { uri: editProfilePic } : require('../../../assets/images/default.webp')}
                className="w-32 h-32 rounded-3xl mb-4 border-4 "
              />
              <TouchableOpacity
                className="absolute bottom-3 right-32 bg-[#1f1f1f] rounded-full p-2 items-center justify-between flex"
                onPress={pickImage}
                activeOpacity={0.8}
              >
               <Feather name="camera" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-white text-lg font-semibold mb-2">Name</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder=""
              placeholderTextColor="#aaa"
              className=" text-white px-4 py-3 rounded-xl mb-4 border border-slate-600"
            />
            <Text className="text-white text-lg font-semibold mb-2">Location</Text>
            <TextInput
              value={editLocation}
              onChangeText={setEditLocation}
              placeholder=""
              multiline
              numberOfLines={4}
              maxLength={200}
                  style={{ 
                    textAlignVertical: 'center',
                    minHeight: 24,
                  }}
              placeholderTextColor="#aaa"
              className="text-white px-4 py-3 rounded-xl mb-4 border border-slate-600"
            />
            <Text className="text-white text-lg font-semibold mb-2">Caption</Text>
            <TextInput  
              value={editCaption}
              onChangeText={setEditCaption}
              placeholder=""
              placeholderTextColor="#aaa"
              className="text-white px-4 py-12 rounded-xl mb-6 border border-slate-600"
            />
            <TouchableOpacity
              className="bg-white rounded-xl py-3 mb-4 mt-3"
              onPress={handleSave}
              disabled={loading}
            >
              <Text className="text-black font-semibold text-lg text-center">{loading ? 'Saving...' : 'Save Profile'}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              className="border border-slate-600 rounded-xl py-3"
              onPress={() => router.back()}
            >
              <Text className="text-white font-medium text-lg text-center">Cancel</Text>
            </TouchableOpacity> */}
          </View>
            </ScrollView>
          </KeyboardAvoidingView>
      
      </View>
    );
}
