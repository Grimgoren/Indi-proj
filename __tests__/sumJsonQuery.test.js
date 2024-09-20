import '@testing-library/jest-dom';
import sumJsonQuery from '../src/components/sumJsonQuery.tsx';

describe('sumJsonQuery', () => {
  it('correctly sums the number of filtered projects', async () => {
    const filteredProjects = [
      { Title: 'Searchthis', Description: 'Test', Tag: 'Tag1', Screenshot: 'image.png', URL: 'https://example.com', Type: 'Student' },
      { Title: 'OtherProject', Description: 'Test 2', Tag: 'Tag2', Screenshot: 'image2.png', URL: 'https://example2.com', Type: 'Research' },
    ];

    const totalQuery = await sumJsonQuery(filteredProjects);

    expect(totalQuery).toBe(2);
  });

  it('returns 0 when there are no filtered projects', async () => {
    const filteredProjects = [];

    const totalQuery = await sumJsonQuery(filteredProjects);

    expect(totalQuery).toBe(0);
  });
});