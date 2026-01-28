import './AttendanceChart.css';

const AttendanceChart = ({ title }) => {
    return (
        <div className="attendance-chart">
            <div className="attendance-chart-header">
                <span>{title}</span>
            </div>

            <div className="attendance-chart-body">
                <div className="attendance-chart-placeholder"> 
                    Chart Placeholder
                </div>
            </div>
        </div>
    );
};

export default AttendanceChart;
