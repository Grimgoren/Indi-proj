function SelectProject({ children }) {
  const handleClick = () => {
    alert('Fetching project...');
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
}

export default SelectProject;
