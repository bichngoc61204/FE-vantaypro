import "./Section.css";

const Section = ({ title, subtitle, children }) => {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-title">
        <h2>{title}</h2>
        {subtitle && (
          <div className="dashboard-section-subtitle">{subtitle}</div>
        )}
      </div>
      <div className="dashboard-section-content">{children}</div>
    </section>
  );
};

export default Section;
