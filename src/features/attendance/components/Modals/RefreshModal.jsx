import React from "react";
import ModalShell from "./ModalShell";
import { FiRefreshCw, FiInfo } from "react-icons/fi";

export default function RefreshModal({ onClose, pushToast }) {
  const doRefresh = () => {
    onClose();
    pushToast("Refresh (mock)", "Khi tích hợp API: refetch sessions/logs/records/anomalies theo filter hiện tại.");
  };

  return (
    <ModalShell
      title="Refresh dữ liệu"
      subtitle="Tải lại dữ liệu theo bộ lọc hiện tại"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Hủy
          </button>
          <button className="btn" onClick={doRefresh}>
            <FiRefreshCw /> Refresh
          </button>
        </>
      }
    >
      <div className="infoBox">
        <FiInfo />
        <div>
          <div className="strong">Refresh sẽ làm gì?</div>
          <div className="muted">
            • Tải lại sessions / logs / records <br />
            • Tính lại anomalies & KPI <br />
            • Đồng bộ trạng thái UI
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
