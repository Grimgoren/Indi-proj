import React from 'react'

import { useState } from 'react';

interface Project {
  Title: string;
  Description: string;
  Summary: string;
  Tag: string[];
  Screenshot: string[];
  URL: string;
  Type: string;
}

type SelectProjectProps = {
  project: Project;
  children: React.ReactNode;
};

function SelectProject({ project, children }: SelectProjectProps) {
  const [, setShowThis] = useState<Project | null>(null);

  const handleClick = async () => {
    console.log("Fetching ", project);
    setShowThis(project);
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
}

export default SelectProject;
