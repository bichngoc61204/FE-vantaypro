import "./AttendanceBreakdown.css";

const AttendanceBreakdown = ({ data }) => {
  const items = [
    { key: "present", label: data[0].name, count: data[0].value, color: "#22c55e" },
    { key: "late", label: data[1].name, count: data[1].value, color: "#facc15" },
    { key: "absentExcused", label: data[2].name, count: data[2].value, color: "#38bdf8" },
    { key: "absentUnexcused", label: data[3].name, count: data[3].value, color: "#ef4444" },
  ];

  return (
    <div className="attendance-breakdown">
      {items.map(item => (
        <div key={item.key} className="breakdown-item">
          <div className="breakdown-indicator" style={{ backgroundColor: item.color }} />
          <div className="breakdown-info">
            <span className="breakdown-label">{item.label}</span>
            <span className="breakdown-value">{item.count}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttendanceBreakdown;
