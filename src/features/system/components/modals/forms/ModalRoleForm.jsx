
import React, { useState, useMemo } from 'react';
import { FiToggleRight, FiToggleLeft, FiCheckCircle } from "react-icons/fi";
import Modal from "../../../../dashboard/admin/components/ui/Modal";

const ModalRoleForm = ({ modal, onClose, studentRoles, upsertRole }) => {
  const id = modal.payload?.id;
  const mode = modal.payload?.mode;
  const existing = useMemo(() => studentRoles.find((x) => x.id === id) || null, [studentRoles, id]);

  const [code, setCode] = useState(existing?.role_code || "");
  const [name, setName] = useState(existing?.role_name || "");
  const [desc, setDesc] = useState(existing?.description || "");
  const [isActive, setIsActive] = useState(existing?.is_active ?? true);

  const canSave = code.trim().length >= 2 && name.trim().length >= 2;

  return (
    <Modal title={mode === "edit" ? "Sửa vai trò học sinh" : "Thêm vai trò học sinh"} onClose={onClose}>
      <div className="formRow">
          <label>role_code *</label>
          <input
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="VD: LEADER / VICE_LEADER"
          />
        </div>

        <div className="formRow">
          <label>role_name *</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Lớp trưởng" />
        </div>

        <div className="formRow">
          <label>Description</label>
          <input className="input" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Mô tả…" />
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
        </div>

        <div className="modalActions">
          <button className="btn btn-ghost" onClick={onClose}>
            Huỷ
          </button>
          <button
            className="btn"
            onClick={() => {
              upsertRole({ id: existing?.id, role_code: code.trim(), role_name: name.trim(), description: desc.trim(), is_active: isActive });
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

export default ModalRoleForm;
