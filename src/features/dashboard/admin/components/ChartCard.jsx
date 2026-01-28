import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useLanguage } from "../../../../context/useLanguage";
import "./ChartCard.css";

const COLORS = ["#22c55e", "#facc15", "#38bdf8", "#ef4444"];

/*  Tooltip dùng chung  */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        {label && <div className="tooltip-label">{label}</div>}
        {payload.map((item, idx) => (
          <div key={idx} className="tooltip-value">
            <span
              className="tooltip-dot"
              style={{ backgroundColor: item.color }}
            />
            {item.name}: <b>{item.value}</b>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ChartCard = ({ title, type = "pie", data }) => {
  const { t } = useLanguage();

  /*  Translate labels  */
  const translatedData =
    type === "pie"
      ? data.map((item) => ({
          ...item,
          name: t(`attendance.${item.key}`),
        }))
      : data.map((item) => ({
          ...item,
          dayLabel: t(`day.${item.day}`),
        }));

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h2>{title}</h2>
      </div>

      <div className="chart-card-body">
        <ResponsiveContainer width="100%" height={280}>
          {/*  PIE CHART  */}
          {type === "pie" && (
            <PieChart>
              <Pie
                data={translatedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={48}
                label={(entry) => `${entry.value}%`}
                labelLine={false}
              >
                {translatedData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                height={36}
              />
            </PieChart>
          )}

          {/*  AREA CHART (RECOMMENDED)  */}
          {type === "area" && (
            <AreaChart
              data={translatedData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="dayLabel"
                tick={{ fill: "var(--ts)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--ts)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="present"
                name={t("attendance.present")}
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#presentGradient)"
              />
            </AreaChart>
          )}

          {/*  LINE CHART  */}
          {type === "line" && (
            <LineChart
              data={translatedData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="dayLabel"
                tick={{ fill: "var(--ts)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--ts)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey="present"
                name={t("attendance.present")}
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
