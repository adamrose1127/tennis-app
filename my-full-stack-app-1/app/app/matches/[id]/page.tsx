import { createClient } from '@/utils/supabase/server';
import JoinMatchButton from '@/components/JoinMatchButton';

export default async function MatchDetails({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: match, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!match) {
    return <p>Match not found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Match Details</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">{match.location}</h2>
        <p className="text-gray-600">{new Date(match.date).toLocaleString()}</p>
        <p className="text-gray-600">Duration: {match.duration} minutes</p>
        <p className="text-gray-600">Skill Level: {match.skill_level}</p>
        <JoinMatchButton matchId={match.id} />
      </div>
    </div>
  );
}