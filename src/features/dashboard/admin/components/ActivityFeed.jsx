import "./ActivityFeed.css";

const ActivityFeed = ({ activities }) => {
  return (
    <div className="activity-feed">
      <h3>Hoạt động gần đây</h3>
      {activities.map((a, idx) => (
        <div key={idx} className="activity-item">
          <span className="activity-time">{a.time}</span>
          <span className="activity-text">{a.text}</span>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
