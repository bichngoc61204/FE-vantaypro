import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { FiX } from "react-icons/fi";

export default function ModalShell({ title, subtitle, onClose, children, footer }) {
  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="att-modalOverlay" onClick={onClose}>
      <div className="att-modal" onClick={(e) => e.stopPropagation()}>
        <div className="att-modalHead">
          <div>
            <div className="strong">{title}</div>
            {subtitle ? <div className="muted">{subtitle}</div> : null}
          </div>
          <button className="iconBtn" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className="att-modalBody">{children}</div>

        <div className="att-modalActions">{footer}</div>
      </div>
    </div>,
    document.body
  );
}
