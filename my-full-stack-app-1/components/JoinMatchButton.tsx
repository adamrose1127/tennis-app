'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface JoinMatchButtonProps {
  matchId: string;
}

export default function JoinMatchButton({ matchId }: JoinMatchButtonProps) {
  const [isJoining, setIsJoining] = useState(false);
  const supabase = createClient();

  const handleJoinMatch = async () => {
    try {
      setIsJoining(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please sign in to join a match');
        return;
      }

      // Check if user is already in the match
      const { data: existingParticipant } = await supabase
        .from('match_participants')
        .select('*')
        .eq('match_id', matchId)
        .eq('user_id', user.id)
        .single();

      if (existingParticipant) {
        alert('You are already participating in this match');
        return;
      }

      // Add user to match_participants
      const { error } = await supabase
        .from('match_participants')
        .insert([
          {
            match_id: matchId,
            user_id: user.id,
          },
        ]);

      if (error) throw error;
      alert('Successfully joined the match!');
      
    } catch (error) {
      console.error('Error joining match:', error);
      alert('Failed to join match. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <button
      onClick={handleJoinMatch}
      disabled={isJoining}
      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
    >
      {isJoining ? 'Joining...' : 'Join Match'}
    </button>
  );
} 