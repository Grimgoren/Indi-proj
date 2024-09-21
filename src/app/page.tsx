'use client';

import { useState, useEffect } from 'react';
import filterJson from '@/components/filterJson';
import sumJsonQuery from '@/components/sumJsonQuery';

export default function Homepage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [totalQuery, setTotalQuery] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debouncing the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // Wait 300ms before setting the debounced query

    // Cleanup the timeout if the user is still typing
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Run the search whenever debouncedQuery changes
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
        setFilteredProjects([]);
        setTotalQuery(0);
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
              onChange={handleSearchChange} // Input event listener
            />
          </div>
          <div className='content-side'>
            <ul>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <li key={index}>
                    {project.Title && <strong>{project.Title}</strong>}
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
            <p>Content goes here</p>
          </div>
        </div>
      </div>
    </>
  );
}
