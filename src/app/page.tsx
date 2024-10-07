'use client';

interface Project {
  Title: string
  Description: string
  Tag: string
  Screenshot: string
  URL: string
  Type: string
}

import { useState, useEffect } from 'react';
import filterJson from '@/components/filterJson';
import sumJsonQuery from '@/components/sumJsonQuery';
import readJson from '@/components/jsonRead';
import reloadJson from '@/components/reloadJson';
import qrCode from '@/components/qrcode';
import { useRouter } from 'next/navigation';

export default function Homepage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [totalQuery, setTotalQuery] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showThis, setShowThis] = useState(null);

  const handleClick = async (project) => {
    alert('Fetching project...');
    console.log("Fetching ", project);
    setSelectedProject(project);
  };

  useEffect(() => {
    const savedProject = localStorage.getItem('selectedProject');
    if (savedProject) {
      setSelectedProject(JSON.parse(savedProject));
      localStorage.removeItem('selectedProject');
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await readJson();
    };
    loadData();
  }, []);

  useEffect(() => {
    const reloadData = async () => {
      await reloadJson();
    };
    reloadData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery) {
        const result = await filterJson(debouncedQuery);
        if (result) {
          setFilteredProjects(result.filteredProjects);
          const sumResult = await sumJsonQuery(result.filteredProjects);
          setTotalQuery(sumResult);
        } else {
          setFilteredProjects([]);
          setTotalQuery(0);
        }
      } else {
        const allProjects = await filterJson('');
        if (allProjects) {
          setFilteredProjects(allProjects.filteredProjects);
          const sumResult = await sumJsonQuery(allProjects.filteredProjects);
          setTotalQuery(sumResult);
        }
      }
    };

    performSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    const generateQRCode = async () => {
      if (selectedProject) {
        localStorage.setItem('selectedProject', JSON.stringify(selectedProject));
        const projURL = `${window.location.origin}/?project=${encodeURIComponent(selectedProject.Title)}`;
        console.log('Project URL:' , projURL)
        await qrCode(projURL);
      }
    };
    generateQRCode();
  }, [selectedProject]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className='banner'>Home page</div>
      <div className='navbar'>
      <button className="navbutton" onClick={() => router.push('/recent')}>
          Recent
        </button>
        <button className="navbutton" onClick={() => router.push('/kiosk')}>
          Kiosk
        </button>
        </div>
      <div className='page-layout'>
        <div className='side-content-container'>
          <div className='searchbar'>
            <input
              type='text'
              placeholder='Search..'
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className='content-side'>
              <ul>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <li key={index}>
                      <div  onClick={() => handleClick(project) } style={{ cursor: 'pointer' }}>
                      {project.Title}
                      </div>
                      <p>{project.Description}</p>
                      {project.URL && <a href={project.URL}>{project.URL}</a>}
                    </li>
                  ))
                ) : (
                  <p>No projects found</p>
                )}
              </ul>
            <p>Total Results: {totalQuery}</p>
          </div>
        </div>
        <div className='content-container'>
          <div className='content'>
            {selectedProject ? (
              <div>
                <h3>Selected Project:</h3>
                <p><strong>{selectedProject.Title}</strong></p>
                <p>{selectedProject.Tag}</p>
                <p>{selectedProject.Type}</p>
                <p>{selectedProject.Screenshot}</p>
                <p>{selectedProject.Description}</p>
                {selectedProject.URL && <a href={selectedProject.URL}>Visit project</a>}
                <canvas id="canvas"></canvas>
              </div>
            ) : (
              <p>No project selected</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
