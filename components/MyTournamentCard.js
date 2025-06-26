export default function MyTournamentCard({ t }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 mb-3 border">
      <div>
        <div className="font-semibold text-base">
          {t.tournaments.name || t.tournaments.title}
        </div>
        <div className="text-xs text-gray-500 mb-1">
          {t.tournaments.sport} | {t.tournaments.location} |{" "}
          {t.tournaments.date
            ? new Date(t.tournaments.date).toLocaleDateString()
            : ""}
        </div>
        <div className="text-xs text-gray-500">
          Tham gia: {t.joined_at ? new Date(t.joined_at).toLocaleString() : ""}
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span
          className={`text-xs font-bold px-2 py-1 rounded ${
            t.status === "active"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {t.status === "active"
            ? "Đang tham gia"
            : t.status === "completed"
            ? "Đã hoàn thành"
            : t.status}
        </span>
      </div>
    </div>
  );
}
