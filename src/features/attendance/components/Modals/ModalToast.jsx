import React from "react";
import ModalShell from "./ModalShell";

export default function ModalToast({ modal, onClose }) {
  return (
    <ModalShell
      title={modal.payload?.title || "Thông báo"}
      subtitle={modal.payload?.desc || ""}
      onClose={onClose}
      footer={<button className="btn" onClick={onClose}>OK</button>}
    >
      <div />
    </ModalShell>
  );
}
