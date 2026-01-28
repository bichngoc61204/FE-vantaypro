"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiDatabase,
} from "react-icons/fi";

/* == MOCK DATA == */

const statusData = [
  { name: "Có mặt", value: 820, color: "#22c55e" },
  { name: "Đi muộn", value: 94, color: "#f59e0b" },
  { name: "Vắng CP", value: 36, color: "#3b82f6" },
  { name: "Vắng KP", value: 18, color: "#ef4444" },
];

const qualityData = [
  { name: "OK", value: 42 },
  { name: "Thiếu IN", value: 6 },
  { name: "Override", value: 4 },
];

const trendData = [
  { day: "T2", present: 93, late: 4, absent: 3 },
  { day: "T3", present: 92, late: 5, absent: 3 },
  { day: "T4", present: 91, late: 6, absent: 3 },
  { day: "T5", present: 94, late: 4, absent: 2 },
  { day: "T6", present: 90, late: 7, absent: 3 },
];

const lateDist = [
  { label: "1–5p", value: 38 },
  { label: "6–10p", value: 29 },
  { label: "11–15p", value: 18 },
  { label: ">15p", value: 9 },
];

const classRisk = [
  { className: "10A1", rate: 6.2 },
  { className: "11B3", rate: 5.4 },
  { className: "12C1", rate: 4.9 },
  { className: "10A3", rate: 4.2 },
];

const alerts = [
  { type: "danger", text: "10A1 có 3 HS vắng không phép hôm nay" },
  { type: "warning", text: "Buổi sáng 11B3 thiếu log IN" },
  { type: "info", text: "GVCN 12C1 đã override điểm danh" },
];

/* == COMPONENT == */

export default function AdminDashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard điểm danh – Toàn trường</h1>

      {/*  ROW 1  */}
      <div className="grid grid-3">
        <section className="panel">
          <h3>Trạng thái hôm nay</h3>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={70}
                >
                  {statusData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="meta">
              <span><FiUsers /> 968 HS</span>
              <span className="ok"><FiCheckCircle /> 96.1%</span>
              <span className="late"><FiClock /> 94 trễ</span>
              <span className="bad"><FiAlertTriangle /> 18 vắng KP</span>
            </div>
          </div>
        </section>

        <section className="panel">
          <h3>Chất lượng dữ liệu</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={qualityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <h3>Cảnh báo nhanh</h3>
          <ul className="alert-list">
            {alerts.map((a, i) => (
              <li key={i} className={a.type}>{a.text}</li>
            ))}
          </ul>
        </section>
      </div>

      {/*  ROW 2  */}
      <div className="grid grid-2">
        <section className="panel">
          <h3>Xu hướng chuyên cần (tuần)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area dataKey="present" stackId="1" fill="#22c55e" />
              <Area dataKey="late" stackId="1" fill="#f59e0b" />
              <Area dataKey="absent" stackId="1" fill="#ef4444" />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <h3>Phân bố đi muộn</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={lateDist}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/*  ROW 3  */}
      <section className="panel">
        <h3>Lớp có tỷ lệ vắng KP cao</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={classRisk} layout="vertical">
            <XAxis type="number" />
            <YAxis dataKey="className" type="category" />
            <Tooltip />
            <Bar dataKey="rate" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* == STYLE == */}
      <style jsx>{`
        .dashboard {
          padding: 24px;
          background: #f1f5f9;
          font-family: system-ui, sans-serif;
        }

        h1 {
          margin-bottom: 20px;
        }

        .grid {
          display: grid;
          gap: 20px;
          margin-bottom: 20px;
        }

        .grid-3 {
          grid-template-columns: repeat(3, 1fr);
        }

        .grid-2 {
          grid-template-columns: repeat(2, 1fr);
        }

        .panel {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
        }

        .panel h3 {
          margin-bottom: 12px;
          font-size: 15px;
        }

        .panel-body {
          display: flex;
          gap: 12px;
        }

        .meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 13px;
        }

        .meta span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ok { color: #16a34a; }
        .late { color: #d97706; }
        .bad { color: #dc2626; }

        .alert-list {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 13px;
        }

        .alert-list li {
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .danger { background: #fee2e2; color: #991b1b; }
        .warning { background: #fef3c7; color: #92400e; }
        .info { background: #e0f2fe; color: #075985; }
      `}</style>
    </div>
  );
}
