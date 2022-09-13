import { getChapterLetter } from "./utils"

describe('getChapterLetter', () => {
  it('shoult return proper letter for columns', () => {
    expect.hasAssertions()
    expect(getChapterLetter(0)).toBe('A')
    expect(getChapterLetter(25)).toBe('Z')
    expect(getChapterLetter(26)).toBe('AA')
    expect(getChapterLetter(36)).toBe('AK')
  })
  it('should throw error for unsupported chapter number', () => {
    expect(() => getChapterLetter(37)).toThrow()
    expect(() => getChapterLetter(999)).toThrow()
  })
})
