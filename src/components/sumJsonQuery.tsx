interface Project {
  Title: string
  Description: string
  Tag: string
  Screenshot: string
  URL: string
  Type: string
}

async function sumJsonQuery(filteredProjects: Project[]): Promise<number> {
  return filteredProjects.length
}

export default sumJsonQuery
