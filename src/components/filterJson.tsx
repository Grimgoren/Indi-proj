import sumJsonQuery from './sumJsonQuery'

interface Project {
  Title: string
  Description: string
  Summary: string
  Tag: string
  Screenshot: Array<string[]>
  URL: string
  Type: string
}

async function filterJson(
  query: string
): Promise<{ filteredProjects: Project[]; totalQuery: number } | null> {
  try {
    const response = await fetch('/data/projects.json')
    const data = await response.json()

    const projects: Project[] = data.Projects

    const filteredProjects = projects.filter((project: Project) => {
      return (
        project.Title.includes(query) ||
        project.Screenshot.includes(query) ||
        project.Tag.includes(query) ||
        project.Description.includes(query) ||
        project.URL.includes(query) ||
        project.Type.includes(query)
      )
    })

    const totalQuery = await sumJsonQuery(filteredProjects)

    return { filteredProjects, totalQuery }
  } catch (error) {
    console.error('Error in filterJson function:', error)
    return null
  }
}

export default filterJson
