import '@testing-library/jest-dom'
import reloadJson from '../src/components/reloadJson.tsx'
import readJson from '../src/components/jsonRead'

jest.mock('../src/components/jsonRead')

describe('reloadJson', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  beforeEach(() => {
    readJson.mockResolvedValue({
      Projects: [
        { Title: 'Project A', Description: 'Description A' },
        { Title: 'Project B', Description: 'Description B' }
      ]
    })
  })

  it('should call readJson after 10 minutes', async () => {
    await reloadJson()

    jest.advanceTimersByTime(600000)

    expect(readJson).toHaveBeenCalled()
  })
})
