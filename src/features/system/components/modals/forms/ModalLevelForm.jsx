
import React, { useState, useMemo } from 'react';
import { FiToggleRight, FiToggleLeft, FiCheckCircle } from "react-icons/fi";
import Modal from "../../../../dashboard/admin/components/ui/Modal";

const ModalLevelForm = ({ modal, onClose, educationLevels, upsertLevel }) => {
  const id = modal.payload?.id;
  const mode = modal.payload?.mode;
  const existing = useMemo(() => educationLevels.find((x) => x.id === id) || null, [educationLevels, id]);

  const [name, setName] = useState(existing?.name || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [isActive, setIsActive] = useState(existing?.is_active ?? true);

  const canSave = name.trim().length >= 2;

  return (
    <Modal title={mode === "edit" ? "Sửa cấp học" : "Thêm cấp học"} onClose={onClose}>
      <div className="formRow">
        <label>Name *</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: THPT" />
      </div>

      <div className="formRow">
        <label>Description</label>
        <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả…" />
      </div>

      <div className="formRow row" style={{ marginTop: 12 }}>
        <span className="muted">is_active</span>
        <button
          className={`pill ${isActive ? "pill--ok" : "pill--danger"}`}
          onClick={() => setIsActive((v) => !v)}
          type="button"
        >
          {isActive ? <FiToggleRight /> : <FiToggleLeft />} {isActive ? "ACTIVE" : "INACTIVE"}
        </button>
        <div className="muted">• Khi inactive: chặn dùng khi tạo mới khối/lớp.</div>
      </div>

      <div className="modalActions">
        <button className="btn btn-ghost" onClick={onClose}>
          Huỷ
        </button>
        <button
          className="btn"
          onClick={() => {
            upsertLevel({ id: existing?.id, name: name.trim(), description: description.trim(), is_active: isActive });
            onClose();
          }}
          disabled={!canSave}
        >
          <FiCheckCircle /> Lưu
        </button>
      </div>
    </Modal>
  );
};

export default ModalLevelForm;
