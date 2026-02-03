"use client";

import React from "react";
import Workbench from "./workbench";
import styles from "./workbench.module.css";

const WorkbenchPage: React.FC = () => {
  return (

    <div className={`${styles.pageWrapper} bg-background min-h-screen transition-colors duration-300`}>
      

      <div className="pt-10 md:pt-16 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Workbench />
        </div>
      </div>
    </div>
  );
}

export default WorkbenchPage;