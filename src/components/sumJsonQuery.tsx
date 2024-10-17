interface Project {
  Title: string
  Description: string
  Summary: string
  Tag: string
  Screenshot: Array<string[]>
  URL: string
  Type: string
}

async function sumJsonQuery(filteredProjects: Project[]): Promise<number> {
  return filteredProjects.length
}

export default sumJsonQuery
