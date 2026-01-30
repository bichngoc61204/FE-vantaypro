import ReactDOM from 'react-dom';
import { FiX } from "react-icons/fi";

export default function Modal({ title, children, onClose, className = "" }) {
  return ReactDOM.createPortal(
    <div className="modalBackdrop" onMouseDown={onClose} style={{ 
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div className={`modal ${className}`} onMouseDown={(e) => e.stopPropagation()} style={{
        position: 'relative', margin: 'auto', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: 'auto'
      }}>
        <div className="modalHead" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="modalTitle" style={{ textAlign: 'left', flex: 1 }}>{title}</div>
          <button className="modalClose" onClick={onClose} aria-label="close">
            <FiX />
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>,
    document.body
  );
}
