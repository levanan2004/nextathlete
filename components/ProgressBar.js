export default function ProgressBar({ step, totalSteps }) {
  const percent = Math.round((step / totalSteps) * 100);
  return (
    <div className="mb-6">
      <div className="font-medium mb-2 text-[15px] flex justify-between">
        <span>
          Bước {step} trong {totalSteps}
        </span>
        <span className="text-blue-600">{percent} %</span>
      </div>
      <div className="w-full h-1.5 rounded bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded bg-gradient-to-r from-blue-600 to-orange-400 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
