
/* ==
   ADMIN — SYSTEM STRUCTURE
   Refactored to split components/hooks/utils/styles.
== */
import React, { useState, useEffect, useMemo } from "react";
import {
  FiSettings,
  FiLayers,
  FiHash,
  FiCalendar,
  FiBookOpen,
  FiAward,
  FiShield,
  FiFileText,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiRefreshCw,
  FiDownload,
  FiCheckCircle,
  FiSearch
} from "react-icons/fi";

import Card from "../../dashboard/admin/components/ui/Card";
import Select from "../../dashboard/admin/components/ui/Select";
import SearchInput from "../../dashboard/admin/components/ui/SearchInput";
import Pagination from "../../dashboard/admin/components/ui/Pagination";
import ConfirmModal from "../../dashboard/admin/components/ui/ConfirmModal";

import EntityTable from "../components/ui/EntityTable";
import ModalHost from "../components/modals/ModalHost"; // Import ModalHost
import { useSystemData } from "../hooks/useSystemData";
import { TABS, ENTITY_OPTIONS, SUBJECT_STATUS_OPTIONS } from "../constants";
import { nowStr } from "../utils/helpers";

import "../styles/AdminSystemStructure.css";

const AdminSystemStructure = () => {
    // --- Data Hooks ---
    const {
        auditLogs,
        educationLevels,
        grades,
        academicYears,
        subjects,
        studentRoles,
        systemConfig,
        levelName,
        currentYear,
        pushAudit,
        actions
    } = useSystemData();

  // --- UI State ---
  const [activeTab, setActiveTab] = useState("levels");
  
  // Modals
  const [modal, setModal] = useState({ open: false, type: "", payload: null });
  const openModal = (type, payload = null) => setModal({ open: true, type, payload });
  const closeModal = () => setModal({ open: false, type: "", payload: null });
  const toast = (title, desc) => openModal("toast", { title, desc });

  // Confirm
  const [confirm, setConfirm] = useState(null); // { title, desc, confirmLabel, tone, onConfirm }

  // --- Search / Filters ---
  const [qLevels, setQLevels] = useState("");
  const [qGrades, setQGrades] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL"); // for Grades tab

  const [qYears, setQYears] = useState("");
  const [qSubjects, setQSubjects] = useState("");
  const [subjectStatus, setSubjectStatus] = useState("ALL");

  const [qRoles, setQRoles] = useState("");
  const [roleStatus, setRoleStatus] = useState("ALL");

  const [qAudit, setQAudit] = useState("");
  const [entityFilter, setEntityFilter] = useState("ALL");

  //  Header actions 
  const handleRefresh = () => {
    toast("Refresh", "Đã refresh (mock). Khi có API, nút này sẽ refetch toàn bộ master-data + config.");
  };

  const handleExport = () => {
    const payload = {
      education_levels: educationLevels,
      grades,
      academic_years: academicYears,
      subjects,
      student_roles: studentRoles,
      system_config: systemConfig,
      exported_at: nowStr(),
    };
    const text = JSON.stringify(payload, null, 2);
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `system-structure-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    pushAudit("EXPORT_SYSTEM_STRUCTURE", "system_config", "singleton");
  };

  //  Handlers (with Confirmation) 

  // Levels
  const handleToggleLevel = (id) => {
    const row = educationLevels.find((x) => x.id === id);
    if (!row) return;

    setConfirm({
      title: `${row.is_active ? "Vô hiệu hoá" : "Kích hoạt"} cấp học?`,
      desc: "Cấp học ảnh hưởng tới danh mục khối/lớp. Nếu vô hiệu hoá, các màn hình tạo mới (khối/lớp) nên chặn lựa chọn cấp này.",
      confirmLabel: row.is_active ? "Vô hiệu hoá" : "Kích hoạt",
      tone: row.is_active ? "danger" : "ok",
      onConfirm: () => {
        actions.toggleLevel(id);
        setConfirm(null);
      },
    });
  };

  // Grades
  const handleDeleteGrade = (id) => {
    setConfirm({
      title: "Xoá khối?",
      desc: "Chỉ nên xoá khi chưa có lớp nào dùng khối này. Nếu đã dùng, hãy giữ để không phá báo cáo.",
      confirmLabel: "Xoá",
      tone: "danger",
      onConfirm: () => {
        actions.deleteGrade(id);
        setConfirm(null);
      },
    });
  };

  // Years
  const handleSetCurrentYear = (id) => {
    const target = academicYears.find((x) => x.id === id);
    if (!target) return;

    setConfirm({
      title: "Đặt năm học hiện tại?",
      desc: "Hệ thống chỉ có 1 năm học is_current=TRUE. Thao tác này ảnh hưởng tạo lớp, tạo TKB, sinh phiên điểm danh và báo cáo.",
      confirmLabel: "Đặt hiện tại",
      tone: "ok",
      onConfirm: () => {
        actions.setCurrentYear(id);
        setConfirm(null);
      },
    });
  };

  // Subjects
  const handleToggleSubject = (id) => {
    const row = subjects.find((x) => x.id === id);
    if (!row) return;

    setConfirm({
      title: `${row.is_active ? "Vô hiệu hoá" : "Kích hoạt"} môn học?`,
      desc: "Nếu môn học đang được dùng trong TKB/Phân công, nên confirm mạnh. Khi inactive, UI tạo mới TKB/Phân công nên chặn môn này.",
      confirmLabel: row.is_active ? "Vô hiệu hoá" : "Kích hoạt",
      tone: row.is_active ? "danger" : "ok",
      onConfirm: () => {
        actions.toggleSubject(id);
        setConfirm(null);
      },
    });
  };

  // Roles
  const handleToggleRole = (id) => {
    const row = studentRoles.find((x) => x.id === id);
    if (!row) return;

    setConfirm({
      title: `${row.is_active ? "Vô hiệu hoá" : "Kích hoạt"} vai trò?`,
      desc: "Vai trò học sinh dùng cho hiển thị/ghi nhận chức vụ. Nếu inactive, UI gán vai trò nên chặn role này.",
      confirmLabel: row.is_active ? "Vô hiệu hoá" : "Kích hoạt",
      tone: row.is_active ? "danger" : "ok",
      onConfirm: () => {
        actions.toggleRole(id);
        setConfirm(null);
      },
    });
  };


  /* ==
     TAB VIEWS (Filters & Sorts)
     == */

  // LEVELS
  const levelsView = useMemo(() => {
    const nq = (qLevels || "").toLowerCase().trim();
    return educationLevels.filter((x) => !nq || x.name.toLowerCase().includes(nq) || (x.description || "").toLowerCase().includes(nq));
  }, [educationLevels, qLevels]);

  // GRADES
  const gradeLevelOptions = useMemo(() => {
    return [{ value: "ALL", label: "Tất cả cấp học" }].concat(
      educationLevels.map((l) => ({ value: l.id, label: l.name }))
    );
  }, [educationLevels]);

  const gradesView = useMemo(() => {
    const nq = (qGrades || "").toLowerCase().trim();
    return grades
      .filter((g) => (levelFilter === "ALL" ? true : g.education_level_id === levelFilter))
      .filter((g) => !nq || g.grade_name.toLowerCase().includes(nq) || levelName(g.education_level_id).toLowerCase().includes(nq))
      .sort((a, b) => (levelName(a.education_level_id) + a.grade_name).localeCompare(levelName(b.education_level_id) + b.grade_name));
  }, [grades, qGrades, levelFilter, educationLevels, levelName]); // added levelName dep just in case, though it comes from hook

  // YEARS
  const yearsView = useMemo(() => {
    const nq = (qYears || "").toLowerCase().trim();
    return academicYears
      .filter((y) => !nq || y.name.toLowerCase().includes(nq))
      .sort((a, b) => (b.start_date || "").localeCompare(a.start_date || ""));
  }, [academicYears, qYears]);

  // SUBJECTS
  const subjectsView = useMemo(() => {
    const nq = (qSubjects || "").toLowerCase().trim();
    return subjects
      .filter((s) => (subjectStatus === "ALL" ? true : subjectStatus === "ACTIVE" ? s.is_active : !s.is_active))
      .filter((s) => !nq || s.subject_code.toLowerCase().includes(nq) || s.subject_name.toLowerCase().includes(nq))
      .sort((a, b) => a.subject_code.localeCompare(b.subject_code));
  }, [subjects, qSubjects, subjectStatus]);

  // ROLES
  const rolesView = useMemo(() => {
    const nq = (qRoles || "").toLowerCase().trim();
    return studentRoles
      .filter((r) => (roleStatus === "ALL" ? true : roleStatus === "ACTIVE" ? r.is_active : !r.is_active))
      .filter(
        (r) =>
          !nq ||
          r.role_code.toLowerCase().includes(nq) ||
          r.role_name.toLowerCase().includes(nq) ||
          (r.description || "").toLowerCase().includes(nq)
      )
      .sort((a, b) => a.role_code.localeCompare(b.role_code));
  }, [studentRoles, qRoles, roleStatus]);

  // AUDIT
  const auditView = useMemo(() => {
    const nq = (qAudit || "").toLowerCase().trim();
    return auditLogs
      .filter((a) => (entityFilter === "ALL" ? true : a.entity === entityFilter))
      .filter(
        (a) =>
          !nq ||
          a.action.toLowerCase().includes(nq) ||
          a.entity.toLowerCase().includes(nq) ||
          (a.entity_id || "").toLowerCase().includes(nq) ||
          (a.user_id || "").toLowerCase().includes(nq)
      );
  }, [auditLogs, qAudit, entityFilter]);

  // Pagination for audit
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  useEffect(() => setPage(1), [activeTab, qAudit, entityFilter]);
  const totalPages = Math.max(1, Math.ceil(auditView.length / ITEMS_PER_PAGE));
  const auditPaged = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return auditView.slice(start, start + ITEMS_PER_PAGE);
  }, [auditView, page]);


  /* ==
     RENDER PAGE
     == */
  return (
    <div className="sys-page">
      {/* HEADER */}
      <div className="sys-header">
        <div className="sys-header__left">
          <div className="sys-title">
            <FiSettings /> Cấu trúc hệ thống
          </div>
          <div className="sys-sub">
            Quản lý danh mục nền tảng (cấp/khối/năm/môn/vai trò) và cấu hình quy tắc điểm danh (system_config).
          </div>
          <div className="sys-badges">
            <span className="pill pill--ok">
              <FiCheckCircle /> Năm hiện tại: <span className="mono">{currentYear?.name || "—"}</span>
            </span>
            <span className="pill pill--muted">
              Updated: <span className="mono">{systemConfig.updated_at}</span>
            </span>
          </div>
        </div>

        <div className="sys-header__right">
          <button className="btn btn-ghost" onClick={handleRefresh}>
            <FiRefreshCw /> Refresh
          </button>
          <button className="btn btn-ghost" onClick={handleExport}>
            <FiDownload /> Export JSON
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="sys-layout">
        <div className="sys-left">
          <Card icon={<FiShield />} title="Danh mục cấu trúc" subtitle="Chọn 1 mục để quản lý">
            <div className="sys-tabs">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={`sys-tab ${activeTab === t.key ? "active" : ""}`}
                  onClick={() => setActiveTab(t.key)}
                  type="button"
                >
                  <span className="sys-tab__ic">{t.icon}</span>
                  <span className="sys-tab__lb">{t.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="sys-right">
          {activeTab === "levels" ? (
            <Card
              icon={<FiLayers />}
              title="Cấp học (education_levels)"
              subtitle="CRUD + kích hoạt/vô hiệu hoá cấp học"
              right={
                <button
                  className="btn"
                  onClick={() => openModal("levelForm", { mode: "create" })}
                >
                  <FiPlus /> Thêm cấp học
                </button>
              }
            >
              <div className="toolbarRow">
                <SearchInput
                  value={qLevels}
                  onChange={setQLevels}
                  placeholder="Tìm theo tên/mô tả cấp học…"
                  label={null}
                  style={{ flex: 1, minWidth: 220 }}
                />
              </div>

              <EntityTable
                columns={[
                  { key: "name", header: "Tên cấp" },
                  { key: "description", header: "Mô tả" },
                  { key: "status", header: "Trạng thái" },
                  { key: "actions", header: "", align: "right" },
                ]}
                rows={levelsView.map((x) => ({
                  id: x.id,
                  cells: {
                    name: <span className="strong">{x.name}</span>,
                    description: <span className="muted">{x.description || "—"}</span>,
                    status: (
                      <span className={`pill ${x.is_active ? "pill--ok" : "pill--danger"}`}>
                        {x.is_active ? <FiToggleRight /> : <FiToggleLeft />}
                        {x.is_active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    ),
                    actions: (
                      <div className="rowBtns">
                        <button
                          className="iconBtn success"
                          title="Sửa"
                          onClick={() => openModal("levelForm", { mode: "edit", id: x.id })}
                        >
                          <FiEdit2 />
                        </button>
                        <button className="iconBtn warn" title="Bật/Tắt" onClick={() => handleToggleLevel(x.id)}>
                          {x.is_active ? <FiToggleRight /> : <FiToggleLeft />}
                        </button>
                      </div>
                    ),
                  },
                }))}
                emptyText="Chưa có cấp học."
              />
            </Card>
          ) : null}

          {activeTab === "grades" ? (
            <Card
              icon={<FiHash />}
              title="Khối (grades)"
              subtitle="Khối thuộc cấp học — dùng để tạo lớp"
              right={
                <button
                  className="btn"
                  onClick={() => openModal("gradeForm", { mode: "create" })}
                  disabled={!educationLevels.length}
                >
                  <FiPlus /> Thêm khối
                </button>
              }
            >
              <div className="toolbarRow">
                <div className="filter">
                  <FiLayers className="mutedIc" />
                  <Select value={levelFilter} onChange={setLevelFilter} options={gradeLevelOptions} />
                </div>
                <div style={{ flex: 1 }} />
                <div className="searchMini">
                  <FiSearch className="mutedIc" />
                  <SearchInput
                    value={qGrades}
                    onChange={setQGrades}
                    placeholder="Tìm theo khối hoặc cấp…"
                    label={null}
                    style={{ minWidth: 260 }}
                  />
                </div>
              </div>

              <EntityTable
                columns={[
                  { key: "grade", header: "Khối" },
                  { key: "level", header: "Cấp học" },
                  { key: "actions", header: "", align: "right" },
                ]}
                rows={gradesView.map((g) => ({
                  id: g.id,
                  cells: {
                    grade: <span className="strong">{g.grade_name}</span>,
                    level: <span className="pill pill--muted">{levelName(g.education_level_id)}</span>,
                    actions: (
                      <div className="rowBtns">
                        <button
                          className="iconBtn success"
                          title="Sửa"
                          onClick={() => openModal("gradeForm", { mode: "edit", id: g.id })}
                        >
                          <FiEdit2 />
                        </button>
                        <button className="iconBtn danger" title="Xoá" onClick={() => handleDeleteGrade(g.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    ),
                  },
                }))}
                emptyText="Chưa có khối."
              />
            </Card>
          ) : null}

          {activeTab === "years" ? (
            <Card
              icon={<FiCalendar />}
              title="Năm học (academic_years)"
              subtitle="Chỉ có 1 năm học is_current=TRUE"
              right={
                <button
                  className="btn"
                  onClick={() => openModal("yearForm", { mode: "create" })}
                >
                  <FiPlus /> Thêm năm học
                </button>
              }
            >
              <div className="toolbarRow">
                <SearchInput
                  value={qYears}
                  onChange={setQYears}
                  placeholder="Tìm theo tên năm học… (VD: 2025-2026)"
                  label={null}
                  style={{ flex: 1, minWidth: 260 }}
                />
              </div>

              <EntityTable
                columns={[
                  { key: "name", header: "Năm học" },
                  { key: "range", header: "Thời gian" },
                  { key: "current", header: "Hiện tại" },
                  { key: "actions", header: "", align: "right" },
                ]}
                rows={yearsView.map((y) => ({
                  id: y.id,
                  cells: {
                    name: <span className="strong">{y.name}</span>,
                    range: <span className="mono muted">{y.start_date} → {y.end_date}</span>,
                    current: (
                      <span className={`pill ${y.is_current ? "pill--ok" : "pill--muted"}`}>
                        {y.is_current ? <FiCheckCircle /> : <FiCalendar />}
                        {y.is_current ? "CURRENT" : "—"}
                      </span>
                    ),
                    actions: (
                      <div className="rowBtns">
                        <button
                          className="iconBtn success"
                          title="Sửa"
                          onClick={() => openModal("yearForm", { mode: "edit", id: y.id })}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => handleSetCurrentYear(y.id)}
                          disabled={y.is_current}
                          title="Đặt năm học hiện tại"
                        >
                          <FiCheckCircle /> Set current
                        </button>
                      </div>
                    ),
                  },
                }))}
                emptyText="Chưa có năm học."
              />
            </Card>
          ) : null}

          {activeTab === "subjects" ? (
            <Card
              icon={<FiBookOpen />}
              title="Môn học (subjects)"
              subtitle="Môn inactive sẽ bị chặn trong TKB/Phân công"
              right={
                <button
                  className="btn"
                  onClick={() => openModal("subjectForm", { mode: "create" })}
                >
                  <FiPlus /> Thêm môn
                </button>
              }
            >
              <div className="toolbarRow">
                <div style={{ flex: 1 }}>
                  <SearchInput
                    value={qSubjects}
                    onChange={setQSubjects}
                    placeholder="Tìm theo subject_code hoặc tên môn…"
                    label={null}
                    style={{ width: "100%", minWidth: 260 }}
                  />
                </div>
                <div className="filter">
                  <FiShield className="mutedIc" />
                  <Select value={subjectStatus} onChange={setSubjectStatus} options={SUBJECT_STATUS_OPTIONS} />
                </div>
              </div>

              <EntityTable
                columns={[
                  { key: "code", header: "Mã môn" },
                  { key: "name", header: "Tên môn" },
                  { key: "status", header: "Trạng thái" },
                  { key: "actions", header: "", align: "right" },
                ]}
                rows={subjectsView.map((s) => ({
                  id: s.id,
                  cells: {
                    code: <span className="mono strong">{s.subject_code}</span>,
                    name: <span className="strong">{s.subject_name}</span>,
                    status: (
                      <span className={`pill ${s.is_active ? "pill--ok" : "pill--danger"}`}>
                        {s.is_active ? <FiToggleRight /> : <FiToggleLeft />}
                        {s.is_active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    ),
                    actions: (
                      <div className="rowBtns">
                        <button
                          className="iconBtn success"
                          title="Sửa"
                          onClick={() => openModal("subjectForm", { mode: "edit", id: s.id })}
                        >
                          <FiEdit2 />
                        </button>
                        <button className="iconBtn warn" title="Bật/Tắt" onClick={() => handleToggleSubject(s.id)}>
                          {s.is_active ? <FiToggleRight /> : <FiToggleLeft />}
                        </button>
                      </div>
                    ),
                  },
                }))}
                emptyText="Chưa có môn học."
              />
            </Card>
          ) : null}

          {activeTab === "roles" ? (
            <Card
              icon={<FiAward />}
              title="Vai trò học sinh (student_roles)"
              subtitle="Dùng cho chức vụ học sinh trong lớp (Leader/Vice…)."
              right={
                <button
                  className="btn"
                  onClick={() => openModal("roleForm", { mode: "create" })}
                >
                  <FiPlus /> Thêm vai trò
                </button>
              }
            >
              <div className="toolbarRow">
                <div style={{ flex: 1 }}>
                  <SearchInput
                    value={qRoles}
                    onChange={setQRoles}
                    placeholder="Tập trung: role_code / role_name…"
                    label={null}
                    style={{ width: "100%", minWidth: 260 }}
                  />
                </div>
                <div className="filter">
                  <FiShield className="mutedIc" />
                  <Select value={roleStatus} onChange={setRoleStatus} options={SUBJECT_STATUS_OPTIONS} />
                </div>
              </div>

              <EntityTable
                columns={[
                  { key: "code", header: "role_code" },
                  { key: "name", header: "Tên" },
                  { key: "desc", header: "Mô tả" },
                  { key: "status", header: "Trạng thái" },
                  { key: "actions", header: "", align: "right" },
                ]}
                rows={rolesView.map((r) => ({
                  id: r.id,
                  cells: {
                    code: <span className="mono strong">{r.role_code}</span>,
                    name: <span className="strong">{r.role_name}</span>,
                    desc: <span className="muted">{r.description || "—"}</span>,
                    status: (
                      <span className={`pill ${r.is_active ? "pill--ok" : "pill--danger"}`}>
                        {r.is_active ? <FiToggleRight /> : <FiToggleLeft />}
                        {r.is_active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    ),
                    actions: (
                      <div className="rowBtns">
                        <button
                          className="iconBtn success"
                          title="Sửa"
                          onClick={() => openModal("roleForm", { mode: "edit", id: r.id })}
                        >
                          <FiEdit2 />
                        </button>
                        <button className="iconBtn warn" title="Bật/Tắt" onClick={() => handleToggleRole(r.id)}>
                          {r.is_active ? <FiToggleRight /> : <FiToggleLeft />}
                        </button>
                      </div>
                    ),
                  },
                }))}
                emptyText="Chưa có vai trò."
              />
            </Card>
          ) : null}

          {activeTab === "config" ? (
            <Card
              icon={<FiSettings />}
              title="Quy tắc điểm danh (system_config)"
              subtitle="Cấu hình thời gian check-in/out và quy tắc vắng/trễ"
              right={
                <button
                  className="btn"
                  onClick={() => openModal("configForm", { mode: "edit" })}
                >
                  <FiEdit2 /> Sửa cấu hình
                </button>
              }
            >
              <div className="configGrid">
                <div className="configBox">
                  <div className="configTitle">Thời gian điểm danh</div>
                  <div className="configRow">
                    <div className="muted">checkin_start_time</div>
                    <div className="mono strong">{systemConfig.checkin_start_time}</div>
                  </div>
                  <div className="configRow">
                    <div className="muted">checkin_end_time</div>
                    <div className="mono strong">{systemConfig.checkin_end_time}</div>
                  </div>
                  <div className="configRow">
                    <div className="muted">checkout_time</div>
                    <div className="mono strong">{systemConfig.checkout_time}</div>
                  </div>

                  <div className="hint">
                    Engine đối chiếu attendance_logs với timetable_entries/sessions để suy ra attendance_records.
                  </div>
                </div>

                <div className="configBox">
                  <div className="configTitle">Quy tắc vắng học</div>
                  <pre className="cfgPre">{systemConfig.absent_rule}</pre>
                  <div className="hint">
                    Khi leave_requests được APPROVED, hệ thống sẽ cập nhật attendance_records tương ứng sang ABSENT_EXCUSED (theo nghiệp vụ bạn mô tả).
                  </div>
                </div>
              </div>
            </Card>
          ) : null}

          {activeTab === "audit" ? (
            <Card icon={<FiFileText />} title="Audit log (audit_logs)" subtitle="Truy vết thay đổi hệ thống">
              <div className="toolbarRow">
                <div className="filter">
                  <FiShield className="mutedIc" />
                  <Select value={entityFilter} onChange={setEntityFilter} options={ENTITY_OPTIONS} />
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ minWidth: 320 }}>
                  <SearchInput
                    value={qAudit}
                    onChange={setQAudit}
                    placeholder="Search action/entity/entity_id/user…"
                    label={null}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div className="tableWrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Entity</th>
                      <th>Entity ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditPaged.map((a) => (
                      <tr key={a.id}>
                        <td className="mono">{a.created_at}</td>
                        <td className="mono">{a.user_id}</td>
                        <td className="strong">{a.action}</td>
                        <td className="mono">{a.entity}</td>
                        <td className="mono">{a.entity_id}</td>
                      </tr>
                    ))}
                    {!auditPaged.length ? (
                      <tr>
                        <td colSpan={5}>
                          <div className="empty">Không có audit log phù hợp.</div>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              <div style={{ padding: "14px", borderTop: "1px solid var(--border)" }}>
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </Card>
          ) : null}
        </div>
      </div>

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={!!confirm}
        title={confirm?.title}
        description={confirm?.desc}
        confirmLabel={confirm?.confirmLabel || "Xác nhận"}
        variant={confirm?.tone === "danger" ? "danger" : "primary"}
        onClose={() => setConfirm(null)}
        onConfirm={confirm?.onConfirm}
      />

      {/* Modal host */}
      {modal.open ? (
        <ModalHost
          modal={modal}
          onClose={closeModal}
          // data
          educationLevels={educationLevels}
          grades={grades}
          academicYears={academicYears}
          subjects={subjects}
          studentRoles={studentRoles}
          systemConfig={systemConfig}
          // upsert actions (bound to hook)
          upsertLevel={actions.upsertLevel}
          upsertGrade={actions.upsertGrade}
          upsertYear={actions.upsertYear}
          upsertSubject={actions.upsertSubject}
          upsertRole={actions.upsertRole}
          saveConfig={actions.saveConfig}
        />
      ) : null}
    </div>
  );
};

export default AdminSystemStructure;
