'use client';

interface Project {
  Title: string;
  Description: string;
  Summary: string;
  Tag: string[];
  Screenshot: string[];
  URL: string;
  Type: string;
}

import { useState, useEffect } from 'react';
import filterJson from '@/components/filterJson';
import sumJsonQuery from '@/components/sumJsonQuery';
import readJson from '@/components/jsonRead';
import reloadJson from '@/components/reloadJson';
import qrCode from '@/components/qrcode';
import { useRouter } from 'next/navigation';
import loading from '@/components/loading';
import $ from 'jquery';
import React from 'react';

export default function Homepage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [totalQuery, setTotalQuery] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [, setIntervalId] = useState<number | null>(null);

  const handleClick = async (project: Project) => {
    console.log("Fetching ", project);
    setSelectedProject(project);
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
    const savedProject = localStorage.getItem('selectedProject');
    if (savedProject) {
      setSelectedProject(JSON.parse(savedProject));
      localStorage.removeItem('selectedProject');
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const updatedData = await reloadJson();

      if (updatedData && updatedData.Projects) {
        setFilteredProjects(updatedData.Projects);
        if (selectedProject) {
          const updatedProject = updatedData.Projects.find(
            (project: Project) => project.Title === selectedProject.Title
          );
          if (updatedProject) {
            setSelectedProject(updatedProject);
          }
        }
      } else {
        console.error('Failed to reload project data');
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [selectedProject]);

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

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        return selectedProject && Array.isArray(selectedProject.Screenshot)
          ? (prevIndex + 1) % selectedProject.Screenshot.length
          : 0;
      });
    }, 3000) as unknown as number;

    setIntervalId(id);

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [selectedProject]);

  return (
    <>
    <div className="main-container">
      <div className='banner-wrapper'>
        <div className='banner'>Research portal</div>
        <div className='which-page'>Home</div>
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
                      <div className='tagDiv-card-wrapper'>
                        <div className='tagDiv-card'>
                          {Array.isArray(project.Tag) ? (
                            project.Tag.map((tag, index) => (
                              <span 
                                key={index}
                                id="badge-dismiss-default"
                                className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
                              >
                                {tag}
                              </span>
                            ))
                          ) : project.Tag ? (
                            <span
                              id="badge-dismiss-default"
                              className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
                            >
                              {project.Tag}
                            </span>
                          ) : (
                            <span>No tags available</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No projects found</p>
                )}
            </div>
          </div>
        </div>
        <div className="content-container">
          <div className="content">
            <div className="content-grid">
              {selectedProject ? (
                <>
              <div className="heads1 titleQrWrapper">
                <div className="qr-wrapper">
                    <canvas id="canvas"></canvas>
                  </div>
                <div className="titleDiv">{selectedProject.Title}</div>
              </div>
                  <div className="tagstype">
                  <div className="tags tagDiv">
                    {Array.isArray(selectedProject?.Tag) && selectedProject.Tag.length > 0 ? (
                      selectedProject.Tag.map((tag, index) => (
                        <span 
                          key={index}
                          id="badge-dismiss-default"
                          className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span>No tags available</span>
                    )}
                  </div>
                    <div className="types typeDiv">
                      <span 
                        id="badge-dismiss-default"
                        className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-green-800 bg-green-100 rounded dark:bg-green-900 dark:text-green-300"
                      >
                        {selectedProject.Type}
                      </span>
                    </div>
                  </div>
                  <div className="column1">
                    <div className="descriDiv">{selectedProject.Description}</div>
                    <div className="linkDiv">
                      {selectedProject.URL && <a href={selectedProject.URL}>{selectedProject.URL}</a>}
                    </div>
                  </div>
                  <div className="column2">
                    {selectedProject && Array.isArray(selectedProject.Screenshot) && selectedProject.Screenshot.length > 0 ? (
                      <div className="pic-wrapper">
                        <img
                          className="mainImage"
                          src={selectedProject.Screenshot[currentImageIndex] || "/images/no-pictures.png"}
                          alt={`${selectedProject.Title} screenshot ${currentImageIndex + 1}`}
                        />
                      </div>
                    ) : (
                      <div className="pic-wrapper">
                        <img className="mainImage" src="/images/no-pictures.png" alt="No pictures available" />
                      </div>
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
    </div>
    </>
  );
}
