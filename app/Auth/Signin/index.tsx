import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Signin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }
    return true;
  };

  const handleSignin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
       const {error}= await supabase.auth.signInWithPassword({
         email: formData.email,
         password: formData.password
       });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      router.replace('/(tabs)/Home')
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality will be implemented here.');
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-8 pt-8">
          {/* Header */}
          <View className="mb-8">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 bg-[#1f1f1f] rounded-full items-center justify-center mb-6 " 
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            
            <Text className="text-white text-3xl font-bold mb-1.5 mt-6">Welcome Back</Text>
            <Text className="text-gray-400 text-base mb-3">
              Sign in to continue your fitness journey
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-5">
            {/* Email Input */}
            <View className="mb-7">
              <Text className="text-white text-sm font-medium mb-2 ml-1">Email Address</Text>
              <View className="flex-row items-center rounded-xl px-4 py-1.5 border border-[#42424b]">
                <Ionicons name="mail-outline" size={20} color="#6b7280" />
                <TextInput
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Enter your email"
                  placeholderTextColor="#6b7280"
                  className="flex-1 text-white text-base ml-3"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-7">
              <Text className="text-white text-sm font-medium mb-2 ml-1">Password</Text>
              <View className="flex-row items-center rounded-xl px-4 py-1.5 mb-3 border border-[#42424b]">
                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                <TextInput
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  placeholder="Enter your password"
                  placeholderTextColor="#6b7280"
                  className="flex-1 text-white text-base ml-3 "
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
            </View>

            {/* Forgot Password */}
            {/* <TouchableOpacity 
              onPress={handleForgotPassword}
              className="self-end mb-6"
            >
              <Text className="text-white text-sm font-medium">
                Forgot Password?
              </Text>
            </TouchableOpacity> */}

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleSignin}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl ${
                isLoading ? 'bg-gray-100' : 'bg-white'
              }`}
              activeOpacity={0.7}
            >
              <Text className={`text-center text-lg font-semibold
                 
              `}>
                {isLoading ? 'Signing in' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-[#42424b]" />
              <Text className="text-gray-500 text-sm mx-4">or</Text>
              <View className="flex-1 h-px bg-[#42424b]" />
            </View>

          

            {/* Sign Up Link */}
            <View className="flex-row justify-center  mb-8">
              <Text className="text-gray-400 text-base">
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/Auth/Signup')} activeOpacity={0.7}>
                <Text className="text-white text-base font-semibold">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Signin;