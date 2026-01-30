
import React from 'react';
import Modal from "../../../dashboard/admin/components/ui/Modal";

const ModalToast = ({ modal, onClose }) => {
  return (
    <Modal title={modal.payload?.title || "Thông báo"} onClose={onClose}>
      <div className="muted" style={{ marginBottom: 14 }}>{modal.payload?.desc}</div>
      <div className="modalActions">
        <button className="btn" onClick={onClose}>
          OK
        </button>
      </div>
    </Modal>
  );
};

export default ModalToast;
