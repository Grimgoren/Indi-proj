'use client';

import projectData from '../../../public/data/projects.json';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import filterJson from '@/components/filterJson';
import sumJsonQuery from '@/components/sumJsonQuery';
import readJson from '@/components/jsonRead';
import reloadJson from '@/components/reloadJson';
import loading from '@/components/loading';
import $ from 'jquery';

interface Project {
  Title: string
  Description: string
  Summary: string
  Tag: string
  Screenshot: Array
  URL: string
  Type: string
}

export default function Recent() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [totalQuery, setTotalQuery] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = async (project: Project) => {
    setSelectedProject(project);
    localStorage.setItem('selectedProject', JSON.stringify(project));
    console.log('Redirecting to main page');
    router.push('/');
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const filtered = projectData.Projects.filter((project) =>
      project.Title.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [debouncedQuery]);

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

  return (
    <>
      <div className='banner-wrapper'>
        <div className='banner'>Research portal</div>
        <div className='which-page'>Recent</div>
      </div>
      <div className="navbar">
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
      <div className="page-layout">
        <div className="content-container">
          <div className="content">
            <div className='search-wrapper'>
              <div className="searchbar">
                <input
                  type="text"
                  placeholder="Search.."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <p className='search-result'>Total Results: {totalQuery}</p>
            </div>
            <div className="card-container">
  <div className='card-grid'>
    {filteredProjects.length > 0 ? (
      filteredProjects.map((project, index) => (
        <div
          key={index}
          className="card"
          onClick={() => handleClick(project)}
          style={{
            backgroundImage: `url(${project.Screenshot[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer'
          }}
        >
          <div className="overlay"></div>
          <p className='card-title'>{project.Title}</p>
          <p className='card-sum'>{project.Summary}</p>
        </div>
      ))
    ) : (
      <p>No projects found</p>
    )}
  </div>
</div>

          </div>
        </div>
      </div>
    </>
  );
}
