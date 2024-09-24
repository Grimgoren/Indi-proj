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
import SelectProject from '@/components/selectProject';

export default function Homepage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [totalQuery, setTotalQuery] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className='banner'>Home page</div>
      <div className='navbar'>
        <button className='navbutton'>Home</button>
        <button className='navbutton'>Contact</button>
        <button className='navbutton'>About</button>
        <button className='navbutton'>Kiosk</button>
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
                      <SelectProject project={project}>
                        {project.Title && <strong>{project.Title}</strong>}
                      </SelectProject>
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
                <p>{selectedProject.Description}</p>
                {selectedProject.URL && <a href={selectedProject.URL}>Visit project</a>}
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
