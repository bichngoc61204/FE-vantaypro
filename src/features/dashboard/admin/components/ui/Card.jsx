
import React from 'react';

export default function Card({ title, subtitle, icon, right, children }) {
  return (
    <section className="card">
      <div className="cardHead">
        <div className="cardHeadLeft">
          <div className="cardIcon">{icon}</div>
          <div className="cardTitles">
            <div className="cardTitle">{title}</div>
            <div className="cardSub">{subtitle}</div>
          </div>
        </div>
        <div className="cardHeadRight">{right}</div>
      </div>
      <div className="cardBody">{children}</div>
    </section>
  );
}
