interface HistoryPoint {
  month: string;
  followers: number;
}

interface FollowerHistoryChartProps {
  history: HistoryPoint[];
}

export function FollowerHistoryChart({ history }: FollowerHistoryChartProps) {
  if (!history || history.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/20">
        <p className="text-sm text-gray-400">No historical growth data available</p>
      </div>
    );
  }

  // Sort history chronologically
  const sortedHistory = [...history].sort((a, b) => a.month.localeCompare(b.month));

  const width = 600;
  const height = 260;
  const paddingLeft = 55;
  const paddingRight = 25;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const followerValues = sortedHistory.map((d) => d.followers);
  const maxFollowers = Math.max(...followerValues);
  const minFollowers = Math.min(...followerValues);
  const range = maxFollowers - minFollowers;
  // Pad the range slightly so the line doesn't touch the top/bottom edges
  const minVal = Math.max(0, minFollowers - range * 0.15);
  const maxVal = maxFollowers + range * 0.15;
  const finalRange = maxVal - minVal || 1;

  // Calculate coordinates for points
  const points = sortedHistory.map((d, index) => {
    const x = paddingLeft + (index / (sortedHistory.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.followers - minVal) / finalRange) * chartHeight;
    return { x, y, ...d };
  });

  // Build the SVG path string
  let pathD = "";
  points.forEach((p, index) => {
    if (index === 0) {
      pathD = `M ${p.x} ${p.y}`;
    } else {
      // Smooth curve using cubic bezier logic (or straight lines for simpler rendering)
      pathD += ` L ${p.x} ${p.y}`;
    }
  });

  // Area path (closed polygon back to baseline for gradient fill)
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  // Format follower count for labels
  const formatYLabel = (val: number) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + "M";
    if (val >= 1000) return (val / 1000).toFixed(0) + "K";
    return String(val);
  };

  // Helper for month formatting (e.g. "2023-07" to "Jul '23")
  const formatXLabel = (monthStr: string) => {
    const parts = monthStr.split("-");
    if (parts.length < 2) return monthStr;
    const year = parts[0].substring(2);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIdx = parseInt(parts[1], 10) - 1;
    return `${months[monthIdx]} '${year}`;
  };

  // Y-axis tick values (4 subdivisions)
  const ticksY = Array.from({ length: 4 }).map((_, i) => {
    const val = minVal + (i / 3) * finalRange;
    const y = paddingTop + chartHeight - (i / 3) * chartHeight;
    return { val, y };
  });

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 backdrop-blur-md rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
          Audience Growth History
        </h4>
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2.5 py-1 rounded-lg">
          +{formatYLabel(maxFollowers - minFollowers)} net new followers
        </span>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px]"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {ticksY.map((tick, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={width - paddingRight}
                y2={tick.y}
                className="stroke-gray-100 dark:stroke-gray-800"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={tick.y + 4}
                className="fill-gray-400 dark:fill-gray-500 font-mono text-[10px] text-right"
                textAnchor="end"
              >
                {formatYLabel(tick.val)}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {points.map((p, index) => (
            <text
              key={index}
              x={p.x}
              y={height - paddingBottom + 18}
              className="fill-gray-400 dark:fill-gray-500 font-semibold text-[10px]"
              textAnchor="middle"
            >
              {formatXLabel(p.month)}
            </text>
          ))}

          {/* Gradient area */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Line path */}
          <path
            d={pathD}
            fill="none"
            stroke="#6366f1"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p, index) => (
            <g key={index} className="group/point">
              <circle
                cx={p.x}
                cy={p.y}
                r={5}
                className="fill-white dark:fill-gray-900 stroke-indigo-600 dark:stroke-indigo-400 cursor-pointer"
                strokeWidth={2}
              />
              {/* Invisible larger circle to ease hovering */}
              <circle
                cx={p.x}
                cy={p.y}
                r={12}
                className="fill-transparent cursor-pointer"
              />
              {/* Value Tooltip Label (visible on point) */}
              <text
                x={p.x}
                y={p.y - 10}
                className="fill-gray-800 dark:fill-gray-200 font-bold text-[9px] pointer-events-none"
                textAnchor="middle"
              >
                {formatYLabel(p.followers)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
