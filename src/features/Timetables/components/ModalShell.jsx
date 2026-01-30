import React from "react";
import { FiX } from "react-icons/fi";

export default function ModalShell({ title, subtitle, onClose, children, footer }) {
  return (
    <div className="tt-modalOverlay" onClick={onClose}>
      <div className="tt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tt-modalHead">
          <div>
            <div className="strong">{title}</div>
            {subtitle ? <div className="muted">{subtitle}</div> : null}
          </div>
          <button className="iconBtn" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>
        <div className="tt-modalBody">{children}</div>
        <div className="tt-modalActions">{footer}</div>
      </div>
    </div>
  );
}
