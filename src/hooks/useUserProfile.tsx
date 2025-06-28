
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  clerk_id: string;
  name: string;
  role: 'customer' | 'vendor';
  payment_pointer: string;
  balance: number;
  daily_limit: number;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoaded || !user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', user.id)
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
  }, [user, isLoaded]);

  const refreshProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', user.id)
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
