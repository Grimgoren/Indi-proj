import '@testing-library/jest-dom'
import readJson from '../src/components/jsonRead.tsx'

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        Projects: [
          {
            Title: 'Test title',
            Description: 'Test description',
            Tag: 'Test tag',
            Screenshot: 'Test screenshot',
            URL: 'Test URL',
          },
        ],
      }),
  })
)

describe('readJson', () => {
  it('fetches JSON data correctly', async () => {
    const data = await readJson()

    expect(global.fetch).toHaveBeenCalledWith('data/projects.json')

    expect(data).toBeDefined()
    expect(data.length).toBeGreaterThan(0)

    const project = data[0]
    expect(project.Title).toBe('Test title')
    expect(project.Description).toBe('Test description')
    expect(project.Tag).toBe('Test tag')
    expect(project.Screenshot).toBe('Test screenshot')
    expect(project.URL).toBe('Test URL')
  })
})
