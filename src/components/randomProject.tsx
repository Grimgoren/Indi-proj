async function randomProject() {
  try {
    const response = await fetch('data/projects.json')
    const data = await response.json()

    const projects = data.Projects

    return projects
  } catch (error) {
    console.error('Error in nextProject function:', error)
    return null
  }
}

export default randomProject
