import '@testing-library/jest-dom'
import readJson from '../src/components/jsonRead.tsx'

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        Projects: [{ Project: 'Test Project', Content: 'Test Content' }],
      }),
  })
)

describe('readJson', () => {
  it('fetches JSON data correctly', async () => {
    const data = await readJson()

    expect(global.fetch).toHaveBeenCalledWith('data/projects.json')

    expect(data).not.toBeNull()
    expect(data.length).toBeGreaterThan(0)
  })
})
