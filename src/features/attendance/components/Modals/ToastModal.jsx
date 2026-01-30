import React from "react";
import ModalShell from "./ModalShell";
import { FiCheckCircle, FiInfo } from "react-icons/fi";

export default function ToastModal({ modal, onClose }) {
  const title = modal?.payload?.title || "Thông báo";
  const desc = modal?.payload?.desc || "";

  return (
    <ModalShell
      title={title}
      subtitle={desc}
      onClose={onClose}
      footer={
        <button className="btn" onClick={onClose}>
          <FiCheckCircle /> OK
        </button>
      }
    >
      <div className="infoBox">
        <FiInfo />
        <div>
          <div className="strong">Chi tiết</div>
          <div className="muted">{desc || "—"}</div>
        </div>
      </div>
    </ModalShell>
  );
}
