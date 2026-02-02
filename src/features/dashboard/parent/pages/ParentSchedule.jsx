import { useState } from 'react';
import './ParentSchedule.css';

// Updated mock data to use teacherId instead of teacher name
const timetableEntries = [
    { id: 1, timetableId: 1, dayId: 2, periodId: 1, subject: 'Toán', teacherId: 101, room: 'P.201' },
    { id: 2, timetableId: 1, dayId: 2, periodId: 2, subject: 'Văn', teacherId: 102, room: 'P.202' },
    { id: 3, timetableId: 1, dayId: 3, periodId: 1, subject: 'Anh', teacherId: 103, room: 'P.203' },
    { id: 4, timetableId: 1, dayId: 3, periodId: 3, subject: 'Lý', teacherId: 104, room: 'P.204' },
    { id: 5, timetableId: 1, dayId: 4, periodId: 2, subject: 'Hóa', teacherId: 105, room: 'P.205' },
    { id: 6, timetableId: 1, dayId: 5, periodId: 4, subject: 'Sử', teacherId: 106, room: 'P.206' },
    { id: 7, timetableId: 1, dayId: 6, periodId: 1, subject: 'Địa', teacherId: 107, room: 'P.207' },
    { id: 8, timetableId: 1, dayId: 7, periodId: 3, subject: 'GDCD', teacherId: 108, room: 'P.208' }
];

// Mock data for teachers
const teachers = [
    { id: 101, name: 'Cô Hoa' },
    { id: 102, name: 'Thầy Nam' },
    { id: 103, name: 'Cô Lan' },
    { id: 104, name: 'Thầy Hùng' },
    { id: 105, name: 'Cô Mai' },
    { id: 106, name: 'Thầy Bình' },
    { id: 107, name: 'Cô Hạnh' },
    { id: 108, name: 'Thầy Phúc' }
];

// Updated rendering logic to resolve teacherId to teacher name
const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'N/A';
};

// Ensure weekDays and periods are properly imported or defined
const weekDays = [
    { id: 2, name: 'Thứ 2', shortName: 'T2' },
    { id: 3, name: 'Thứ 3', shortName: 'T3' },
    { id: 4, name: 'Thứ 4', shortName: 'T4' },
    { id: 5, name: 'Thứ 5', shortName: 'T5' },
    { id: 6, name: 'Thứ 6', shortName: 'T6' },
    { id: 7, name: 'Thứ 7', shortName: 'T7' },
];

const periods = [
    { id: 1, name: 'Tiết 1', time: '07:00 - 07:45' },
    { id: 2, name: 'Tiết 2', time: '07:50 - 08:35' },
    { id: 3, name: 'Tiết 3', time: '08:40 - 09:25' },
    { id: 4, name: 'Tiết 4', time: '09:30 - 10:15' },
    { id: 5, name: 'Tiết 5', time: '10:20 - 11:05' },
];

function Schedule() {
    const [viewMode, setViewMode] = useState('week'); // 'day' or 'week'

    // Set the current day as default selected day
    const today = new Date();
    const currentDayId = today.getDay() === 0 ? 7 : today.getDay(); // Map Sunday to 7
    const [selectedDay, setSelectedDay] = useState(currentDayId);

    // Add formatted date to weekDays
    const formattedWeekDays = weekDays.map(day => {
        const dayOffset = day.id - currentDayId;
        const date = new Date(today);
        date.setDate(today.getDate() + dayOffset);
        return {
            ...day,
            date: date.getDate(),
            month: date.getMonth() + 1
        };
    });

    // Filter timetable data
    const getFilteredData = (dayId, periodId) => {
        return timetableEntries.find(item => item.dayId === dayId && item.periodId === periodId);
    };

    return (
        <div className="container-fluid container-dashboard-db" style={{ padding: '10px 20px' }}>
            {/* Header */}
            <div className="schedule-header card-db">
                <div className="schedule-header-left">
                    <h2 className="schedule-title">
                        <i className="fas fa-calendar-alt"></i>
                        Thời khóa biểu
                    </h2>
                    <span className="schedule-subtitle">
                        {timetableEntries.length} tiết/tuần
                    </span>
                </div>

                <div className="schedule-controls">

                    {/* View Mode Toggle */}
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'day' ? 'active' : ''}`}
                            onClick={() => setViewMode('day')}
                        >
                            <i className="fas fa-calendar-day"></i>
                            Ngày
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'week' ? 'active' : ''}`}
                            onClick={() => setViewMode('week')}
                        >
                            <i className="fas fa-calendar-week"></i>
                            Tuần
                        </button>
                    </div>
                </div>
            </div>

            {/* Day Selector (for day view) */}
            {viewMode === 'day' && (
                <div className="day-selector">
                    {formattedWeekDays.map(day => (
                        <button
                            key={day.id}
                            className={`day-btn ${selectedDay === day.id ? 'active' : ''}`}
                            onClick={() => setSelectedDay(day.id)}
                        >
                            <span className="day-name">{day.shortName}</span>
                            <span className="day-date">{day.date}/{day.month}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Week View */}
            {viewMode === 'week' && (
                <div className="timetable-grid card-db">
                    <div className="timetable-wrapper">
                        <table className="timetable-table">
                            <thead>
                                <tr>
                                    <th className="time-header">Tiết</th>
                                    {formattedWeekDays.map(day => (
                                        <th key={day.id} className="day-header">
                                            <span className="header-day">{day.name}</span>
                                            <span className="header-date">{day.date}/{day.month}</span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {periods.map(period => (
                                    <tr key={period.id}>
                                        <td className="time-cell">
                                            <div className="period-info">
                                                <span className="period-name">{period.name}</span>
                                                <span className="period-time">{period.time}</span>
                                            </div>
                                        </td>
                                        {formattedWeekDays.map(day => {
                                            const lesson = getFilteredData(day.id, period.id);
                                            return (
                                                <td key={`${day.id}-${period.id}`} className="lesson-cell">
                                                    {lesson && (
                                                        <div className="lesson-card">
                                                            <span className="lesson-subject">{lesson.subject}</span>
                                                            <span className="teacher-name">{getTeacherName(lesson.teacherId)}</span>
                                                            <span className="lesson-room">
                                                                <i className="fas fa-door-open"></i>
                                                                {lesson.room}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Day View */}
            {viewMode === 'day' && (
                <div className="day-schedule card-db">
                    <div className="card-db-header">
                        <i className="fas fa-list"></i>
                        <span>
                            {formattedWeekDays.find(d => d.id === selectedDay)?.name} - {formattedWeekDays.find(d => d.id === selectedDay)?.date}/{formattedWeekDays.find(d => d.id === selectedDay)?.month}
                        </span>
                    </div>
                    <div className="card-db-body">
                        <div className="day-lessons-list">
                            {periods.map(period => {
                                const lesson = getFilteredData(selectedDay, period.id);
                                return (
                                    <div
                                        key={period.id}
                                        className={`day-lesson-item ${lesson ? 'has-lesson' : 'free'}`}
                                    >
                                        <div className="lesson-time">
                                            <span className="period-number">{period.name}</span>
                                            <span className="period-hours">{period.time}</span>
                                        </div>
                                        <div className="lesson-content">
                                            {lesson ? (
                                                <>
                                                    <div className="lesson-main">
                                                        <span className="subject-name">{lesson.subject}</span>
                                                        <span className="teacher-name">{getTeacherName(lesson.teacherId)}</span>
                                                        <span className="class-badge">{lesson.className}</span>
                                                    </div>
                                                    <div className="lesson-meta">
                                                        <span className="room-info">
                                                            <i className="fas fa-door-open"></i>
                                                            {lesson.room}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="free-text">Không có tiết</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Stats */}

        </div>
    );
}

export default Schedule;
