
import React, { useState } from 'react';
import { FiCheckCircle } from "react-icons/fi";
import Modal from "../../../../dashboard/admin/components/ui/Modal";

const ModalConfigForm = ({ modal, onClose, systemConfig, saveConfig }) => {
  const [checkinStart, setCheckinStart] = useState(systemConfig.checkin_start_time);
  const [checkinEnd, setCheckinEnd] = useState(systemConfig.checkin_end_time);
  const [checkoutTime, setCheckoutTime] = useState(systemConfig.checkout_time);
  const [absentRule, setAbsentRule] = useState(systemConfig.absent_rule);

  const timeOk = checkinStart && checkinEnd && checkinStart < checkinEnd;
  const canSave = timeOk && checkoutTime && absentRule.trim().length >= 10;

  return (
    <Modal title="Sửa quy tắc điểm danh (system_config)" onClose={onClose} className="modal--wide">
      <div className="split">
          <div className="panelSection">
            <div className="panelSectionTitle">Thời gian</div>

            <div className="formRow">
              <label>checkin_start_time *</label>
              <input className="input" type="time" value={checkinStart} onChange={(e) => setCheckinStart(e.target.value)} />
            </div>

            <div className="formRow">
              <label>checkin_end_time *</label>
              <input className="input" type="time" value={checkinEnd} onChange={(e) => setCheckinEnd(e.target.value)} />
            </div>

            <div className="formRow">
              <label>checkout_time *</label>
              <input className="input" type="time" value={checkoutTime} onChange={(e) => setCheckoutTime(e.target.value)} />
            </div>

            {!timeOk ? (
              <div className="hint">Điều kiện: checkin_start_time &lt; checkin_end_time.</div>
            ) : (
              <div className="hint">
                Check-in hợp lệ: <span className="mono">{checkinStart}</span> → <span className="mono">{checkinEnd}</span>
              </div>
            )}

            <div className="modalActions" style={{ justifyContent: "flex-start" }}>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  saveConfig({
                    checkin_start_time: checkinStart,
                    checkin_end_time: checkinEnd,
                    checkout_time: checkoutTime,
                    _changed: "time",
                  });
                }}
                disabled={!timeOk || !checkoutTime}
                type="button"
              >
                <FiCheckCircle /> Lưu phần Thời gian
              </button>
            </div>
          </div>

          <div className="panelSection">
            <div className="panelSectionTitle">Quy tắc vắng học</div>

            <div className="formRow">
              <label>absent_rule *</label>
              <textarea
                className="input"
                style={{ minHeight: 160, resize: "vertical" }}
                value={absentRule}
                onChange={(e) => setAbsentRule(e.target.value)}
                placeholder="Mô tả quy định vắng/trễ, xử lý leave_requests…"
              />
            </div>

            <div className="hint">
              Nghiệp vụ: khi leave_requests APPROVED → cập nhật attendance_records tương ứng sang ABSENT_EXCUSED.
            </div>

            <div className="modalActions" style={{ justifyContent: "flex-start" }}>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  saveConfig({ absent_rule: absentRule.trim(), _changed: "absent" });
                }}
                disabled={absentRule.trim().length < 10}
                type="button"
              >
                <FiCheckCircle /> Lưu phần Quy tắc
              </button>
            </div>
          </div>
        </div>

        <div className="modalActions">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button
            className="btn"
            onClick={() => {
              saveConfig({
                checkin_start_time: checkinStart,
                checkin_end_time: checkinEnd,
                checkout_time: checkoutTime,
                absent_rule: absentRule.trim(),
                _changed: "time", // will also be followed by absent save below
              });
              saveConfig({ absent_rule: absentRule.trim(), _changed: "absent" });
              onClose();
            }}
            disabled={!canSave}
            type="button"
          >
            <FiCheckCircle /> Lưu tất cả
          </button>
        </div>
    </Modal>
  );
};

export default ModalConfigForm;
