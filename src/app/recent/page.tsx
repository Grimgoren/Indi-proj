'use client';

interface Project {
  Title: string
  Description: string
  Tag: string
  Screenshot: string
  URL: string
  Type: string
}

import projectData from '../../../public/data/projects.json';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Recent() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleClick = async (project: Project) => {
    alert('Redirecting to main page...');
    setSelectedProject(project);
    console.log('Redirecting to main page');

    router.push('/');
  };

  return (
    <>
      <div className="banner">Recent page</div>
      <div className="navbar">
        <button className="navbutton" onClick={() => router.push('/')}>Home</button>
        <button className="navbutton">Contact</button>
        <button className="navbutton">About</button>
        <button className="navbutton">Kiosk</button>
      </div>
      <div className="page-layout">
        <div className="content-container">
          <div className="content">
            <div className="card-container">
              <div className="card-grid">
                {projectData.Projects.map((project, index) => (
                  <div
                    key={index}
                    onClick={() => handleClick(project)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card">
                      <h3>{project.Title}</h3>
                      <p>{project.Description}</p>
                      <img src={project.Screenshot} alt={project.Title} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

