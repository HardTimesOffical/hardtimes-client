import React from "react";
import DashboardLayout from "../components/dashboard/dashboard";
import Workbench from "./workbench";

const WorkbenchPage: React.FC = () => {
  return (
    <DashboardLayout>
        <Workbench />
    </DashboardLayout>
  );
}   

export default WorkbenchPage;