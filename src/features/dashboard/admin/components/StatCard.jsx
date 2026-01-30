import "./StatCard.css";

const StatCard = ({ title, value, sub, icon, accent = "blue" }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-card-info">
          <span className="stat-card-title">{title}</span>
          <span className="stat-card-value">{value}</span>
          {sub && <span className="stat-card-sub">{sub}</span>}
        </div>
        <div className={`stat-card-icon stat-card-icon-${accent}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
