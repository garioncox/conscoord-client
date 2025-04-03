export const ProgressCircle = ({
  usePercentage = false,
  progress,
}: {
  usePercentage: boolean;
  progress: number;
}) => {
  // Convert progress (0-100) into an HSL hue with a full gradient
  const getProgressColor = () => {
    let hue = 0; // Default to red
    let lightness = 50; // Default lightness for most colors

    if (progress <= 30) {
      hue = (progress / 30) * 30; // 0% → 30% (Red → Orange)
    } else if (progress <= 60) {
      hue = 30 + ((progress - 30) / 30) * 30; // 30% → 60% (Orange → Yellow)
      lightness = 40; // Darker yellow
    } else {
      hue = 60 + ((progress - 60) / 40) * 60; // 60% → 100% (Yellow → Green)
    }

    return `hsl(${hue}, 100%, ${lightness}%)`; // Adjusted lightness for yellow
  };

  return (
    <div className="relative size-40">
      <svg
        className="size-full -rotate-90"
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-stone-100"
          strokeWidth="2"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke={getProgressColor()} // Dynamic color based on progress
          strokeWidth="2"
          strokeDasharray="100"
          strokeDashoffset={100 - progress}
          strokeLinecap="round"
        />
      </svg>

      {usePercentage && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p
            className="text-center text-2xl font-bold"
            style={{ color: getProgressColor() }}
          >
            {progress.toFixed(1)}%
          </p>
          <p
            className="text-center text-2xl font-bold"
            style={{ color: getProgressColor() }}
          >
            Filled
          </p>
        </div>
      )}
    </div>
  );
};
