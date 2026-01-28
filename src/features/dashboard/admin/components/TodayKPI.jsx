import "./TodayKPI.css";

const TodayKPI = ({ items }) => {
  return (
    <div className="today-kpi">
      {items.map((kpi, idx) => (
        <div key={idx} className="kpi-item">
          <div className="kpi-label">{kpi.label}</div>
          <div className="kpi-value">
            {kpi.value}
            <span className={`kpi-delta ${kpi.delta > 0 ? "up" : "down"}`}>
              {kpi.delta > 0 ? "▲" : "▼"} {Math.abs(kpi.delta)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodayKPI;
