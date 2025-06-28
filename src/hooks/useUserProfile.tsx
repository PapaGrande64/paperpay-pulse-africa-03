
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  role: 'customer' | 'vendor';
  payment_pointer: string;
  balance: number;
  daily_limit: number;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (authLoading || !user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No profile found, needs onboarding
            setNeedsOnboarding(true);
          } else {
            console.error('Error fetching profile:', error);
          }
        } else {
          // Type cast the role to ensure TypeScript compatibility
          const typedProfile: UserProfile = {
            ...data,
            role: data.role as 'customer' | 'vendor'
          };
          setProfile(typedProfile);
          setNeedsOnboarding(false);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading]);

  const refreshProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!error && data) {
      // Type cast the role to ensure TypeScript compatibility
      const typedProfile: UserProfile = {
        ...data,
        role: data.role as 'customer' | 'vendor'
      };
      setProfile(typedProfile);
      setNeedsOnboarding(false);
    }
  };

  return {
    profile,
    loading,
    needsOnboarding,
    refreshProfile,
  };
};
