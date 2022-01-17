import React, { useState } from "react";
import Launcher from "./Launcher";
import ReportModal from "./ReportModal";

function Deft() {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  return (
    <div>
      <Launcher onOpenReportFlow={() => setIsReportModalOpen(true)}/>
      <ReportModal open={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
}

export default Deft;
