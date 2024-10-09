'use client';

interface Project {
  Title: string
  Description: string
  Summary: string
  Tag: string
  Screenshot: Array
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
import loading from '@/components/loading';
import $ from 'jquery';

export default function Homepage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [totalQuery, setTotalQuery] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = async (project) => {
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
            {selectedProject ? (
              <div>
                <h3>Selected Project:</h3>
                <p><strong>{selectedProject.Title}</strong></p>
                <p>{selectedProject.Tag}</p>
                <p>{selectedProject.Type}</p>

                {Array.isArray(selectedProject.Screenshot) && selectedProject.Screenshot.length > 0 ? (
                  selectedProject.Screenshot.map((screenshot, i) => (
                    <img key={i} className='mainImage' src={screenshot} alt={`${selectedProject.Title} screenshot ${i + 1}`} />
                  ))
                ) : (
                  <p>No screenshots available</p>
                )}

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
