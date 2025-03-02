import Link from 'next/link';

interface Match {
  id: string | number;
  location: string;
  date: string;
  duration: number;
  skill_level: string;
}

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">{match.location}</h2>
      <p className="text-gray-600">{new Date(match.date).toLocaleString()}</p>
      <p className="text-gray-600">Duration: {match.duration} minutes</p>
      <p className="text-gray-600">Skill Level: {match.skill_level}</p>
      <Link href={`/matches/${match.id}`} className="text-blue-500 mt-2 inline-block">
        View Details
      </Link>
    </div>
  );
}