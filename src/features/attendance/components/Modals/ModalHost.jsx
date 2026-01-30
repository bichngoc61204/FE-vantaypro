import React from "react";

import ToastModal from "./ToastModal";
import ImportLogsModal from "./ImportLogsModal";
import ExportModal from "./ExportModal";
import RefreshModal from "./RefreshModal";
import DeduplicateModal from "./DeduplicateModal";
import AuditLogsModal from "./AuditLogsModal";
import AnomalyDetailModal from "./AnomalyDetailModal";
import SessionDetailsModal from "./SessionDetailsModal";
import ReconcileModal from "./ReconcileModal";

export default function ModalHost(props) {
  const { modal } = props;

  switch (modal.type) {
    case "toast":
      return <ToastModal {...props} />;
    case "importLogs":
      return <ImportLogsModal {...props} />;
    case "export":
      return <ExportModal {...props} />;
    case "refresh":
      return <RefreshModal {...props} />;
    case "dedup":
      return <DeduplicateModal {...props} />;
    case "audit":
      return <AuditLogsModal {...props} />;
    case "anomalyDetail":
      return <AnomalyDetailModal {...props} />;
    case "sessionDetails":
      return <SessionDetailsModal {...props} />;
    case "reconcile":
      return <ReconcileModal {...props} />;
    default:
      return null;
  }
}
