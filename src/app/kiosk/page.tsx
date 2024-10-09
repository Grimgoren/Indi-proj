'use client';

interface Project {
  Title: string
  Description: string
  Summary: string
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
import nextProject from '@/components/nextProject';
import qrCode from '@/components/qrcode';
import { useRouter } from 'next/navigation';

export default function Kiosk() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [totalQuery, setTotalQuery] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  const handleClick = async (project: Project) => {
    alert('Redirecting to main page...');
    setSelectedProject(project);
    localStorage.setItem('selectedProject', JSON.stringify(project));
    console.log('Redirecting to main page');
    router.push('/');
  };

  useEffect(() => {
    const loadNextProject = async () => {
      const result = await nextProject();
      if (result) {
        setProject(result);
      }
    };

    loadNextProject();

    const intervalId = setInterval(() => {
      loadNextProject();
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await readJson();
    };
    loadData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      await reloadJson();
    }, 50000);
  
    return () => clearInterval(intervalId);
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
      if (project) {
        localStorage.setItem('selectedProject', JSON.stringify(project));
        const projURL = `${window.location.origin}/?project=${encodeURIComponent(project.Title)}`;
        console.log('Project URL:', projURL);
        
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (canvas) {
          await qrCode(projURL, canvas);
        }
      }
    };
    generateQRCode();
  }, [project]); 

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

return (
    <>
      <div className='banner-wrapper'>
        <div className='banner'>Research portal</div>
        <div className='which-page'>Kiosk</div>
      </div>
      <div className='navbar'>
      <button className="navbutton" onClick={() => router.push('/')}>
          Home
        </button>
        <button className="navbutton" onClick={() => router.push('/recent')}>
          Recent
        </button>
        <button className="navbutton" onClick={() => router.push('/kiosk')}>
          Kiosk
        </button>
        </div>
      <div className='page-layout'>
      <div className='side-content-container'>
          <div className='search-wrapper'>
            <div className='searchbar'>
              <input
                type='text'
                placeholder='Search..'
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <p className='search-result'>Total Results: {totalQuery}</p>
          </div>
          <div className='content-side'>
            <div className='card-grid-side'>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <div
                    key={index}
                    className="card-small"
                    onClick={() => handleClick(project)}
                    style={{
                      backgroundImage: `url(${project.Screenshot})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="overlay"></div>
                    <p className='card-small-title'>{project.Title}</p>
                    <p className='card-small-sum'>{project.Summary}</p>
                  </div>
                ))
              ) : (
                <p>No projects found</p>
              )}
            </div>
          </div>
        </div>
        <div className='content-container'>
          <div className='content'>
            {project ? (
              <div>
                <strong>{project.Title}</strong>
                <p>{project.Summary}</p>
                {project.URL && (
                  <a href={project.URL} target="_blank" rel="noopener noreferrer">
                    {project.URL}
                  </a>
                )}
                <canvas id="canvas"></canvas>
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

