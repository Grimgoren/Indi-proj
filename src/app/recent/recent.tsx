import projectData from '../../data/projects.json';

export default function Recent() {
  return (
    <>
      <div className='banner'>Recent page</div>
      <div className='navbar'>
        <button className='navbutton'>Home</button>
        <button className='navbutton'>Contact</button>
        <button className='navbutton'>About</button>
        <button className='navbutton'>Kiosk</button>
      </div>
      <div className='page-layout'>
        <div className='side-content-container'>
          <div className='searchbar'>
            <input type='text' placeholder='Search..'></input>
          </div>
          <div className='content-side'>
            <ul>
              {projectData.Projects.map((project, index) => (
                <li key={index}>
                  {project.Title && <strong>{project.Title}</strong>}
                  <p>{project.Description}</p>
                  {project.URL && <a href={project.URL}></a>}
                </li>
              ))}
            </ul>
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

