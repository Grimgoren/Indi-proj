import '@testing-library/jest-dom';
import reloadJson from '../src/components/reloadJson.tsx';
import readJson from '../src/components/jsonRead';

jest.mock("../src/components/jsonRead");

describe("reloadJson", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("should call readJson after 10 minutes", () => {
    reloadJson();

    jest.advanceTimersByTime(600000);

    expect(readJson).toHaveBeenCalled();
  });
});
