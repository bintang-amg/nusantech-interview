import type { CastMember } from "../types/tmdb";
import { getProfileUrl } from "../utils/images";

interface CastListProps {
  cast: CastMember[];
}

export function CastList({ cast }: CastListProps) {
  if (cast.length === 0) {
    return <p className="text-sm text-slate-400">No cast information available.</p>;
  }

  return (
    <ul role="list" className="flex flex-wrap gap-4">
      {cast.map((member) => {
        const profile = getProfileUrl(member.profile_path);
        return (
          <li
            key={`${member.id}-${member.character}`}
            className="w-24 text-center"
          >
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-slate-800">
              {profile ? (
                <img
                  src={profile}
                  alt={member.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                  N/A
                </div>
              )}
            </div>
            <p className="mt-2 text-xs font-semibold text-white">
              {member.name}
            </p>
            <p className="text-xs text-slate-400">{member.character}</p>
          </li>
        );
      })}
    </ul>
  );
}
