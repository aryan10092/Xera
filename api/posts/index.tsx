import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/Providers/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Note: Do NOT call hooks at module scope. Hooks must be called inside components/hooks.

export const usePosts = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Posts').select('*');
      if (error) throw new Error(error.message);
      return data;
    },
  });
  return { data, error, isLoading };
};

//user's likes for all posts
export const useUserLikes = () => {
  const { session } = useAuthStore();
  const { data: userLikes } = useQuery({
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
  })
  return { userLikes }
}

export const likeMutation = () => {
  const queryClient = useQueryClient();
  const { session } = useAuthStore();
  return useMutation({
    mutationFn: async ({ postId, isLiking }: { postId: number; isLiking: boolean }) => {
      if (!session?.user?.id) throw new Error('User not authenticated');

      if (isLiking) {
        // Idempotent like (ignore duplicate constraint)
        const { error: likeError } = await supabase
          .from('user_likes')
          .insert({ user_id: session.user.id, post_id: postId }, { ignoreDuplicates: true } as any);
        // Some clients may not support ignoreDuplicates option; tolerate 23505
        if (likeError && (likeError as any).code !== '23505') throw likeError;
      } else {
        // Idempotent unlike
        const { error: unlikeError } = await supabase
          .from('user_likes')
          .delete()
          .eq('user_id', session.user.id)
          .eq('post_id', postId);
        if (unlikeError) throw unlikeError;
      }

      // Source of truth: recalc likes from user_likes
      const { count, error: countError } = await supabase
        .from('user_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);
      if (countError) throw countError;

      const likesCount = count ?? 0;
      const { error: updateError } = await supabase
        .from('Posts')
        .update({ likes: likesCount })
        .eq('id', postId);
      if (updateError) throw updateError;

      return { postId, isLiking, likesCount };
    },
    onMutate: async ({ postId, isLiking }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['userLikes', session?.user?.id] });

      const previousPosts = queryClient.getQueryData(['posts']);
      const previousUserLikes = queryClient.getQueryData(['userLikes', session?.user?.id]);

      // Optimistic UI update
      queryClient.setQueryData(['posts'], (old: any) => {
        if (!old) return old;
        return old.map((post: any) => post.id === postId
          ? { ...post, likes: isLiking ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1) }
          : post);
      });
      queryClient.setQueryData(['userLikes', session?.user?.id], (old: any) => {
        if (!old) return old;
        return isLiking ? [...old, postId] : old.filter((id: number) => id !== postId);
      });

      return { previousPosts, previousUserLikes };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previousPosts) queryClient.setQueryData(['posts'], ctx.previousPosts);
      if (ctx?.previousUserLikes) queryClient.setQueryData(['userLikes', session?.user?.id], ctx.previousUserLikes);
      console.error('Error updating likes:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userLikes', session?.user?.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};