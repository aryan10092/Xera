import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 2000));
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            displayName: formData.name
          }
        }
      })

      
      console.log(data)
      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (data?.user) {
   const {data: profileData,error:profileError} = await supabase.from('profile').insert({
    id: data.user.id, 
    name: formData.name, 
  })
  console.log('Profile created:', profileData, 'Error:', profileError);
}
      router.replace('/(tabs)/Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-8 pt-8">
            {/* Header */}
            <View className="mb-8">
              <TouchableOpacity 
                onPress={() => router.back()}
                className="w-10 h-10 bg-[#1f1f1f] rounded-full items-center justify-center mb-6"
              >
                <Ionicons name="arrow-back" size={20} color="white" />
              </TouchableOpacity>
              
              <Text className="text-white text-3xl font-bold mb-1.5 ml-">Create Account</Text>
              <Text className="text-gray-400 text-base ml-">
                Connect with friends and share your moments on Flow
              </Text>
            </View>
            {/* Form */}
            <View className="space-y ">
              {/* Name Input */}
              <View className='mb-5'>
                <Text className="text-white text-sm font-medium mb-2 ml-1">Full Name</Text>
              <View className="flex-row items-center  rounded-xl px-4 py-1.5 border border-[#42424b]">
                <Ionicons name="person-outline" size={20} color="#6b7280" />
                <TextInput
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#6b7280"
                  className="flex-1 text-white text-base ml-3"
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-5 ">
              <Text className="text-white text-sm font-medium mb-2 ml-1">Email Address</Text>
              <View className="flex-row items-center  rounded-xl px-4 py-1.5 border border-[#42424b]">
                <Ionicons name="mail-outline" size={20} color="#6b7280" />
                <TextInput
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Enter your email"
                  placeholderTextColor="#6b7280"

                  className="flex-1 text-white text-base ml-3"
               keyboardType="email-address"
                  autoCapitalize="none" />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-5 ">
              <Text className="text-white text-sm font-medium mb-2 ml-1">Password</Text>
              <View className="flex-row items-center  rounded-xl px-4 py-1.5 border border-[#42424b]">
                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                <TextInput
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  placeholder="Create a password"
                  placeholderTextColor="#6b7280"
                  className="flex-1 text-white text-base ml-3"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
              </View>
              <Text className="text-gray-500 text-xs mt-2 ml-2">
                Must be at least 6 characters 
              </Text>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-3 ">
              <Text className="text-white text-sm font-medium mb-2 ml-1">Confirm Password</Text>
              <View className="flex-row items-center  rounded-xl px-4 py-1.5 border border-[#42424b]">
                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                <TextInput
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  placeholder="Confirm your password"
                  placeholderTextColor="#6b7280"
                  className="flex-1 text-white text-base ml-3"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl mt-6 ${
                isLoading ? 'bg-slate-100' : 'bg-white'
              }`}
              activeOpacity={0.7}
              style={{ 
                shadowColor: '#fff', 
                shadowOpacity: 0.1, 
                shadowRadius: 8, 
                elevation: 2 
              }}
            >
              <Text className={`text-center text-lg font-semibold 
                
              `}>
                {isLoading ? 'Creating Account' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            

            {/* Divider */}
            <View className="flex-row items-center mt-6">
              <View className="flex-1 h-px bg-[#42424b]" />
              <Text className="text-gray-500 text-sm mx-4">or</Text>
              <View className="flex-1 h-px bg-[#42424b]" />
            </View>

            {/* Social Sign Up Options */}
            {/* <View className="space-y-3">
              <TouchableOpacity className="flex-row items-center justify-center bg-[#1f1f1f] py-4 rounded-xl border border-[#42424b]">
                <Ionicons name="logo-google" size={20} color="#ea4335" />
                <Text className="text-white text-base font-medium ml-3">
                  Continue with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-center bg-[#1f1f1f] py-4 rounded-xl border border-[#42424b]">
                <Ionicons name="logo-apple" size={20} color="white" />
                <Text className="text-white text-base font-medium ml-3">
                  Continue with Apple
                </Text>
              </TouchableOpacity>
            </View> */}

            {/* Sign In Link */}
            <View className="flex-row justify-center mt-6 mb-8">
              <Text className="text-gray-400 text-base">
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/Auth/Signin')} activeOpacity={0.7}>
                <Text className="text-white text-base font-semibold">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Signup;