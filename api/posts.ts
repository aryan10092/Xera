export async function fetchAllPosts() {
  const { data, error } = await supabase.from('Posts').select('*').order('created_at', { ascending: false });
  console.log('Posts query refetched. Data:', data, 'Error:', error);
  if (error) throw error;
  return data;
}
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/Providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Hook to fetch posts
export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Posts').select('*');
      if (error) throw new Error(error.message);
      return data;
    }
  });
};

// Hook to fetch user likes
export const useUserLikes = () => {
  const { session } = useAuthStore();
  
  return useQuery({
    queryKey: ['userLikes', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from('user_likes')
        .select('post_id')
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      return data?.map(like => like.post_id) || [];
    },
    enabled: !!session?.user?.id
  });
};

// Hook for like mutations
export const likeMutation = () => {
  const queryClient = useQueryClient();
  const { session } = useAuthStore();
  
  return useMutation({
    mutationFn: async ({ postId, isLiking }: { postId: number; isLiking: boolean }) => {
      if (!session?.user?.id) throw new Error('User not authenticated');
      
      // Get current posts data for optimistic updates
      const currentPosts = queryClient.getQueryData(['posts']) as any[];
      const currentPost = currentPosts?.find(post => post.id === postId);
      if (!currentPost) throw new Error('Post not found');

      if (isLiking) {
        // Add like to user_likes table
        const { error: likeError } = await supabase
          .from('user_likes')
          .insert({ user_id: session.user.id, post_id: postId });
        
        if (likeError) throw likeError;

        // Increment post likes count
        const { error: postError } = await supabase
          .from('Posts')
          .update({ likes: (currentPost.likes || 0) + 1 })
          .eq('id', postId);
        
        if (postError) throw postError;
      } else {
        // Remove like from user_likes table
        const { error: likeError } = await supabase
          .from('user_likes')
          .delete()
          .eq('user_id', session.user.id)
          .eq('post_id', postId);
        
        if (likeError) throw likeError;

        // Decrement post likes count
        const { error: postError } = await supabase
          .from('Posts')
          .update({ likes: Math.max(0, (currentPost.likes || 0) - 1) })
          .eq('id', postId);
        
        if (postError) throw postError;
      }

      return { postId, isLiking };
    },
    onMutate: async ({ postId, isLiking }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['userLikes', session?.user?.id] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(['posts']);
      const previousUserLikes = queryClient.getQueryData(['userLikes', session?.user?.id]);

      // Optimistically update posts data
      queryClient.setQueryData(['posts'], (old: any) => {
        if (!old) return old;
        return old.map((post: any) => {
          if (post.id === postId) {
            return {
              ...post,
              likes: isLiking ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1)
            };
          }
          return post;
        });
      });

      // Optimistically update user likes
      queryClient.setQueryData(['userLikes', session?.user?.id], (old: any) => {
        if (!old) return old;
        if (isLiking) {
          return [...old, postId];
        } else {
          return old.filter((id: number) => id !== postId);
        }
      });

      // Return context with the snapshotted value
      return { previousPosts, previousUserLikes };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      if (context?.previousUserLikes) {
        queryClient.setQueryData(['userLikes', session?.user?.id], context.previousUserLikes);
      }
      console.error('Error updating likes:', err);
    },
    onSettled: () => {
      // Always refetch user likes to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['userLikes', session?.user?.id] });
      // Don't refetch posts - we've already updated them optimistically
    }
  });
};
