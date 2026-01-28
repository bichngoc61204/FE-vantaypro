import "./ActionCenter.css";

const ActionCenter = ({ actions }) => {
  return (
    <div className="action-center">
      <h3>Việc cần xử lý</h3>
      {actions.map((a, idx) => (
        <div key={idx} className="action-item">
          <div>
            <div className="action-title">{a.title}</div>
            <div className="action-desc">{a.desc}</div>
          </div>
          <button className="action-btn">Mở</button>
        </div>
      ))}
    </div>
  );
};

export default ActionCenter;
