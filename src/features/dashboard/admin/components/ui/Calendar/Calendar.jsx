import React, { useState, useEffect, useRef } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Calendar.css";

const MONTHS = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];

const DAYS = ["Cn", "T2", "T3", "T4", "T5", "T6", "T7"];

export default function Calendar({ value, onChange, label, placeholder = "Chọn ngày" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse value or default to today
  const getInitialDate = () => {
    if (!value) return new Date();
    const d = new Date(value);
    return isNaN(d) ? new Date() : d;
  };

  const [viewDate, setViewDate] = useState(getInitialDate); // For navigation (month/year)
  const selectedDate = value ? new Date(value) : null;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeMonth = (delta) => {
    setViewDate((prev) => {
      const copy = new Date(prev);
      copy.setMonth(copy.getMonth() + delta);
      return copy;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setViewDate(today);
    onChange(formatISO(today));
    setIsOpen(false);
  };

  const formatISO = (d) => d.toISOString().split("T")[0]; // YYYY-MM-DD

  const handleSelect = (day) => {
    // day is number 1..31
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    // adjust timezone offset to avoid previous-day bugs when sending to backend if using simple ISO split
    // but here we just want YYYY-MM-DD local
    // Safe way: create date with local year/month/day
    const y = newDate.getFullYear();
    const m = String(newDate.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${y}-${m}-${d}`);
    setIsOpen(false);
  };

  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) -> 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // adjust prev month filler
    const prevMonthDays = new Date(year, month, 0).getDate();
    const prevFiller = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        prevFiller.push(prevMonthDays - firstDayOfMonth + 1 + i);
    }

    const cells = [];

    // Prev month cells (muted)
    prevFiller.forEach((d) => {
      cells.push(<div key={`prev-${d}`} className="cal-cell otherMonth">{d}</div>);
    });

    // Current month cells
    const todayStr = formatISO(new Date());
    const selectedStr = selectedDate ? formatISO(selectedDate) : "";

    for (let d = 1; d <= daysInMonth; d++) {
        // format YYYY-MM-DD
        const currentStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const isToday = currentStr === todayStr;
        const isSelected = currentStr === selectedStr;

        cells.push(
            <div 
                key={d} 
                className={`cal-cell ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(d)}
            >
                {d}
            </div>
        );
    }

    // Next month filler
    const totalSlots = 42; // 6 rows * 7
    const remaining = totalSlots - cells.length;
    for (let i = 1; i <= remaining; i++) {
        cells.push(<div key={`next-${i}`} className="cal-cell otherMonth">{i}</div>);
    }

    return cells;
  };

  // derived display string
  const displayValue = selectedDate 
    ? `${selectedDate.getDate()} thg ${selectedDate.getMonth() + 1}, ${selectedDate.getFullYear()}`
    : "";

  return (
    <div className="cal-wrapper" ref={containerRef}>
        {label && <label style={{display:'block', fontSize:12, fontWeight:800, color:'var(--ts)', marginBottom:6}}>{label}</label>}
      <div className={`cal-trigger ${isOpen ? "isOpen" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <div className="cal-triggerIcon"><FiCalendar /></div>
        {displayValue ? (
            <div className="cal-triggerText">{displayValue}</div>
        ) : (
            <div className="cal-triggerPlaceholder">{placeholder}</div>
        )}
      </div>

      {isOpen && (
        <div className="cal-popover">
          <div className="cal-header">
            <button className="cal-navBtn" onClick={() => changeMonth(-1)}><FiChevronLeft /></button>
            <div className="cal-title" onClick={goToToday} title="Về hôm nay">
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </div>
            <button className="cal-navBtn" onClick={() => changeMonth(1)}><FiChevronRight /></button>
          </div>

          <div className="cal-grid">
            {DAYS.map((d) => <div key={d} className="cal-dayName">{d}</div>)}
            {renderDays()}
          </div>

          <div className="cal-footer">
            <button className="cal-todayBtn" onClick={goToToday}>Hôm nay</button>
          </div>
        </div>
      )}
    </div>
  );
}
