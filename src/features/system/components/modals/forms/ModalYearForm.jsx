
import React, { useState, useMemo } from 'react';
import { FiCheckCircle } from "react-icons/fi";
import Modal from "../../../../dashboard/admin/components/ui/Modal";
import Calendar from "../../../../dashboard/admin/components/ui/Calendar/Calendar";

const ModalYearForm = ({ modal, onClose, academicYears, upsertYear }) => {
  const id = modal.payload?.id;
  const mode = modal.payload?.mode;
  const existing = useMemo(() => academicYears.find((x) => x.id === id) || null, [academicYears, id]);

  const [name, setName] = useState(existing?.name || "");
  const [startDate, setStartDate] = useState(existing?.start_date || "");
  const [endDate, setEndDate] = useState(existing?.end_date || "");

  const canSave =
    name.trim().length >= 4 &&
    !!startDate &&
    !!endDate &&
    new Date(startDate).getTime() < new Date(endDate).getTime();

  return (
    <Modal title={mode === "edit" ? "Sửa năm học" : "Thêm năm học"} onClose={onClose}>
      <div className="formRow">
          <label>Name *</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: 2025-2026" />
        </div>

        <div className="formRow">
          <Calendar label="Start date *" value={startDate} onChange={setStartDate} placeholder="Chọn ngày bắt đầu" />
        </div>

        <div className="formRow">
          <Calendar label="End date *" value={endDate} onChange={setEndDate} placeholder="Chọn ngày kết thúc" />
        </div>

        {!canSave && (name || startDate || endDate) ? (
          <div className="hint">
            Điều kiện: start_date &lt; end_date và name hợp lệ (VD: 2025-2026).
          </div>
        ) : null}

        <div className="modalActions">
          <button className="btn btn-ghost" onClick={onClose}>
            Huỷ
          </button>
          <button
            className="btn"
            onClick={() => {
              upsertYear({ id: existing?.id, name: name.trim(), start_date: startDate, end_date: endDate });
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

export default ModalYearForm;
