
import React, { useState, useMemo } from 'react';
import { FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import Modal from "../../../../dashboard/admin/components/ui/Modal";
import Select from "../../../../dashboard/admin/components/ui/Select";
import { yesNo } from "../../../utils/helpers";

const ModalGradeForm = ({ modal, onClose, educationLevels, grades, upsertGrade }) => {
  const id = modal.payload?.id;
  const mode = modal.payload?.mode;
  const existing = useMemo(() => grades.find((x) => x.id === id) || null, [grades, id]);

  const [levelId, setLevelId] = useState(existing?.education_level_id || educationLevels[0]?.id || "");
  const [gradeName, setGradeName] = useState(existing?.grade_name || "");

  const levelOptions = useMemo(
    () => educationLevels.map((l) => ({ value: l.id, label: `${l.name} (${yesNo(l.is_active)})` })),
    [educationLevels]
  );

  const canSave = !!levelId && gradeName.trim().length >= 1;

  return (
    <Modal title={mode === "edit" ? "Sửa khối" : "Thêm khối"} onClose={onClose}>
        {!educationLevels.length ? (
          <div className="warnBox">
            <FiAlertTriangle />
            <div>
              <div className="strong">Chưa có cấp học</div>
              <div className="muted">Hãy tạo education_levels trước khi tạo grades.</div>
            </div>
          </div>
        ) : null}

        <div className="formRow">
          <label>Cấp học *</label>
          <Select value={levelId} onChange={setLevelId} options={levelOptions} />
        </div>

        <div className="formRow">
          <label>grade_name *</label>
          <input className="input" value={gradeName} onChange={(e) => setGradeName(e.target.value)} placeholder="VD: 10 / 11 / 12" />
        </div>

        <div className="hint">
          Ràng buộc gợi ý: grade_name không trùng trong cùng education_level_id.
        </div>

        <div className="modalActions">
          <button className="btn btn-ghost" onClick={onClose}>
            Huỷ
          </button>
          <button
            className="btn"
            onClick={() => {
              upsertGrade({ id: existing?.id, education_level_id: levelId, grade_name: gradeName.trim() });
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

export default ModalGradeForm;
