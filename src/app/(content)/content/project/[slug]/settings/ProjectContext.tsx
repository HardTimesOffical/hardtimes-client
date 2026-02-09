'use client';
import React, { createContext, useContext, useState } from 'react';

// 1. Описываем типы для контекста
interface ProjectContextType {
  project: any;
  updateProject: (data: any) => void;
  versionsCount: number;
  setVersionsCount: (count: number) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ 
  children, 
  initialProject,
  initialVersionsCount = 0 // Добавляем поддержку начального значения
}: { 
  children: React.ReactNode; 
  initialProject: any;
  initialVersionsCount?: number; 
}) {
  const [project, setProject] = useState(initialProject);
  const [versionsCount, setVersionsCount] = useState(initialVersionsCount);

  const updateProject = (data: any) => {
    setProject((prev: any) => ({ ...prev, ...data }));
  };

  return (
    <ProjectContext.Provider value={{ 
      project, 
      updateProject, 
      versionsCount, 
      setVersionsCount 
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}