'use client';

interface Project {
  Title: string
  Description: string
  Summary: string
  Tag: string
  Screenshot: Array<string[]>
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
import loading from '@/components/loading';
import $ from 'jquery';
import React from 'react';

export default function Kiosk() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [totalQuery, setTotalQuery] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [, setSelectedProject] = useState<Project | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const handleClick = async (project: Project) => {
    setSelectedProject(project);
    setIsPaused(true);
    setProject(project);
  };

  const unPause = async () => {
    setIsPaused(false);
    console.log("Unpausing");
  };

  useEffect(() => {
    loading();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await readJson();
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      $('#loading').fadeOut(500);
    }
  }, [isLoading]);

  useEffect(() => {
    const loadNextProject = async () => {
      const result = await nextProject();
      if (result) {
        setProject(result);
      }
    };
  
    if (!isPaused) {
      loadNextProject();
  
      const intervalId = setInterval(() => {
        if (!isPaused) {
          loadNextProject();
        }
      }, 4000);
  
      return () => clearInterval(intervalId);
    }
  }, [isPaused]);

  useEffect(() => {
    const loadData = async () => {
      await readJson();
    };
    loadData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const updatedData = await reloadJson();

      if (updatedData && updatedData.Projects) {
        setFilteredProjects(updatedData.Projects);
      } else {
        console.error('Failed to reload project data');
      }
    }, 10000);
  
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
    <div className='navbar-hidden-wrapper'>
      <div className='banner-wrapper'>
        <div className='banner'>Research portal</div>
        <div className='which-page-hidden'>Kiosk</div>
      </div>
      
        <div className='navbar-hidden'>
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
      </div>
      <div id="loading"></div>
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
              {isPaused && (
                <div className='playButton'>
                  <input 
                    type="image" 
                    style={{ maxWidth: '60px', marginTop: '10px' }} 
                    src="/images/play (1).png"
                    onClick={() => unPause(project)}
                  />
                </div>
              )}
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
                      backgroundImage: `url(${project.Screenshot[0]})`,
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
          <div className="content">
              <div className="content-grid">
                {project ? (
                  <>
                <div className="heads1 titleQrWrapper">
                  <div className="qr-wrapper">
                      <canvas id="canvas"></canvas>
                    </div>
                  <div className="titleDiv">{project.Title}</div>
                </div>
                    <div className="tagstype">
                      <div className="tags tagDiv">
                        <span 
                          id="badge-dismiss-default"
                          className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
                        >
                          {project.Tag}
                        </span>
                      </div>
                      <div className="types typeDiv">
                        <span 
                          id="badge-dismiss-default"
                          className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-green-800 bg-green-100 rounded dark:bg-green-900 dark:text-green-300"
                        >
                          {project.Type}
                        </span>
                      </div>
                    </div>
                    <div className="column1">
                      <div className="descriDiv">{project.Description}</div>
                      <div className="linkDiv">
                        {project.URL && <a href={project.URL}>{project.URL}</a>}
                      </div>
                    </div>
                    <div className="column2">
                      {Array.isArray(project.Screenshot) && project.Screenshot.length > 0 ? (
                        project.Screenshot.map((screenshot, i) => (
                          <div key={i} className="pic-wrapper">
                            <img className="mainImage" src={screenshot} alt={`${project.Title} screenshot ${i + 1}`} />
                          </div>
                        ))
                      ) : (
                        <p>No screenshots available</p>
                      )}
                    </div>
                  </>
                ) : (
                  <p>No project selected</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
