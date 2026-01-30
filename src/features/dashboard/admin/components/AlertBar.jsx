import "./AlertBar.css";
import { FiAlertTriangle } from "react-icons/fi";

const AlertBar = ({ alerts }) => {
  if (!alerts?.length) return null;

  return (
    <div className="alert-bar">
      <FiAlertTriangle className="alert-icon" />
      <div className="alert-items">
        {alerts.map((a, idx) => (
          <span key={idx} className={`alert-pill alert-${a.level}`}>
            {a.label}: {a.value}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AlertBar;
