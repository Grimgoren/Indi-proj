import sumJsonQuery from './sumJsonQuery';

interface Project {
  Title: string;
  Description: string;
  Summary: string;
  Tag: string[];
  Screenshot: string[];
  URL: string;
  Type: string;
}

async function filterJson(
  query: string
): Promise<{ filteredProjects: Project[]; totalQuery: number } | null> {
  try {
    const response = await fetch('/data/projects.json');
    const data = await response.json();

    const projects: Project[] = data.Projects;

    const filteredProjects = projects.filter((project: Project) => {
      const lowerQuery = query.toLowerCase();
      return (
        project.Title.toLowerCase().includes(lowerQuery) ||
        project.Screenshot.some((screenshot) => screenshot.toLowerCase().includes(lowerQuery)) ||
        project.Tag.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        project.Description.toLowerCase().includes(lowerQuery) ||
        project.URL.toLowerCase().includes(lowerQuery) ||
        project.Type.toLowerCase().includes(lowerQuery)
      );
    });

    const totalQuery = await sumJsonQuery(filteredProjects);

    return { filteredProjects, totalQuery };
  } catch (error) {
    console.error('Error in filterJson function:', error);
    return null;
  }
}

export default filterJson;
