import React from "react";
import DashboardLayout from "../components/dashboard/dashboard";
import Workbench from "./workbench";
import styles from "./workbench.module.css";

const WorkbenchPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
    <DashboardLayout>
      <div className="mt-15 mb-35">
        <Workbench />
      </div>
    </DashboardLayout>
    </div>
  );
}   

export default WorkbenchPage;