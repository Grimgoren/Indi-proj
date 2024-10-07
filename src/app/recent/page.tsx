'use client';

import projectData from '../../../public/data/projects.json';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import filterJson from '@/components/filterJson';
import sumJsonQuery from '@/components/sumJsonQuery';
import readJson from '@/components/jsonRead';
import reloadJson from '@/components/reloadJson';

interface Project {
  Title: string;
  Description: string;
  Tag: string;
  Screenshot: string;
  URL: string;
  Type: string;
}

export default function Recent() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [totalQuery, setTotalQuery] = useState(0);

  const handleClick = async (project: Project) => {
    alert('Redirecting to main page...');
    setSelectedProject(project);
    localStorage.setItem('selectedProject', JSON.stringify(project));
    console.log('Redirecting to main page');
    router.push('/');
  };

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
    const reloadData = async () => {
      await reloadJson();
    };
    reloadData();
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
      <div className="banner">Recent page</div>
      <div className="navbar">
        <button className="navbutton" onClick={() => router.push('/')}>
          Home
        </button>
        <button className="navbutton" onClick={() => router.push('/kiosk')}>
          Kiosk
        </button>
      </div>
      <div className="page-layout">
        <div className="content-container">
          <div className="content">
            <div className="searchbar">
              <input
                type="text"
                placeholder="Search.."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="card-container">
              <div className="card-grid">
              <p>Total Results: {totalQuery}</p>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
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
