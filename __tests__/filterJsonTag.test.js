import '@testing-library/jest-dom'
import filterJson from '../src/components/filterJson.tsx'

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        Projects: [
          {
            Title: 'Searchthis',
            Description: 'Test',
            Tag: 'Tag1',
            Screenshot: 'image.png',
            URL: 'https://example.com',
            Type: 'Student',
          },
          {
            Title: 'OtherProject',
            Description: 'Test 2',
            Tag: 'Tag2',
            Screenshot: 'image2.png',
            URL: 'https://example2.com',
            Type: 'Research',
          },
        ],
      }),
  })
)

describe('filterJson', () => {
  it('filters JSON data correctly', async () => {
    const data = await filterJson('Tag1')

    expect(global.fetch).toHaveBeenCalledWith('/data/projects.json')

    expect(data).not.toBeNull()
    expect(data.filteredProjects.length).toBeGreaterThan(0)

    expect(data.filteredProjects).toEqual([
      {
        Title: 'Searchthis',
        Description: 'Test',
        Tag: 'Tag1',
        Screenshot: 'image.png',
        URL: 'https://example.com',
        Type: 'Student',
      },
    ])
  })
})
