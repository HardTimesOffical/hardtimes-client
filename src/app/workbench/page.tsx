import React from "react";
import Workbench from "./workbench";
import styles from "./workbench.module.css";

const WorkbenchPage: React.FC = () => {
  return (
    /* Добавляем фоновый цвет и минимальную высоту на всю страницу */
    <div className={`${styles.pageWrapper} bg-[#f8f9fa] min-h-screen`}>
      {/* Используем pt (padding-top) вместо mt (margin-top), 
         чтобы фон прокрашивался до самого верха под шапкой 
      */}
      <div className="pt-15 pb-20 px-4 min-h-screen">
        <Workbench />
      </div>
    </div>
  );
}

export default WorkbenchPage;