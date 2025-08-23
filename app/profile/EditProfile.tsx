import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/Providers/AuthProvider';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfile() {
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
        .eq('user_id', user.id)
        .single();
      if (!error && profileData) {
        setEditName(profileData.name || '');
        setEditLocation(profileData.location || '');
        setEditCaption(profileData.caption || '');
        setEditProfilePic(profileData.profile_pic || '');
      }
    };
    fetchProfile();
  }, [user?.id]);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.from('profile').upsert({
      user_id: user?.id,
      name: editName,
      location: editLocation,
      caption: editCaption,
      profile_pic: editProfilePic,
    });
    setLoading(false);
    if (!error) router.back();
  };

    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 32 }}>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Edit Profile</Text>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <Image
                source={editProfilePic ? { uri: editProfilePic } : require('../../assets/images/man1.jpg')}
                style={{ width: 128, height: 128, borderRadius: 64, marginBottom: 16, borderWidth: 4, borderColor: '#facc15' }}
              />
            </View>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Name</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
              placeholderTextColor="#aaa"
              style={{ backgroundColor: '#1e293b', color: 'white', padding: 12, borderRadius: 12, marginBottom: 16 }}
            />
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Location</Text>
            <TextInput
              value={editLocation}
              onChangeText={setEditLocation}
              placeholder="Enter your location"
              placeholderTextColor="#aaa"
              style={{ backgroundColor: '#1e293b', color: 'white', padding: 12, borderRadius: 12, marginBottom: 16 }}
            />
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Caption</Text>
            <TextInput
              value={editCaption}
              onChangeText={setEditCaption}
              placeholder="Enter your caption"
              placeholderTextColor="#aaa"
              style={{ backgroundColor: '#1e293b', color: 'white', padding: 12, borderRadius: 12, marginBottom: 24 }}
            />
            <TouchableOpacity
              style={{ backgroundColor: '#facc15', borderRadius: 12, paddingVertical: 14, marginBottom: 16 }}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>{loading ? 'Saving...' : 'Save Profile'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ borderColor: '#64748b', borderWidth: 1, borderRadius: 12, paddingVertical: 14 }}
              onPress={() => router.back()}
            >
              <Text style={{ color: 'white', fontWeight: '500', fontSize: 18, textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
}
