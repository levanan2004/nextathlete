"use client";
import TournamentCard from "./TournamentCard";

export default function TournamentList({ tournaments }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
      {tournaments.map((t) => (
        <TournamentCard key={t.id} t={t} />
      ))}
    </div>
  );
}
