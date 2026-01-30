import React, { useMemo } from "react";
import ModalShell from "./ModalShell";
import { FiAlertTriangle, FiEye, FiZap } from "react-icons/fi";

export default function AnomalyDetailModal({
  modal,
  onClose,
  anomalies,
  logs,
  students,
  sessions,
  classes,
  openModal,
}) {
  const anomaly = modal?.payload?.anomaly;

  const related = useMemo(() => {
    if (!anomaly) return { logs: [], students: [], sessions: [] };

    if (anomaly.type === "DUPLICATE_LOG" || anomaly.type === "OUT_OF_RANGE") {
      const lg = logs.filter((l) => anomaly.ref.includes(l.id));
      return { logs: lg, students: [], sessions: [] };
    }

    if (anomaly.type === "MISSING_FINGERPRINT") {
      const st = students.filter((s) => anomaly.ref.includes(s.id));
      return { logs: [], students: st, sessions: [] };
    }

    if (anomaly.type === "MISSING_RECORDS" || anomaly.type === "NOT_GENERATED") {
      const ss = sessions.filter((s) => anomaly.ref.includes(s.id));
      return { logs: [], students: [], sessions: ss };
    }

    return { logs: [], students: [], sessions: [] };
  }, [anomaly, logs, students, sessions]);

  const clsName = (cid) => classes.find((c) => c.id === cid)?.class_name || "—";

  if (!anomaly) {
    return (
      <ModalShell title="Chi tiết bất thường" subtitle="Không có dữ liệu" onClose={onClose} footer={<button className="btn" onClick={onClose}>Đóng</button>}>
        <div className="empty">Không tìm thấy anomaly.</div>
      </ModalShell>
    );
  }

  return (
    <ModalShell
      title={`Chi tiết bất thường • ${anomaly.title}`}
      subtitle={`${anomaly.type} • severity: ${anomaly.severity}`}
      onClose={onClose}
      footer={<button className="btn" onClick={onClose}>Đóng</button>}
    >
      <div className="panel">
        <div className="warnBox">
          <FiAlertTriangle />
          <div>
            <div className="strong">{anomaly.title}</div>
            <div className="muted">{anomaly.detail}</div>
          </div>
        </div>

        {related.sessions.length ? (
          <div className="panelSection">
            <div className="panelSectionTitle">Sessions liên quan</div>
            {related.sessions.map((ss) => (
              <div key={ss.id} className="miniRow" style={{ gridTemplateColumns: "1fr 120px 140px" }}>
                <div>
                  <div className="strong">{clsName(ss.class_id)} • {ss.session_date}</div>
                  <div className="muted mono">{ss.start_time}-{ss.end_time} • {ss.id}</div>
                </div>
                <button className="btn btn-ghost" onClick={() => openModal("sessionDetails", { sessionId: ss.id })}>
                  <FiEye /> Xem
                </button>
                {anomaly.type === "NOT_GENERATED" ? (
                  <button className="btn" onClick={() => openModal("reconcile", { sessionId: ss.id })}>
                    <FiZap /> Đối soát
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {related.logs.length ? (
          <div className="panelSection">
            <div className="panelSectionTitle">Logs liên quan</div>
            <div className="tableWrap">
              <table className="table" style={{ minWidth: 740 }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student</th>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {related.logs.map((l) => (
                    <tr key={l.id}>
                      <td className="mono">{l.id}</td>
                      <td className="mono">{l.student_id}</td>
                      <td className="mono">{l.log_time.replace("T", " ")}</td>
                      <td><span className="pill pill--info">{l.log_type}</span></td>
                      <td className="mono muted">{l.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {related.students.length ? (
          <div className="panelSection">
            <div className="panelSectionTitle">Học sinh liên quan</div>
            {related.students.map((s) => (
              <div key={s.id} className="miniRow" style={{ gridTemplateColumns: "1fr 180px" }}>
                <div>
                  <div className="strong">{s.student_code} • {s.full_name}</div>
                  <div className="muted mono">fingerprint_id: {s.fingerprint_id || "NULL"}</div>
                </div>
                <button className="btn btn-ghost" onClick={() => alert("Navigate sang module Học sinh để gán fingerprint_id")}>
                  <FiEye /> Mở hồ sơ
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
}
