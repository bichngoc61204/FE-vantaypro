
import React, { useState, useMemo } from 'react';
import { FiToggleRight, FiToggleLeft, FiCheckCircle } from "react-icons/fi";
import Modal from "../../../../dashboard/admin/components/ui/Modal";

const ModalSubjectForm = ({ modal, onClose, subjects, upsertSubject }) => {
  const id = modal.payload?.id;
  const mode = modal.payload?.mode;
  const existing = useMemo(() => subjects.find((x) => x.id === id) || null, [subjects, id]);

  const [code, setCode] = useState(existing?.subject_code || "");
  const [name, setName] = useState(existing?.subject_name || "");
  const [isActive, setIsActive] = useState(existing?.is_active ?? true);

  const canSave = code.trim().length >= 2 && name.trim().length >= 2;

  return (
    <Modal title={mode === "edit" ? "Sửa môn học" : "Thêm môn học"} onClose={onClose}>
      <div className="formRow">
          <label>subject_code *</label>
          <input
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="VD: TOAN / VAN / ANH"
          />
        </div>

        <div className="formRow">
          <label>subject_name *</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Toán" />
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

        <div className="hint">Gợi ý: subject_code unique, uppercase.</div>

        <div className="modalActions">
          <button className="btn btn-ghost" onClick={onClose}>
            Huỷ
          </button>
          <button
            className="btn"
            onClick={() => {
              upsertSubject({ id: existing?.id, subject_code: code.trim(), subject_name: name.trim(), is_active: isActive });
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

export default ModalSubjectForm;
