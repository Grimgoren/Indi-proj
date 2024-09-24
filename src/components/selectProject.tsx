import { useState } from 'react';

function SelectProject({ project, children }) {
  const [showThis, setShowThis] = useState(null);
  const handleClick = async () => {
    alert('Fetching project...');
    console.log("Fetching ", project);
    setShowThis(project);
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
}

export default SelectProject;
