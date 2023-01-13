import { getChapterLetter } from "./utils"

describe('getChapterLetter', () => {
  it('shoult return proper letter for columns', () => {
    expect.hasAssertions()
    expect(getChapterLetter(1)).toBe('D')
    expect(getChapterLetter(23)).toBe('Z')
    expect(getChapterLetter(24)).toBe('AA')
    expect(getChapterLetter(25)).toBe('AB')
    expect(getChapterLetter(26)).toBe('AC')
    expect(getChapterLetter(37)).toBe('AN')
  })
  it('should throw error for unsupported chapter number', () => {
    expect(() => getChapterLetter(38)).toThrow()
    expect(() => getChapterLetter(999)).toThrow()
  })
})
