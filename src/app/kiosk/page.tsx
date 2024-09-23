'use client';

import { useState, useEffect } from 'react';
import nextProject from '@/components/nextProject';

interface Project {
  Title: string;
  Description: string;
  Tag: string;
  Screenshot: string;
  URL: string;
  Type: string;
}

export default function Kiosk() {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const loadNextProject = async () => {
      const result = await nextProject();
      if (result) {
        setProject(result);
      }
    };

    // Load the first project immediately
    loadNextProject();

    // Set up interval to load the next project every 4 seconds
    const intervalId = setInterval(() => {
      loadNextProject();
    }, 4000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className='banner-kiosk'>Kiosk page</div>
      <div className='kiosk-wrapper'>
        <div className='navbar-kiosk-container'>
          <div className='navbar-kiosk'>
            <button className='navbutton'>Home</button>
          </div>
        </div>
        <div className='kiosk-container'>
          <div className='kiosk-content'>
            {project ? (
              <div>
                <strong>{project.Title}</strong>
                <p>{project.Description}</p>
                {project.URL && (
                  <a href={project.URL} target="_blank" rel="noopener noreferrer">
                    {project.URL}
                  </a>
                )}
              </div>
            ) : (
              <p>Loading project...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
