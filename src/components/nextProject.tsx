let index = 0;

async function nextProject() {
  try {
    const response = await fetch('data/projects.json');
    const data = await response.json();

    const projects = data.Projects;

    if (index < projects.length) {
      const currentProject = projects[index];
      index++;
      return currentProject;
    } else {
      index = 0;
      return projects[index];
    }

  } catch (error) {
    console.error('Error in nextProject function:', error);
    return null;
  }
}

export default nextProject;
